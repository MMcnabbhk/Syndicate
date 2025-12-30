import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, CreditCard, Lock, MapPin } from 'lucide-react';
import { BOOKS } from '../data/mockData';

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
    const book = BOOKS.find(b => b.id === id);
    const [amount, setAmount] = useState(5);
    const [customAmount, setCustomAmount] = useState('');
    const [note, setNote] = useState('');

    const currentAmount = customAmount ? parseFloat(customAmount) : amount;
    const displayAmount = isNaN(currentAmount) ? '0.00' : currentAmount.toFixed(2);

    const handlePay = () => {
        console.log('Processing payment:', {
            bookId: book.id,
            bookTitle: book.title,
            author: book.author,
            amount: currentAmount,
            note: note
        });
        alert(`Thank you for your contribution of $${displayAmount}! Your note has been sent to ${book.author}.`);
    };

    const handlePayPal = () => {
        console.log('Processing PayPal payment:', {
            bookId: book.id,
            bookTitle: book.title,
            author: book.author,
            amount: currentAmount,
            note: note,
            provider: 'PayPal'
        });
        alert(`Redirecting to PayPal for contribution of $${displayAmount}...`);
    };

    if (!book) return <div className="container py-20 text-center text-white">Book not found</div>;

    return (
        <div className="container py-10 max-w-6xl">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            >
                <ArrowLeft size={20} /> Back to Book
            </button>
            <div style={{ height: '15px' }} />

            <div className="grid md:grid-cols-12 gap-12">
                {/* Left Column: Context / Summary */}
                <div className="md:col-span-4 space-y-8">


                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">

                        <h2 className="text-xl font-bold text-white mb-1">{book.title}</h2>
                        <p className="text-zinc-400 mb-4">by <span className="text-white">{book.author}</span></p>

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
                                <p className="text-violet-300/70 text-xs mt-1 mb-3">Your support directly helps {book.author} create more content.</p>
                                <div className="h-6"></div>
                                <p className="text-white text-xs leading-relaxed">
                                    <span className="text-orange-500">Syndicate</span> is a platform built by creators to support creators. Authors contribute $2.00 a month to the costs of operating the platform. The balance of contributions less Stripe payment processing fees (3.4%) goes to the author.
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
                                placeholder={`${book.author} would love to hear from you.`}
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
                            <p className="text-zinc-400">Complete your contribution details below. {book.author} will appreciate it.</p>
                        </div>
                        <div style={{ height: '15px' }} />
                        <h3 className="text-xl font-bold text-white mb-6">Contribution Amount</h3>
                        <div className="flex flex-wrap items-center gap-8 mb-10">
                            {[2, 5, 10].map(opt => (
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
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white mb-2">Card Number</label>
                                        <div className="relative">
                                            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                                            <input type="text" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors" placeholder="0000 0000 0000 0000" />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        <div style={{ width: '140px' }}>
                                            <label className="block text-sm font-medium text-white mb-2">Expiration</label>
                                            <input type="text" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors" placeholder="MM / YY" />
                                        </div>
                                        <div style={{ width: '140px' }}>
                                            <label className="block text-sm font-medium text-white mb-2">CVC</label>
                                            <input type="text" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors" placeholder="123" />
                                        </div>
                                    </div>
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
                                <button
                                    onClick={handlePay}
                                    style={{ backgroundColor: '#f97316', padding: '12px 32px' }}
                                    className="hover:bg-orange-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/20 mb-4 hover:opacity-90"
                                >
                                    <Lock size={18} /> Pay ${displayAmount}
                                </button>
                                <button
                                    onClick={handlePayPal}
                                    className="px-8 bg-[#0070BA]/10 hover:bg-[#0070BA]/20 text-[#0070BA] font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all border border-[#0070BA]/30"
                                >
                                    Pay with PayPal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthorContribution;
