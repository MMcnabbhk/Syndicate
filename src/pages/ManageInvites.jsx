import React, { useState, useEffect } from 'react';
import { Mail, Send, Calendar, CheckCircle, Clock, AlertCircle, Save } from 'lucide-react';

const ManageInvites = () => {
    const [contacts, setContacts] = useState([]);
    const [invites, setInvites] = useState([]);
    const [templates, setTemplates] = useState({
        invite_text: '',
        reminder1_text: '',
        reminder2_text: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [contactsRes, invitesRes, templatesRes] = await Promise.all([
                    fetch('/api/contacts', { credentials: 'include' }),
                    fetch('/api/invites/list', { credentials: 'include' }),
                    fetch('/api/invites/templates', { credentials: 'include' })
                ]);

                if (contactsRes.ok) setContacts(await contactsRes.json());
                if (invitesRes.ok) setInvites(await invitesRes.json());
                if (templatesRes.ok) setTemplates(await templatesRes.json());
            } catch (err) {
                console.error('Failed to fetch data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSaveTemplates = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/invites/templates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(templates),
                credentials: 'include'
            });
            if (res.ok) alert('Templates saved successfully!');
            else throw new Error('Failed to save');
        } catch (err) {
            alert('Error saving templates: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleSendInvite = async (contact) => {
        try {
            const res = await fetch('/api/invites/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: contact.email, name: contact.name }),
                credentials: 'include'
            });
            if (res.ok) {
                // Refresh invites
                const updatedRes = await fetch('/api/invites/list', { credentials: 'include' });
                if (updatedRes.ok) setInvites(await updatedRes.json());
            }
        } catch (err) {
            console.error('Failed to send invite:', err);
        }
    };

    if (loading) return <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center">Loading Invites...</div>;

    // Combine contacts with invite status
    const inviteMap = new Map();
    invites.forEach(inv => inviteMap.set(inv.email.toLowerCase(), inv));

    return (
        <div className="min-h-screen bg-[#111111] text-white py-10">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <div className="relative mb-6">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Manage</span> Invites
                        </h1>
                        <p className="mt-4 text-xl text-zinc-400 mx-auto" style={{ color: '#a1a1aa' }}>
                            Invite Your People To Join You
                        </p>
                        <div style={{ height: '60px' }}></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Side: Contact List */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Mail className="text-violet-400" />
                                Your Contacts
                            </h2>

                            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                {contacts.length === 0 ? (
                                    <p className="text-zinc-500 text-center py-8 italic">Import your Contacts on the Fans & Contributors page</p>
                                ) : (
                                    contacts.map((contact, idx) => {
                                        const invite = inviteMap.get(contact.email?.toLowerCase());
                                        return (
                                            <div key={idx} className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-between group hover:border-white/10 transition-colors">
                                                <div className="min-w-0">
                                                    <div className="font-bold text-white truncate">{contact.name}</div>
                                                    <div className="text-sm text-zinc-400 truncate">{contact.email}</div>
                                                    {invite && (
                                                        <div className="mt-2 flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider">
                                                            <span className={`px-2 py-0.5 rounded-full ${invite.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                                                                invite.status === 'pending' ? 'bg-zinc-500/20 text-zinc-400' :
                                                                    'bg-violet-500/20 text-violet-400'
                                                                }`}>
                                                                {invite.status}
                                                            </span>
                                                            {invite.invite_sent_at && (
                                                                <span className="text-zinc-500 flex items-center gap-1">
                                                                    <Calendar size={12} />
                                                                    {new Date(invite.invite_sent_at).toLocaleDateString()}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                {!invite ? (
                                                    <button
                                                        onClick={() => handleSendInvite(contact)}
                                                        className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all transform group-hover:scale-105 active:scale-95 flex items-center gap-2"
                                                    >
                                                        <Send size={14} />
                                                        Invite
                                                    </button>
                                                ) : (
                                                    <div className="text-zinc-500">
                                                        {invite.status === 'accepted' ? <CheckCircle className="text-green-500" /> : <Clock />}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Templates */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6">
                            <h2 className="text-xl font-bold flex items-center gap-2 mb-8">
                                <Send className="text-fuchsia-400" />
                                Invite Sequence
                            </h2>

                            <div style={{ height: '20px' }}></div>

                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-[10px]">1</div>
                                        Initial Invite
                                    </label>
                                    <textarea
                                        value={templates.invite_text}
                                        onChange={(e) => setTemplates({ ...templates, invite_text: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-zinc-200 min-h-[120px] focus:outline-none focus:border-violet-500 transition-colors"
                                        placeholder="Write your invitation message..."
                                    />
                                    <div className="text-[11px] text-zinc-500 italic" style={{ marginBottom: '10px' }}>Sent manually or when a contact is first added.</div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-fuchsia-600 text-white flex items-center justify-center text-[10px]">2</div>
                                        Invite Reminder
                                    </label>
                                    <textarea
                                        value={templates.reminder1_text}
                                        onChange={(e) => setTemplates({ ...templates, reminder1_text: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-zinc-200 min-h-[120px] focus:outline-none focus:border-violet-500 transition-colors"
                                        placeholder="Write your 5-day reminder message..."
                                    />
                                    <div className="text-[11px] text-zinc-500 italic" style={{ marginBottom: '10px' }}>Automatically sent 5 days after the initial invite.</div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-[10px]">3</div>
                                        Second Reminder
                                    </label>
                                    <textarea
                                        value={templates.reminder2_text}
                                        onChange={(e) => setTemplates({ ...templates, reminder2_text: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-zinc-200 min-h-[120px] focus:outline-none focus:border-violet-500 transition-colors"
                                        placeholder="Write your 15-day final reminder message..."
                                    />
                                    <div className="text-[11px] text-zinc-500 italic" style={{ marginBottom: '10px' }}>Automatically sent 10 days after the first reminder.</div>
                                </div>
                            </div>

                            <div className="mt-8 p-4 bg-violet-600/10 border border-violet-500/20 rounded-xl flex gap-3">
                                <AlertCircle className="text-violet-400 shrink-0" />
                                <div className="text-sm text-zinc-400 leading-relaxed">
                                    <span className="text-white font-bold">Pro Tip:</span> Personalize your messages to increase conversion. Invites that mention specific works or goals often see double the acceptance rate.
                                </div>
                            </div>
                        </div>

                        <div style={{ height: '20px' }}></div>

                        {/* Bottom Action Bar */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <button
                                onClick={handleSaveTemplates}
                                disabled={saving}
                                type="button"
                                style={{ backgroundColor: '#cc5500', color: 'white' }}
                                className="w-full md:w-auto min-w-[240px] px-12 py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-900/20 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                            >
                                {saving ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Save size={20} />
                                )}
                                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style sx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
            `}</style>
        </div>
    );
};

export default ManageInvites;
