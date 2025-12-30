import express from 'express';
import BillingService from '../services/BillingService.js';
import Subscription from '../models/Subscription.js';
import Poem from '../models/Poem.js';
import ShortStory from '../models/ShortStory.js';
import Audiobook from '../models/Audiobook.js';
import PoetryCollection from '../models/PoetryCollection.js';
import Novel from '../models/Novel.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Parser for non-webhook routes (manually applied since it's mounted above global parser in index.js)
const jsonParser = express.json();

router.post('/subscribe', jsonParser, authMiddleware, async (req, res) => {
    // Legacy mock endpoint - now redirects to create-checkout-session in practice
    res.status(400).json({ error: 'Please use /create-checkout-session' });
});

router.post('/create-checkout-session', jsonParser, authMiddleware, async (req, res) => {
    const { workId, workType, successUrl, cancelUrl } = req.body;

    try {
        let work;
        const type = workType?.toLowerCase();
        if (type === 'poem' || type === 'poetry') work = await Poem.findById(workId);
        else if (type === 'short fiction' || type === 'short story') work = await ShortStory.findById(workId);
        else if (type === 'audiobook' || type === 'audiobooks') work = await Audiobook.findById(workId);
        else if (type === 'poetry collection' || type === 'poetry_collections') work = await PoetryCollection.findById(workId);
        else if (type === 'novel' || type === 'novels') work = await Novel.findById(workId);

        if (!work) return res.status(404).json({ error: 'Work not found' });

        const session = await BillingService.createCheckoutSession(
            req.user.id,
            workId,
            work.title,
            work.price_monthly,
            successUrl,
            cancelUrl
        );

        res.json(session);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Webhook endpoint (Requires raw body!)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = BillingService.verifyWebhook(req.body, sig, endpointSecret);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.metadata.userId;
        const workId = session.metadata.workId;

        await BillingService.fulfillSubscription(userId, workId);
        console.log(`[Stripe] Subscription fulfilled for user ${userId} and work ${workId}`);
    }

    res.json({ received: true });
});

router.get('/status/:workId', jsonParser, authMiddleware, async (req, res) => {
    try {
        const sub = await Subscription.findByUserAndWork(req.user.id, req.params.workId);
        res.json({ subscribed: !!sub, subscription: sub });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
