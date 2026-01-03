import { Users, Search, MessageCircle, Star, Heart, TrendingUp, DollarSign, Calendar, UserX, Upload, Mail, Globe, Smartphone, CheckCircle2, UserPlus, ArrowRight } from 'lucide-react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const FansAndContributors = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [importing, setImporting] = useState(false);
    const [importedContacts, setImportedContacts] = useState([]);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/community/stats', { credentials: 'include' });
                if (!res.ok) throw new Error('Failed to fetch community stats');
                const json = await res.json();
                setData(json);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchContacts = async () => {
            try {
                const res = await fetch('/api/contacts', { credentials: 'include' });
                if (res.ok) {
                    const contacts = await res.json();
                    setImportedContacts(contacts);
                }
            } catch (err) {
                console.error('Failed to load stored contacts:', err);
            }
        };

        fetchData();
        fetchContacts();

        // Check for contact import redirects
        const params = new URLSearchParams(location.search);
        const importType = params.get('import');
        if (importType === 'google' || importType === 'microsoft') {
            handleOAuthImport(importType);
        }
    }, [location.search]);

    const handleOAuthImport = async (type) => {
        setImporting(true);
        try {
            const res = await fetch(`/api/contacts/${type}`, { credentials: 'include' });
            if (!res.ok) throw new Error(`Failed to fetch ${type} contacts`);
            const contacts = await res.json();
            setImportedContacts(contacts);
            // Clean URL
            navigate('/community', { replace: true });
        } catch (err) {
            console.error(err);
            alert(`Error importing from ${type}: ` + err.message);
        } finally {
            setImporting(false);
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setImporting(true);
        try {
            const res = await fetch('/api/contacts/upload', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed to upload contact file');
            const contacts = await res.json();
            setImportedContacts(contacts);
        } catch (err) {
            console.error(err);
            alert('Error uploading contacts: ' + err.message);
        } finally {
            setImporting(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center">Loading Community Data...</div>;
    if (error) return <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center">Error: {error}</div>;

    const { fansByWork = [], uniqueFans = [], contributions = [] } = data || {};

    const handleDeleteFan = async (userId, userName) => {
        if (!window.confirm(`Are you sure you want to remove ${userName} from your followers? This will cancel their active subscriptions to your works.`)) {
            return;
        }

        try {
            const res = await fetch(`/api/community/fan/${userId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed to delete fan');

            // Refresh data
            const updatedRes = await fetch('/api/community/stats', { credentials: 'include' });
            if (updatedRes.ok) {
                const updatedData = await updatedRes.json();
                setData(updatedData);
            }
        } catch (err) {
            alert('Error deleting fan: ' + err.message);
        }
    };

    // Calculate totals
    const totalFans = fansByWork.reduce((acc, work) => acc + work.fans.length, 0);
    const totalRevenue = contributions.reduce((acc, c) => acc + parseFloat(c.amount), 0).toFixed(2);

    return (
        <div className="min-h-screen bg-[#111111] text-white py-10">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <div className="relative mb-6">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Fans &</span> Contributors
                        </h1>
                        <p className="mt-4 text-xl text-zinc-400 mx-auto" style={{ color: '#a1a1aa' }}>
                            Manage your fans and financial contributors.
                        </p>
                        <div style={{ height: '40px' }}></div>
                    </div>
                </div>

                <div style={{ height: '20px' }}></div>

                {/* Grow Your Community Section */}
                <div className="mb-12">
                    <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Users size={160} />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-2" style={{ marginBottom: '10px' }}>
                                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                                    <UserPlus className="text-fuchsia-400" />
                                    Grow Your Community
                                </h2>
                                <Link to="/invites" className="transition-colors" style={{ color: '#a855f7', fontSize: '1.25rem', textDecoration: 'none', marginRight: '290px' }}>
                                    + Invite
                                </Link>
                            </div>
                            <p className="text-zinc-400 max-w-2xl mb-8" style={{ marginBottom: '10px' }}>
                                Connect with your existing network. Import your contacts to find friends already on the platform or invite them to join your journey.
                            </p>
                            <div style={{ height: '10px', width: '100%', display: 'block' }}></div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <button
                                    onClick={() => window.location.href = '/api/auth/google/contacts'}
                                    className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-6 py-4 transition-all hover:scale-[1.02]"
                                    style={{ marginBottom: '20px' }}
                                >
                                    <Globe className="text-blue-400" size={20} />
                                    <div className="text-left">
                                        <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Connect</div>
                                        <div className="font-bold text-white">Google</div>
                                        <div style={{ height: '20px' }}></div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => window.location.href = '/api/auth/microsoft/contacts'}
                                    className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-6 py-4 transition-all hover:scale-[1.02]"
                                >
                                    <Mail className="text-sky-400" size={20} />
                                    <div className="text-left">
                                        <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Connect</div>
                                        <div className="font-bold text-white">Microsoft</div>
                                    </div>
                                </button>

                                <label className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-6 py-4 transition-all hover:scale-[1.02] cursor-pointer">
                                    <Smartphone className="text-zinc-400" size={20} />
                                    <div className="text-left">
                                        <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Upload</div>
                                        <div className="font-bold text-white">Apple / vCard</div>
                                    </div>
                                    <input type="file" accept=".vcf" className="hidden" onChange={handleFileUpload} />
                                </label>

                                <label className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-6 py-4 transition-all hover:scale-[1.02] cursor-pointer">
                                    <Upload className="text-green-400" size={20} />
                                    <div className="text-left">
                                        <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Import</div>
                                        <div className="font-bold text-white">CSV List</div>
                                    </div>
                                    <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Results of Import */}
                    {importing && (
                        <div className="mt-6 p-12 text-center bg-zinc-900/30 rounded-xl border border-dashed border-white/10">
                            <div className="animate-spin inline-block w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full mb-4"></div>
                            <div className="text-zinc-400 font-medium">Scanning your contacts...</div>
                        </div>
                    )}

                    {!importing && importedContacts.length > 0 && (
                        <div className="mt-8">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="text-green-400" size={20} />
                                    Imported {importedContacts.length} Contacts
                                </div>
                                <button
                                    onClick={() => setImportedContacts([])}
                                    className="text-xs text-zinc-500 hover:text-white transition-colors uppercase tracking-widest font-bold"
                                >
                                    Clear Results
                                </button>
                            </h3>
                            <div className="bg-[#1a1a1a] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
                                <div className="max-h-[400px] overflow-y-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-zinc-900/50 text-zinc-400 sticky top-0 backdrop-blur-md">
                                            <tr>
                                                <th className="px-6 py-4 font-medium">Name</th>
                                                <th className="px-6 py-4 font-medium">Email</th>
                                                <th className="px-6 py-4 font-medium">Status</th>
                                                <th className="px-6 py-4 font-medium text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {importedContacts.map((contact, idx) => (
                                                <tr key={idx} className="hover:bg-white/5 transition-colors group">
                                                    <td className="px-6 py-4 font-medium text-white">{contact.name}</td>
                                                    <td className="px-6 py-4 text-zinc-400">{contact.email}</td>
                                                    <td className="px-6 py-4">
                                                        {contact.isUser ? (
                                                            <span className="bg-green-500/10 text-green-400 text-[10px] px-2 py-0.5 rounded border border-green-500/20 font-bold uppercase">On Platform</span>
                                                        ) : (
                                                            <span className="bg-zinc-500/10 text-zinc-500 text-[10px] px-2 py-0.5 rounded border border-zinc-500/20 font-bold uppercase">External</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        {contact.isUser ? (
                                                            <button className="text-violet-400 hover:text-violet-300 font-bold text-xs uppercase cursor-pointer">Follow</button>
                                                        ) : (
                                                            <button className="text-zinc-500 hover:text-white font-bold text-xs uppercase cursor-pointer">Invite</button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>


                <div style={{ height: '20px' }}></div>

                {/* Contributions Table */}
                <div className="mb-20">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <DollarSign size={20} className="text-green-400" />
                        Contribution History
                    </h2>
                    <div className="bg-[#1a1a1a] border border-white/5 rounded-xl overflow-hidden mb-6">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-zinc-900/50 text-zinc-400 border-b border-white/5">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                    <th className="px-6 py-4 font-medium">Contributor</th>
                                    <th className="px-6 py-4 font-medium">Username</th>
                                    <th className="px-6 py-4 font-medium">Work</th>
                                    <th className="px-6 py-4 font-medium text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {contributions.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-zinc-500">No contributions yet.</td>
                                    </tr>
                                ) : (
                                    contributions.map((c, i) => (
                                        <tr key={i} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4 text-zinc-400">
                                                {new Date(c.created_at).toLocaleDateString()}
                                                <span className="text-zinc-600 ml-2 text-xs">{new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-zinc-400">
                                                    {c.user_name ? c.user_name[0] : '?'}
                                                </div>
                                                {c.user_name || 'Anonymous'}
                                            </td>
                                            <td className="px-6 py-4 text-zinc-400">@{c.user_handle || 'anonymous'}</td>
                                            <td className="px-6 py-4 text-zinc-300">{c.work_title}</td>
                                            <td className="px-6 py-4 text-right font-mono text-green-400">
                                                ${parseFloat(c.amount).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Revenue Summary below table */}
                    <div className="flex justify-end">
                        <div className="bg-[#1a1a1a] border border-white/5 px-8 py-4 rounded-xl flex items-center gap-4">
                            <div className="p-2 bg-green-500/10 rounded-lg text-green-400"><DollarSign size={20} /></div>
                            <div className="text-right">
                                <div className="text-xs text-zinc-400 uppercase tracking-wider font-bold">Total Revenue</div>
                                <div className="text-3xl font-black text-green-400">${totalRevenue}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Your Fans Table */}
                <div className="space-y-8 mb-12">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Users size={20} className="text-violet-400" />
                        Your Fans
                    </h2>

                    <div className="bg-[#1a1a1a] border border-white/5 rounded-xl overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-zinc-900/50 text-zinc-400 border-b border-white/5">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Fan Name</th>
                                    <th className="px-6 py-4 font-medium">Username</th>
                                    <th className="px-6 py-4 font-medium">Date Joined</th>
                                    <th className="px-6 py-4 font-medium">Recent Work</th>
                                    <th className="px-6 py-4 font-medium">Total Works</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {uniqueFans.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-zinc-500">No active fans found.</td>
                                    </tr>
                                ) : (
                                    uniqueFans.map((fan) => (
                                        <tr key={fan.user_id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs overflow-hidden border border-white/10">
                                                    {fan.avatar ? <img src={fan.avatar} alt={fan.full_name || 'Anonymous'} className="w-full h-full object-cover" /> : (fan.full_name ? fan.full_name[0] : '?')}
                                                </div>
                                                {fan.full_name || 'Anonymous'}
                                                {fan.signup_source === 'creator_invite' && (
                                                    <span className="text-[10px] bg-violet-600/20 text-violet-400 px-2 py-0.5 rounded-full border border-violet-500/20 font-bold ml-2">
                                                        Creator Invite
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-zinc-400">@{fan.user_name || 'anonymous'}</td>
                                            <td className="px-6 py-4 text-zinc-400">
                                                {new Date(fan.joined_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-zinc-300 italic">{fan.recent_work_title || 'N/A'}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="bg-violet-500/10 text-violet-300 text-xs px-2 py-0.5 rounded border border-violet-500/20">
                                                    {fan.total_works}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-3">
                                                    <button className="text-zinc-600 hover:text-white transition-colors" title="Message"><MessageCircle size={16} /></button>
                                                    <button
                                                        onClick={() => handleDeleteFan(fan.user_id, fan.full_name)}
                                                        className="text-zinc-600 hover:text-red-400 transition-colors"
                                                        title="Delete Fan"
                                                    >
                                                        <UserX size={16} />
                                                        <span className="sr-only">Delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ height: '24px' }}></div>

                    {/* Stats Bar (Moved below section) */}
                    <div className="flex justify-end">
                        <div className="bg-[#1a1a1a] border border-white/5 px-8 py-4 rounded-xl flex items-center gap-4">
                            <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400"><Heart size={20} /></div>
                            <div className="text-right">
                                <div className="text-xs text-zinc-400 uppercase tracking-wider font-bold">Total Fans</div>
                                <div className="text-3xl font-black text-white">{totalFans}</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FansAndContributors;
