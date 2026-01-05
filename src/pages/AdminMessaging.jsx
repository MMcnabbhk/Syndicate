import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, Users, User, Mail, CheckCircle, AlertCircle } from 'lucide-react';

const AdminMessaging = () => {
    const [includeReaders, setIncludeReaders] = useState(false);
    const [includeCreators, setIncludeCreators] = useState(false);
    const [recipientId, setRecipientId] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [sending, setSending] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (location.state && location.state.email) {
            setRecipientId(location.state.email);
            // Optional: scroll to the input or transition smoothly
        }
    }, [location.state]);

    const handleSend = (e) => {
        if (e) e.preventDefault();
        if (!includeReaders && !includeCreators && !recipientId) {
            setStatus({ type: 'error', message: 'Please select at least one recipient.' });
            return;
        }

        setSending(true);

        // Simulate API call
        setTimeout(() => {
            setSending(false);
            setStatus({ type: 'success', message: 'Message sent successfully!' });
            // Reset form
            setSubject('');
            setMessage('');
            setIncludeReaders(false);
            setIncludeCreators(false);
            setRecipientId('');
            setTimeout(() => setStatus({ type: '', message: '' }), 3000);
        }, 1500);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl pb-32">
            <h1 className="text-3xl font-bold text-white mb-2">Admin Messaging</h1>
            <p className="text-zinc-400">Broadcast messages to users.</p>
            <div style={{ height: '20px' }}></div>

            {status.message && (
                <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                    {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    {status.message}
                </div>
            )}

            <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-8 mb-8">
                <form onSubmit={handleSend} className="space-y-6">
                    {/* Recipient Selection */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-400">Recipients</label>
                        <div style={{ height: '10px' }}></div>

                        <div className="flex flex-col gap-3 max-w-md">
                            {/* All Readers Toggle */}
                            <button
                                type="button"
                                onClick={() => setIncludeReaders(!includeReaders)}
                                className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left group ${includeReaders
                                    ? 'bg-blue-500/10 border-blue-500 text-white'
                                    : 'bg-zinc-900 border-white/5 text-zinc-400 hover:border-white/20'}`}
                            >
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${includeReaders ? 'bg-blue-500 border-blue-500' : 'border-zinc-600 group-hover:border-zinc-500'}`}>
                                    {includeReaders && <CheckCircle size={14} className="text-white" />}
                                </div>
                                <div className="flex items-center gap-3">
                                    <Users size={20} className={includeReaders ? 'text-blue-400' : 'text-zinc-500'} />
                                    <span className="font-medium">All Readers</span>
                                </div>
                            </button>

                            {/* All Creators Toggle */}
                            <button
                                type="button"
                                onClick={() => setIncludeCreators(!includeCreators)}
                                className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left group ${includeCreators
                                    ? 'bg-violet-500/10 border-violet-500 text-white'
                                    : 'bg-zinc-900 border-white/5 text-zinc-400 hover:border-white/20'}`}
                            >
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${includeCreators ? 'bg-violet-500 border-violet-500' : 'border-zinc-600 group-hover:border-zinc-500'}`}>
                                    {includeCreators && <CheckCircle size={14} className="text-white" />}
                                </div>
                                <div className="flex items-center gap-3">
                                    <Users size={20} className={includeCreators ? 'text-violet-400' : 'text-zinc-500'} />
                                    <span className="font-medium">All Creators</span>
                                </div>
                            </button>
                        </div>
                        <div style={{ height: '20px' }}></div>

                        {/* Individual Recipient Option */}
                        <div className="pt-2 border-t border-white/5 mt-4">
                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mt-4">Or Individual User</label>
                            <div style={{ height: '10px' }}></div>
                            <div className="flex items-center gap-3">
                                <User size={20} className="text-zinc-500" />
                                <input
                                    type="text"
                                    value={recipientId}
                                    onChange={(e) => setRecipientId(e.target.value)}
                                    placeholder="Enter user email or ID..."
                                    className="w-full bg-zinc-900 text-white border border-white/10 rounded-lg px-4 py-3 focus:ring-1 focus:ring-violet-500/50 focus:outline-none placeholder-zinc-500"
                                />
                            </div>
                            <div style={{ height: '10px' }}></div>
                            <p className="text-xs text-zinc-600 ml-8">Leave empty to send only to selected groups.</p>
                        </div>
                    </div>

                    {/* From Line */}
                    <div className="pt-2">
                        <div className="text-zinc-400 bg-white/5 px-4 py-3 rounded-lg border border-white/5 inline-flex items-center gap-2">
                            <span className="font-bold text-white">From:</span>
                            <span>Syndicate</span>
                        </div>
                        <div style={{ height: '20px' }}></div>
                    </div>

                    {/* Message Details */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Subject</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Announcing new features..."
                            className="w-full bg-zinc-900 text-white border border-white/20 rounded-lg px-4 py-3 focus:ring-1 focus:ring-violet-500/50 focus:outline-none placeholder-zinc-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Message Content</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Write your message here..."
                            rows={8}
                            className="w-full bg-zinc-900 text-white border border-white/20 rounded-lg px-4 py-3 focus:ring-1 focus:ring-violet-500/50 focus:outline-none placeholder-zinc-500 resize-none"
                            required
                        />
                    </div>
                    <div style={{ height: '30px' }}></div>
                </form>
            </div>

            {/* Centered Send Button at bottom of page */}
            <div className="flex justify-center mt-8">
                <button
                    onClick={handleSend}
                    disabled={sending}
                    className={`flex items-center gap-2 px-12 py-4 rounded-full font-bold text-white shadow-lg transition-all text-lg ${sending ? 'bg-zinc-600 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-900/20 hover:scale-105 active:scale-95'
                        }`}
                >
                    {sending ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    ) : (
                        <>
                            <Send size={20} />
                            Send Message
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default AdminMessaging;
