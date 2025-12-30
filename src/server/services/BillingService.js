// src/server/services/BillingService.js
import Subscription from '../models/Subscription.js';
import Poem from '../models/Poem.js';
import ShortStory from '../models/ShortStory.js';
import Audiobook from '../models/Audiobook.js';
import PoetryCollection from '../models/PoetryCollection.js';
import Novel from '../models/Novel.js';
import { addMonths } from 'date-fns';
import Stripe from 'stripe';

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
