import React, { useState } from 'react';
import { DollarSign, CreditCard, Landmark, FileText, ArrowUpRight, ArrowDownLeft, Calendar, AlertCircle } from 'lucide-react';

const Money = () => {
    const [payoutMethod, setPayoutMethod] = useState('paypal');

    // Mock Transaction Data
    // Mock Transaction Data
    // Mock Transaction Data
    const transactions = [
        { id: 1, type: 'contribution', desc: 'Contribution from @reader_one', amount: 50.00, date: 'Feb 12, 2026', status: 'Completed', balance: 1350.50 },
        { id: 2, type: 'fee', desc: 'Stripe Fee (3.4% + $0.35)', amount: -2.05, date: 'Feb 12, 2026', status: 'Deducted', balance: 1348.45 },
        { id: 3, type: 'contribution', desc: 'Contribution from @fan_user_99', amount: 10.00, date: 'Feb 14, 2026', status: 'Completed', balance: 1358.45 },
        { id: 4, type: 'fee', desc: 'Stripe Fee (3.4% + $0.35)', amount: -0.69, date: 'Feb 14, 2026', status: 'Deducted', balance: 1357.76 },
        { id: 5, type: 'platform', desc: 'Platform Operations (Monthly)', amount: -4.00, date: 'Feb 15, 2026', status: 'Billed', balance: 1353.76 },
        { id: 6, type: 'payout', desc: 'Withdrawal to PayPal', amount: -100.00, date: 'Feb 16, 2026', status: 'Processing', balance: 1253.76 },
    ];

    return (
        <div className="min-h-screen bg-[#111111] text-white py-10">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Header */}
                <div className="relative mb-6">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Financials</span>
                        </h1>
                        <p className="mt-4 text-xl text-zinc-400 mx-auto" style={{ color: '#a1a1aa' }}>
                            One Less dollar for Zukerberg. One more dollar for you.
                        </p>
                        <div style={{ height: '40px' }}></div>
                    </div>
                </div>

                {/* Balance & Actions */}
                {/* Balance & Actions */}
                <div className="mb-10">
                    <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/10 border border-emerald-500/20 rounded-2xl p-8 relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="text-emerald-400/80 font-medium mb-1 flex items-center gap-2">
                                <DollarSign size={18} /> Available Balance
                            </div>
                            <div className="text-5xl font-bold text-white mb-6">$1,250.50</div>
                            <p className="text-sm text-emerald-400">You may withdraw funds when your balance exceeds $40.00</p>
                        </div>
                        {/* Blob decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Transactions List */}
                    <section>
                        <div style={{ height: '30px' }}></div>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Calendar size={20} className="text-zinc-400" />
                            Recent Activity
                        </h2>
                        <div className="bg-[#1a1a1a] border border-white/5 rounded-xl overflow-hidden">
                            <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 text-sm font-bold text-zinc-500 uppercase tracking-wider">
                                <div className="col-span-6">Transaction</div>
                                <div className="col-span-3 text-right">Amount</div>
                                <div className="col-span-3 text-right">Balance Due</div>
                            </div>
                            {transactions.map((tx) => (
                                <div key={tx.id} className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 last:border-0 items-center hover:bg-white/5 transition-colors">
                                    <div className="col-span-6 flex items-center gap-4">
                                        <div className="min-w-0">
                                            <div className="font-medium text-zinc-200 truncate">{tx.desc}</div>
                                            <div className="text-xs text-zinc-500">{tx.date} • {tx.status}</div>
                                        </div>
                                    </div>
                                    <div className={`col-span-3 text-right font-bold ${tx.amount > 0 ? 'text-emerald-400' : 'text-zinc-300'}`}>
                                        {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                                    </div>
                                    <div className="col-span-3 text-right font-medium text-zinc-400">
                                        ${tx.balance?.toFixed(2) || '0.00'}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 py-2 text-sm text-zinc-500 hover:text-white transition-colors">View All Transactions</button>
                    </section>

                    {/* Settings / Payout Methods */}
                    <section>
                        <div style={{ height: '30px' }}></div>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <CreditCard size={20} className="text-zinc-400" />
                            Payout Methods
                        </h2>
                        <div style={{ height: '10px' }}></div>
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
                            <div style={{ height: '30px' }}></div>
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

                            <div style={{ marginTop: '10px', marginBottom: '10px', marginLeft: '28px' }}>
                                <button
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all"
                                    style={{
                                        backgroundColor: '#1a1a1a',
                                        border: '1px solid #3f3f46',
                                        color: '#34d399',
                                        fontSize: '14px'
                                    }}
                                >
                                    <Landmark size={16} />
                                    Connect Bank Account
                                </button>
                            </div>

                        </div>
                    </section>

                    {/* Tax Information Section */}
                    <section>
                        <div style={{ height: '30px' }}></div>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <FileText size={20} className="text-zinc-400" />
                            Tax Information
                        </h2>
                        <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-6 space-y-6">
                            <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg flex gap-3 text-sm text-emerald-200/80">
                                <FileText size={18} className="shrink-0 text-emerald-400" />
                                <div>
                                    <span className="font-bold text-emerald-400">Important:</span> This information must match your legal documents exactly to process payouts.
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div style={{ height: '10px' }}></div>
                                    <label className="block text-sm font-bold text-zinc-400 mb-1">Legal Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                        placeholder="e.g. Michael Smith"
                                    />
                                </div>

                                <div>
                                    <div style={{ height: '10px' }}></div>
                                    <label className="block text-sm font-bold text-zinc-400 mb-1">Tax ID / SSN / EIN</label>
                                    <input
                                        type="text"
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                        placeholder="000-00-0000"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <div style={{ height: '10px' }}></div>
                                        <label className="block text-sm font-bold text-zinc-400 mb-1">Address Line 1</label>
                                        <input
                                            type="text"
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                            placeholder="Street address, P.O. box"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-zinc-400 mb-1">Address Line 2 <span className="text-zinc-600 font-normal">(Optional)</span></label>
                                        <input
                                            type="text"
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                            placeholder="Apartment, suite, unit, etc."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-zinc-400 mb-1">City</label>
                                        <input
                                            type="text"
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-zinc-400 mb-1">State / Province</label>
                                        <input
                                            type="text"
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-zinc-400 mb-1">ZIP / Postal Code</label>
                                        <input
                                            type="text"
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-zinc-400 mb-1">Country</label>
                                        <select className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none cursor-pointer">
                                            <option>United States</option>
                                            <option>Canada</option>
                                            <option>United Kingdom</option>
                                            <option>Australia</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </section>
                </div>

                {/* Save Button */}
                <div className="flex flex-col items-center">
                    <div style={{ height: '40px' }}></div>
                    <button
                        className="w-full md:w-auto min-w-[240px] px-12 py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-900/20 hover:opacity-90 text-white"
                        style={{ backgroundColor: '#cc5500' }}
                    >
                        <FileText size={20} />
                        <span>Save</span>
                    </button>
                    <div style={{ height: '50px' }}></div>
                </div>
            </div>
        </div>
    );
};

export default Money;
