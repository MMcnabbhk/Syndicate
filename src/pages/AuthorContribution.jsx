import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Heart, CreditCard, Lock, MapPin, Loader2 } from 'lucide-react';
import { useNovel, useAuthor } from '../hooks/useData';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe (User needs to add their key to .env)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

// Payment Form Sub-component
const PaymentForm = ({ amount, targetName, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsProcessing(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: `${window.location.origin}/payment-success`,
            },
            redirect: 'if_required'
        });

        if (error) {
            setMessage(error.message);
            setIsProcessing(false);
        } else {
            // Payment succeeded!
            onSuccess();
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-4">
                <PaymentElement
                    options={{
                        theme: 'night',
                        variables: { colorPrimary: '#8b5cf6', colorBackground: '#09090b', colorText: '#ffffff' }
                    }}
                />
            </div>
            {message && <div className="text-red-400 text-sm bg-red-900/10 p-3 rounded-lg border border-red-900/20">{message}</div>}

            <button
                type="submit"
                disabled={!stripe || isProcessing}
                style={{ backgroundColor: '#f97316' }}
                className="w-full py-3 hover:bg-orange-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isProcessing ? <Loader2 className="animate-spin" /> : <><Lock size={18} /> Pay ${amount}</>}
            </button>
        </form>
    );
};

const US_STATES = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const AuthorContribution = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const isAuthorMode = location.pathname.includes('/author/');

    const { data: book, loading: bookLoading, error: bookError } = useNovel(!isAuthorMode ? id : null);
    const { data: authorData, loading: authorLoading, error: authorError } = useAuthor(isAuthorMode ? id : null);

    const loading = isAuthorMode ? authorLoading : bookLoading;
    const error = isAuthorMode ? authorError : bookError;

    // Normalize data (Handling null authorData)
    const entity = isAuthorMode ? (authorData ? {
        id: authorData.id,
        title: `Your Contribution to ${authorData.name}`,
        author: authorData.name
    } : null) : book;

    const [amount, setAmount] = useState(5);
    const [customAmount, setCustomAmount] = useState('');
    const [note, setNote] = useState('');
    const [clientSecret, setClientSecret] = useState('');

    const currentAmount = customAmount ? parseFloat(customAmount) : amount;
    const displayAmount = isNaN(currentAmount) ? '0.00' : currentAmount.toFixed(2);

    const [paymentError, setPaymentError] = useState(null);

    // Fetch PaymentIntent when amount changes (Debounce could be added)
    React.useEffect(() => {
        if (!currentAmount || currentAmount <= 0) return;

        const createIntent = async () => {
            setPaymentError(null);
            try {
                const res = await fetch('/api/payments/create-payment-intent', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: currentAmount, currency: 'usd' }),
                });

                if (!res.ok) {
                    const err = await res.json();
                    if (res.status === 503 && err.code === 'STRIPE_NOT_CONFIGURED') {
                        setPaymentError('Stripe API keys are missing. Please configure .env');
                        return;
                    }
                    throw new Error(err.error || 'Failed to initialize payment');
                }

                const data = await res.json();
                if (data.clientSecret) {
                    setClientSecret(data.clientSecret);
                }
            } catch (err) {
                console.error("Failed to create payment intent", err);
                setPaymentError(err.message);
            }
        };
        // Simple debounce
        const timeout = setTimeout(createIntent, 500);
        return () => clearTimeout(timeout);
    }, [currentAmount]);

    const handleSuccess = async () => {
        // Create notification on success
        try {
            await fetch('/api/notifications/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'money',
                    title: 'New Contribution Sent',
                    message: `You contributed $${displayAmount} to ${entity.author}.`,
                    userId: 'demo-user-id'
                })
            });
            alert(`Thank you for your contribution of $${displayAmount}! Your note has been sent to ${entity.author}.`);
        } catch (e) {
            console.error(e);
        }
    };

    const handlePayPal = () => {
        alert("PayPal flow logic would go here.");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
            </div>
        );
    }

    if (!entity) return <div className="container py-20 text-center text-white">Author Not Found</div>;

    const appearance = {
        theme: 'night',
        variables: { colorPrimary: '#8b5cf6', colorBackground: '#09090b', colorText: '#ffffff' }
    };

    return (
        <div className="container py-10 max-w-6xl">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            >
                <ArrowLeft size={20} /> Back
            </button>
            <div style={{ height: '15px' }} />

            <div className="grid md:grid-cols-12 gap-12">
                {/* Left Column: Context / Summary */}
                <div className="md:col-span-4 space-y-8">


                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">

                        <h2 className="text-xl font-bold text-white mb-1">{entity.title}</h2>
                        {!isAuthorMode && <p className="text-zinc-400 mb-4">by <span className="text-white">{entity.author}</span></p>}

                        <div className="border-t border-zinc-700 pt-4 mt-4">
                            <div className="flex items-center justify-between text-zinc-300 mb-2">
                                <span>Contribution</span>
                                <span>${displayAmount}</span>
                            </div>
                            <div className="flex items-center justify-between text-zinc-500 text-sm mb-4">
                                <span>Processing Fee</span>
                                <span>$0.00</span>
                            </div>
                            <div className="flex items-center justify-between text-white font-bold text-lg border-t border-zinc-700 pt-4">
                                <span>Total</span>
                                <span>${displayAmount}</span>
                            </div>
                            <div style={{ height: '15px' }} />
                        </div>
                    </div>

                    <div>
                        <div className="bg-violet-900/10 border border-violet-500/20 rounded-xl p-4 flex gap-4 items-start">
                            <Heart className="text-violet-400 shrink-0 mt-1" size={24} />
                            <div>
                                <p className="text-violet-200 text-sm font-medium">100% goes to the author</p>
                                <p className="text-violet-300/70 text-xs mt-1 mb-3">Your support directly helps {entity.author} create more art.</p>
                                <div className="h-6"></div>
                                <p className="text-white text-xs leading-relaxed">
                                    <span className="text-orange-500">Syndicate</span> is a platform built to support creators. Creators contribute a small fixed amount each month to the costs of operating the platform. The balance of contributions less Stripe payment processing fees (3.4%) goes to the author.
                                </p>
                            </div>
                        </div>

                        <div style={{ height: '30px' }} />

                        <div>
                            <h3 className="text-xl font-bold text-white" style={{ marginBottom: '10px' }}>
                                Send A Note <span className="text-zinc-500 text-sm font-normal">(with your contribution)</span>
                            </h3>
                            <textarea
                                rows={12}
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-violet-500 transition-colors resize-none"
                                placeholder={`${entity.author} would love to hear from you.`}
                            />
                            <div style={{ height: '40px' }} />
                        </div>
                    </div>
                </div>

                {/* Right Column: Address & Payment Form */}
                <div className="md:col-span-8">
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 md:p-10">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-4">Checkout</h1>
                            <p className="text-zinc-400">Complete your contribution details below. {entity.author} will appreciate it.</p>
                        </div>
                        <div style={{ height: '15px' }} />
                        <h3 className="text-xl font-bold text-white mb-6">Contribution Amount</h3>
                        <div className="flex flex-wrap items-center gap-8 mb-10">
                            {[5, 10, 20].map(opt => (
                                <div
                                    key={opt}
                                    onClick={() => { setAmount(opt); setCustomAmount(''); }}
                                    className="flex items-center gap-3 cursor-pointer group"
                                >
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${amount === opt && !customAmount ? 'border-violet-500' : 'border-zinc-600 group-hover:border-zinc-500'}`}>
                                        {amount === opt && !customAmount && <div className="w-3 h-3 rounded-full bg-violet-500" />}
                                    </div>
                                    <span className={`text-lg font-medium ${amount === opt && !customAmount ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-300'}`}>${opt.toFixed(2)}</span>
                                </div>
                            ))}


                        </div>

                        <div className="space-y-8">
                            {/* Payment Method */}
                            <div>
                                <div style={{ height: '20px' }} />
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    Payment Method <CreditCard size={20} className="text-zinc-500" />
                                </h3>

                                {paymentError ? (
                                    <div className="text-red-400 bg-red-900/10 border border-red-900/20 p-6 rounded-xl flex items-center gap-3">
                                        <div className="bg-red-900/30 p-2 rounded-full"><Lock size={20} /></div>
                                        <div>
                                            <p className="font-bold">Payment System Unavailable</p>
                                            <p className="text-sm opacity-80">{paymentError}</p>
                                        </div>
                                    </div>
                                ) : clientSecret ? (
                                    <div className="mb-6">
                                        <Elements options={{ clientSecret, appearance }} stripe={stripePromise}>
                                            <PaymentForm
                                                amount={displayAmount}
                                                targetName={entity.author}
                                                onSuccess={handleSuccess}
                                            />
                                        </Elements>
                                    </div>
                                ) : (
                                    <div className="text-zinc-500 bg-zinc-900/30 border border-dashed border-zinc-800 p-8 rounded-xl text-center">
                                        Loading secure payment gateway...
                                    </div>
                                )}

                                <div className="text-center">
                                    <button
                                        onClick={handlePayPal}
                                        className="px-8 bg-[#0070BA]/10 hover:bg-[#0070BA]/20 text-[#0070BA] font-bold py-3 rounded-xl inline-flex items-center justify-center gap-2 transition-all border border-[#0070BA]/30 w-full"
                                    >
                                        Pay with PayPal
                                    </button>
                                </div>
                            </div>

                            {/* Billing Address */}
                            <div>
                                <div style={{ height: '10px' }} />
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    Billing Address <MapPin size={20} className="text-zinc-500" />
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '10px' }}>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-white mb-2">Full Name</label>
                                        <input type="text" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors" placeholder="John Doe" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-white mb-2">Street Address</label>
                                        <input type="text" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors" placeholder="123 Main St" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-white mb-2">City</label>
                                        <input type="text" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors" placeholder="New York" />
                                    </div>
                                    <div className="md:col-span-2" style={{ display: 'flex', gap: '16px' }}>
                                        <div style={{ width: '140px' }}>
                                            <label className="block text-sm font-medium text-white mb-2">State</label>
                                            <input type="text" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors" placeholder="NY" />
                                        </div>
                                        <div style={{ width: '140px' }}>
                                            <label className="block text-sm font-medium text-white mb-2">Zip</label>
                                            <input type="text" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors" placeholder="10001" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="border-t border-zinc-800 flex flex-col items-center">
                                <div style={{ height: '20px' }} />

                                {/* The Stripe payment button is now inside PaymentForm */}
                                {/* The PayPal button is moved here and styled */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthorContribution;
