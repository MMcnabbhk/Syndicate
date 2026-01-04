// src/server/services/BillingService.js
import Subscription from '../models/Subscription.js';
import Poem from '../models/Poem.js';
import ShortStory from '../models/ShortStory.js';
import Audiobook from '../models/Audiobook.js';
import PoetryCollection from '../models/PoetryCollection.js';
import Novel from '../models/Novel.js';
import { addMonths } from 'date-fns';
import Stripe from 'stripe';
import notify from '../utils/notify.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock');

export default class BillingService {
    /**
     * verifyAccess checks if a specific user can view a specific work.
     * Logic:
     * 1. If releaseDay is 0 (first chapter), it's always free.
     * 2. If priceMonthly is 0, it's a free series.
     * 3. Otherwise, check for an active subscription.
     */
    static async verifyAccess(userId, workOrId, workType, chapterNum, releaseDay) {
        let work = workOrId;

        // If workId provided instead of object, fetch it
        if (typeof workOrId === 'number' || typeof workOrId === 'string') {
            const type = workType?.toLowerCase();
            if (type === 'poem' || type === 'poetry') work = await Poem.findById(workOrId);
            else if (type === 'short fiction' || type === 'short story') work = await ShortStory.findById(workOrId);
            else if (type === 'audiobook' || type === 'audiobooks') work = await Audiobook.findById(workOrId);
            else if (type === 'poetry collection' || type === 'poetry_collections') work = await PoetryCollection.findById(workOrId);
            else if (type === 'novel' || type === 'novels') work = await Novel.findById(workOrId);
        }

        if (!work) return false;

        // Free content (first chapter or free series)
        if (releaseDay === 0 || work.price_monthly === 0) {
            return true;
        }

        if (!userId) return false;

        // Check subscription
        const subscription = await Subscription.findByUserAndWork(userId, work.id);
        return !!subscription;
    }

    /**
     * Creates a real Stripe Checkout session.
     */
    static async createCheckoutSession(userId, workId, workTitle, price, successUrl, cancelUrl) {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `Monthly Subscription: ${workTitle}`,
                    },
                    unit_amount: Math.round(price * 100),
                    recurring: { interval: 'month' },
                },
                quantity: 1,
            }],
            mode: 'subscription',
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: {
                userId: userId.toString(),
                workId: workId.toString()
            }
        });

        return { url: session.url };
    }

    /**
     * Fulfills a subscription after successful payment.
     */
    static async fulfillSubscription(userId, workId) {
        const currentPeriodEnd = addMonths(new Date(), 1);

        await Subscription.create({
            user_id: userId,
            work_id: workId,
            status: 'active',
            current_period_end: currentPeriodEnd
        });

        // Notify Author
        try {
            // Try to find the work (and author) - we check Novel first as it's the primary use case
            // If it's another type, we should check those too, or query a unified view if we had one.
            // For now, check Novel, if not found check ShortStory, Poem, etc. or just query generic author_id from known tables?
            // Simplest: Check all models or use a raw query if we don't know the type.
            // However, we don't have db imported here directly maybe?
            // Actually, we can use the Models.
            let work = await Novel.findById(workId) ||
                await ShortStory.findById(workId) ||
                await Poem.findById(workId) ||
                await Audiobook.findById(workId) ||
                await PoetryCollection.findById(workId);

            if (work && work.author_id) {
                await notify.send(
                    work.author_id,
                    'release', // Using release (Star) or maybe 'money' (Dollar) for subscription? User asked for Fan notification for following work.
                    // 'fan' type is for signup. For work follow, maybe we stick to 'release' (Star) or 'money' (Dollar)?
                    // User said: "add a new Fan notification when a new reader signs up and follows a work or creator"
                    // Maybe use 'fan' for both?
                    'fan',
                    'New Subscriber',
                    `A user has subscribed to your work: ${work.title}`
                );
            }
        } catch (err) {
            console.error('[BillingService] Notification error:', err);
        }

        return { success: true };
    }

    /**
     * Verifies Stripe webhook signature and returns the event.
     */
    static verifyWebhook(payload, sig, secret) {
        return stripe.webhooks.constructEvent(payload, sig, secret);
    }

    /**
     * Mocks a Stripe checkout session creation (LEGACY/BACKWARD COMPAT).
     */
    static async createSubscription(userId, workId) {
        return this.fulfillSubscription(userId, workId);
    }
}
