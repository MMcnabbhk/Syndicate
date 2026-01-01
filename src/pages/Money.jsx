import React, { useState } from 'react';
import { DollarSign, CreditCard, Landmark, FileText, ArrowUpRight, ArrowDownLeft, Calendar } from 'lucide-react';

const Money = () => {
    const [payoutMethod, setPayoutMethod] = useState('paypal');

    // Mock Transaction Data
    const transactions = [
        { id: 1, type: 'royalty', desc: 'Royalty for "The Silent Echo" (Jan)', amount: 450.20, date: 'Feb 1, 2026', status: 'Completed' },
        { id: 2, type: 'subscription', desc: 'Monthly Subscriber Revenue', amount: 125.00, date: 'Feb 1, 2026', status: 'Completed' },
        { id: 3, type: 'payout', desc: 'Withdrawal to PayPal', amount: -500.00, date: 'Jan 15, 2026', status: 'Completed' },
    ];

    return (
        <div className="min-h-screen bg-[#111111] text-white py-10">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-200">Financials</h1>
                    <p className="text-zinc-400 mt-1">Track your earnings and manage payouts.</p>
                </div>

                {/* Balance & Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="md:col-span-2 bg-gradient-to-br from-emerald-900/30 to-teal-900/10 border border-emerald-500/20 rounded-2xl p-8 relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="text-emerald-400/80 font-medium mb-1 flex items-center gap-2">
                                <DollarSign size={18} /> Available Balance
                            </div>
                            <div className="text-5xl font-bold text-white mb-6">$1,250.50</div>
                            <div className="flex gap-4">
                                <button className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-lg shadow-emerald-900/20 transition-all flex items-center gap-2">
                                    <ArrowUpRight size={18} />
                                    Withdraw Funds
                                </button>
                                <button className="px-6 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-all">
                                    View Reports
                                </button>
                            </div>
                        </div>
                        {/* Blob decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
                    </div>

                    <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 flex flex-col justify-center gap-4">
                        <h3 className="font-bold text-zinc-300">Quick Stats (This Month)</h3>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-zinc-500">Gross Revenue</span>
                            <span className="font-medium">$1,450.00</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-zinc-500">Platform Fees</span>
                            <span className="font-medium text-red-400">-$145.00</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-zinc-500">Net Profit</span>
                            <span className="font-bold text-emerald-400">$1,305.00</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Transactions List */}
                    <section>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Calendar size={20} className="text-zinc-400" />
                            Recent Activity
                        </h2>
                        <div className="bg-[#1a1a1a] border border-white/5 rounded-xl overflow-hidden">
                            {transactions.map((tx) => (
                                <div key={tx.id} className="p-4 border-b border-white/5 last:border-0 flex items-center justify-between hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.amount > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {tx.amount > 0 ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                                        </div>
                                        <div>
                                            <div className="font-medium text-zinc-200">{tx.desc}</div>
                                            <div className="text-xs text-zinc-500">{tx.date} • {tx.status}</div>
                                        </div>
                                    </div>
                                    <div className={`font-bold ${tx.amount > 0 ? 'text-emerald-400' : 'text-zinc-300'}`}>
                                        {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 py-2 text-sm text-zinc-500 hover:text-white transition-colors">View All Transactions</button>
                    </section>

                    {/* Settings / Payout Methods */}
                    <section>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <CreditCard size={20} className="text-zinc-400" />
                            Payout Methods
                        </h2>
                        <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-6 space-y-6">
                            {/* PayPal Option */}
                            <label className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all ${payoutMethod === 'paypal' ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 hover:border-white/20'}`}>
                                <input
                                    type="radio"
                                    name="payout"
                                    value="paypal"
                                    checked={payoutMethod === 'paypal'}
                                    onChange={() => setPayoutMethod('paypal')}
                                    className="mt-1"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 font-bold text-white mb-1">
                                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold">P</div>
                                        PayPal
                                    </div>
                                    <p className="text-sm text-zinc-400">Withdraw earnings to your PayPal account. Funds arrive in 1-2 business days.</p>
                                </div>
                            </label>

                            {/* Bank Transfer Option */}
                            <label className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all ${payoutMethod === 'bank' ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 hover:border-white/20'}`}>
                                <input
                                    type="radio"
                                    name="payout"
                                    value="bank"
                                    checked={payoutMethod === 'bank'}
                                    onChange={() => setPayoutMethod('bank')}
                                    className="mt-1"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 font-bold text-white mb-1">
                                        <Landmark size={18} />
                                        Bank Transfer
                                    </div>
                                    <p className="text-sm text-zinc-400">Direct deposit to your local bank account. Processing time: 3-5 business days.</p>
                                </div>
                            </label>

                            <hr className="border-white/10" />

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-zinc-400">
                                    <FileText size={18} />
                                    <span className="text-sm">Tax Information</span>
                                </div>
                                <button className="text-sm text-emerald-400 hover:text-emerald-300">Update W-9 / W-8BEN</button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Money;
