
import express from 'express';
import Stripe from 'stripe';
import db from '../db.js'; // Assuming we might want to log attempts later

const router = express.Router();

// Initialize Stripe - fallback to a placeholder if missing (handled gracefully)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

router.post('/create-payment-intent', async (req, res) => {
    try {
        if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('placeholder')) {
            return res.status(503).json({
                error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to .env',
                code: 'STRIPE_NOT_CONFIGURED'
            });
        }

        const { amount, currency = 'usd', metadata } = req.body;

        // Validation
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency,
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: metadata || {}
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error('Stripe Error:', error);

        // Specific error handling for missing key during dev
        if (error.type === 'StripeAuthenticationError') {
            return res.status(500).json({
                error: 'Stripe API Key missing or invalid. Please check server .env',
                code: 'MISSING_API_KEY'
            });
        }

        res.status(500).json({ error: error.message });
    }
});

export default router;
