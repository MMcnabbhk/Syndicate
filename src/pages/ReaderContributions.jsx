import React, { useState, useEffect } from 'react';
import { DollarSign, Download, Calendar, ExternalLink } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Mock data
const mockContributions = [
    {
        id: 'tx_123456789',
        date: '2026-01-03',
        amount: 5.00,
        workTitle: 'The Silent Echo',
        authorName: 'Elena Fisher',
        type: 'One-time Support'
    },
    {
        id: 'tx_987654321',
        date: '2025-12-25',
        amount: 10.00,
        workTitle: 'Midnight Gardens',
        authorName: 'Marcus Thorne',
        type: 'Monthly Subscription'
    },
    {
        id: 'tx_456789123',
        date: '2025-11-10',
        amount: 25.00,
        workTitle: 'Chronicles of Aethelgard',
        authorName: 'Sarah J. Miller',
        type: 'Folio Purchase'
    }
];

const ReaderContributions = () => {
    const [contributions, setContributions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate fetch
        setTimeout(() => {
            setContributions(mockContributions);
            setLoading(false);
        }, 800);
    }, []);

    const handleDownloadReceipt = (transactionId) => {
        const transaction = contributions.find(t => t.id === transactionId);
        if (!transaction) return;

        const doc = new jsPDF();

        // Header
        doc.setFontSize(20);
        doc.setTextColor(139, 92, 246); // Violet-500
        doc.text("Syndicate", 14, 22);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("Contribution Receipt", 14, 30);

        // Transaction Details
        doc.setFontSize(12);
        doc.setTextColor(0);

        const data = [
            ['Transaction ID', transaction.id],
            ['Date', transaction.date],
            ['Work', transaction.workTitle],
            ['Author', transaction.authorName],
            ['Type', transaction.type],
            ['Amount', `$${transaction.amount.toFixed(2)}`]
        ];

        autoTable(doc, {
            startY: 40,
            head: [['Description', 'Details']],
            body: data,
            theme: 'grid',
            headStyles: { fillColor: [139, 92, 246] },
            columnStyles: { 0: { fontStyle: 'bold' } }
        });

        // Footer
        const finalY = doc.lastAutoTable.finalY || 40;
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text("Thank you for supporting human creativity.", 14, finalY + 10);

        doc.save(`syndicate_receipt_${transaction.id}.pdf`);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <h1 className="text-3xl font-bold text-purple-500 mb-2">Contributions</h1>
            <p className="text-zinc-400">Fuel for the resistance. Your legacy of human support.</p>
            <div style={{ height: '30px' }}></div>

            <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                                <th className="p-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Date</th>
                                <th className="p-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Work / Author</th>
                                <th className="p-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">Type</th>
                                <th className="p-4 text-xs font-bold text-zinc-400 uppercase tracking-wider text-right">Amount</th>
                                <th className="p-4 text-xs font-bold text-zinc-400 uppercase tracking-wider text-center">Receipt</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-500"></div>
                                    </td>
                                </tr>
                            ) : contributions.length > 0 ? (
                                contributions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 text-sm text-zinc-300 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-zinc-500" />
                                                {tx.date}
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-white">
                                            <div className="font-medium">{tx.workTitle}</div>
                                            <div className="text-xs text-zinc-500">{tx.authorName}</div>
                                        </td>
                                        <td className="p-4 text-sm text-zinc-400">
                                            <span className="px-2 py-1 rounded-full bg-white/5 text-xs border border-white/5">
                                                {tx.type}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-white text-right font-medium">
                                            ${tx.amount.toFixed(2)}
                                        </td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => handleDownloadReceipt(tx.id)}
                                                className="text-zinc-400 hover:text-violet-400 p-2 hover:bg-violet-500/10 rounded-lg transition-colors inline-flex items-center gap-1"
                                                title="Download Receipt"
                                            >
                                                <Download size={16} />
                                                <span className="text-xs hidden md:inline">PDF</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-zinc-500">
                                        No contributions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReaderContributions;
