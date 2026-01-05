import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Download, Eye, X, Check, ArrowRight } from 'lucide-react';

const mockFinancials = [
    { id: '1', name: 'Jane Smith', email: 'jane@author.com', balance: 1250.50, pendingPayouts: 0, lastPayout: '2025-12-15' },
    { id: '2', name: 'Robert Johnson', email: 'rob@writer.com', balance: 340.00, pendingPayouts: 1, lastPayout: '2025-11-20' },
    { id: '3', name: 'Sarah Wilson', email: 'sarah@poet.com', balance: 890.75, pendingPayouts: 0, lastPayout: '2025-12-28' },
    { id: '4', name: 'Mike Brown', email: 'mike@scifi.com', balance: 2100.25, pendingPayouts: 2, lastPayout: '2025-10-10' },
];

const mockTransactions = [
    { id: 'tx_1', date: '2026-01-01', description: 'Subscription Revenue - Dec 2025', amount: 450.00, type: 'credit' },
    { id: 'tx_2', date: '2025-12-15', description: 'Payout via PayPal', amount: -200.00, type: 'debit', status: 'completed' },
    { id: 'tx_3', date: '2025-12-01', description: 'Work Purchase - "The Void"', amount: 25.00, type: 'credit' },
];

const AdminFinancials = () => {
    const [creators, setCreators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCreator, setSelectedCreator] = useState(null); // For viewing details/recording payout
    const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
    const [filterType, setFilterType] = useState('all'); // 'all', 'pending', 'balance'

    // Payout Form State
    const [payoutAmount, setPayoutAmount] = useState('');
    const [payoutMethod, setPayoutMethod] = useState('paypal');
    const [payoutReference, setPayoutReference] = useState('');

    useEffect(() => {
        // Simulate fetch
        setTimeout(() => {
            setCreators(mockFinancials);
            setLoading(false);
        }, 600);
    }, []);

    const handleOpenPayout = (creator) => {
        setSelectedCreator(creator);
        setPayoutAmount(creator.balance.toString()); // Default to full balance
        setIsPayoutModalOpen(true);
    };

    const handleRecordPayout = (e) => {
        e.preventDefault();
        // Simulate payout recording
        alert(`Recording payout of $${payoutAmount} to ${selectedCreator.name} via ${payoutMethod}. Notification sent.`);

        // Update local state
        setCreators(creators.map(c =>
            c.id === selectedCreator.id
                ? { ...c, balance: c.balance - parseFloat(payoutAmount) }
                : c
        ));

        setIsPayoutModalOpen(false);
        setSelectedCreator(null);
    };

    const filteredCreators = creators.filter(creator => {
        if (filterType === 'pending') return creator.pendingPayouts > 0;
        if (filterType === 'balance') return creator.balance > 0;
        return true;
    });

    const activeFilterCount = creators.length - filteredCreators.length;

    return (
        <div style={{ margin: '0 auto', maxWidth: '1280px', padding: '2rem 1rem' }}>
            <h1 className="text-3xl font-bold text-white mb-2" style={{ marginBottom: '8px' }}>Financial Management</h1>
            <p className="text-zinc-400" style={{ color: '#a1a1aa' }}>Monitor creator balances and record payouts.</p>
            <div style={{ height: '20px' }}></div>

            {/* Filter Bar */}
            <div style={{
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                padding: '12px 20px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.05)'
            }}>
                <span style={{ color: '#71717a', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase' }}>Filter:</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={() => setFilterType('all')}
                        style={{
                            padding: '6px 16px',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: 'bold',
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: filterType === 'all' ? '#ef4444' : 'transparent',
                            color: filterType === 'all' ? 'white' : '#a1a1aa',
                            transition: 'all 0.2s'
                        }}
                    >
                        All Creators
                    </button>
                    <button
                        onClick={() => setFilterType('pending')}
                        style={{
                            padding: '6px 16px',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: 'bold',
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: filterType === 'pending' ? '#f97316' : 'transparent',
                            color: filterType === 'pending' ? 'white' : '#a1a1aa',
                            transition: 'all 0.2s'
                        }}
                    >
                        Pending Payouts
                    </button>
                    <button
                        onClick={() => setFilterType('balance')}
                        style={{
                            padding: '6px 16px',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: 'bold',
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: filterType === 'balance' ? '#10b981' : 'transparent',
                            color: filterType === 'balance' ? 'white' : '#a1a1aa',
                            transition: 'all 0.2s'
                        }}
                    >
                        With Balance
                    </button>
                </div>
                {filterType !== 'all' && (
                    <button
                        onClick={() => setFilterType('all')}
                        style={{
                            marginLeft: 'auto',
                            color: '#ef4444',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}
                    >
                        <X size={14} /> Clear Filter
                    </button>
                )}
            </div>

            <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 'bold', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}>Creator</th>
                                <th
                                    style={{ padding: '16px', fontSize: '12px', fontWeight: 'bold', color: filterType === 'balance' ? '#10b981' : '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right', cursor: 'pointer' }}
                                    onClick={() => setFilterType(filterType === 'balance' ? 'all' : 'balance')}
                                    title="Click to filter by balance"
                                >
                                    Current Balance
                                </th>
                                <th
                                    style={{ padding: '16px', fontSize: '12px', fontWeight: 'bold', color: filterType === 'pending' ? '#f97316' : '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', cursor: 'pointer' }}
                                    onClick={() => setFilterType(filterType === 'pending' ? 'all' : 'pending')}
                                    title="Click to filter by pending requests"
                                >
                                    Pending Requests
                                </th>
                                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 'bold', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Last Payout</th>
                                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 'bold', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right', borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '32px', textAlign: 'center' }}>
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
                                    </td>
                                </tr>
                            ) : filteredCreators.length > 0 ? (
                                filteredCreators.map((creator) => (
                                    <tr key={creator.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'transparent' }}>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ fontWeight: '500', color: 'white', fontSize: '14px' }}>{creator.name}</div>
                                            <div style={{ fontSize: '12px', color: '#71717a' }}>{creator.email}</div>
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'right', fontWeight: 'bold', color: '#10b981', fontSize: '15px' }}>
                                            ${creator.balance.toFixed(2)}
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'center' }}>
                                            {creator.pendingPayouts > 0 ? (
                                                <button
                                                    onClick={() => setFilterType('pending')}
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        padding: '4px 10px',
                                                        borderRadius: '9999px',
                                                        fontSize: '11px',
                                                        fontWeight: 'bold',
                                                        backgroundColor: 'rgba(249, 115, 22, 0.1)',
                                                        color: '#f97316',
                                                        border: '1px solid rgba(249, 115, 22, 0.2)',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {creator.pendingPayouts} Pending
                                                </button>
                                            ) : (
                                                <span style={{ color: '#3f3f46', fontSize: '12px' }}>-</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'center', color: '#a1a1aa', fontSize: '13px' }}>
                                            {creator.lastPayout || '-'}
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'right' }}>
                                            <button
                                                onClick={() => handleOpenPayout(creator)}
                                                style={{
                                                    backgroundColor: '#16a34a',
                                                    color: 'white',
                                                    padding: '6px 14px',
                                                    borderRadius: '8px',
                                                    fontSize: '12px',
                                                    fontWeight: 'bold',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    transition: 'background-color 0.2s'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#15803d'}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
                                            >
                                                <DollarSign size={14} />
                                                Payout
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-zinc-500">
                                        No creators found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Payout Modal */}
            {isPayoutModalOpen && selectedCreator && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in duration-200">
                        <button
                            onClick={() => setIsPayoutModalOpen(false)}
                            className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-6 border-b border-white/5">
                            <h2 className="text-xl font-bold text-white">Record Payout</h2>
                            <p className="text-sm text-zinc-400 mt-1">
                                Recording payout for <span className="text-white font-medium">{selectedCreator.name}</span>
                            </p>
                        </div>

                        <form onSubmit={handleRecordPayout} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 mb-1">Amount ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    max={selectedCreator.balance}
                                    value={payoutAmount}
                                    onChange={(e) => setPayoutAmount(e.target.value)}
                                    className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500/50 font-mono text-lg"
                                    required
                                />
                                <div className="text-xs text-zinc-500 mt-1 text-right">
                                    Max available: ${selectedCreator.balance.toFixed(2)}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-500 mb-1">Payout Method</label>
                                <select
                                    value={payoutMethod}
                                    onChange={(e) => setPayoutMethod(e.target.value)}
                                    className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500/50"
                                >
                                    <option value="paypal">PayPal</option>
                                    <option value="bank_transfer">Bank Transfer (ACH/Wire)</option>
                                    <option value="check">Physical Check</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-500 mb-1">Transaction Reference / ID</label>
                                <input
                                    type="text"
                                    value={payoutReference}
                                    onChange={(e) => setPayoutReference(e.target.value)}
                                    placeholder="e.g. PP-123456789"
                                    className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500/50"
                                    required
                                />
                            </div>

                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-xs text-blue-300 flex items-start gap-2">
                                <TrendingUp size={14} className="mt-0.5 flex-shrink-0" />
                                <div>
                                    This action will deduct the amount from the creator's balance and send them a notification email.
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2"
                            >
                                <Check size={18} />
                                Confirm Payout
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminFinancials;
