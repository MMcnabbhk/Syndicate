
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Save, AlertTriangle, Download, MessageSquare, User, Shield, PauseCircle, Trash2, X, Loader2 } from 'lucide-react';

const PasswordModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { userState } = useStore();

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Verify password by attempting to login (re-auth pattern)
            const response = await fetch('http://localhost:4000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: userState.user.email,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                onConfirm();
                onClose();
            } else {
                setError('Incorrect password. Please try again.');
            }
        } catch (err) {
            setError('Verification failed. Please try again.');
        } finally {
            setLoading(false);
            setPassword('');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">{message}</p>
                    </div>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Enter Password to Verify
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 transition-colors"
                            placeholder="Password"
                            autoFocus
                            required
                        />
                        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                    </div>

                    <div className="flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading && <Loader2 size={16} className="animate-spin" />}
                            Verify & Proceed
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Settings = () => {
    const { userState } = useStore();
    const [formData, setFormData] = useState({
        username: userState.user?.handle || '',
        featureRequest: ''
    });
    const [status, setStatus] = useState('');

    // Modal State
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { }
    });

    const handleCopy = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFeatureSubmit = (e) => {
        e.preventDefault();
        // In reality, post to backend
        setStatus('Feature request submitted! We appreciate your feedback.');
        setFormData({ ...formData, featureRequest: '' });
        setTimeout(() => setStatus(''), 3000);
    };

    // Actions that require verification
    const triggerUsernameChange = () => {
        if (!formData.username) return;
        setModalConfig({
            isOpen: true,
            title: 'Verify Change Username',
            message: 'Please enter your password to confirm changing your username.',
            onConfirm: performUsernameChange
        });
    };

    const performUsernameChange = () => {
        setStatus('Checking availability...');
        // Mock delay
        setTimeout(() => {
            setStatus('Username updated successfully!');
            setTimeout(() => setStatus(''), 3000);
        }, 1000);
    };

    const triggerSuspend = () => {
        setModalConfig({
            isOpen: true,
            title: 'Suspend Account',
            message: 'Are you sure? Your account will be hidden until you reactivate it. Enter password to confirm.',
            onConfirm: () => setStatus('Account has been suspended.')
        });
    };

    const triggerDelete = () => {
        setModalConfig({
            isOpen: true,
            title: 'Delete Account',
            message: 'This action cannot be undone. All data will be permanently wiped. Enter password to confirm.',
            onConfirm: () => setStatus('Account has been deleted.') // Mock
        });
    };

    const handleDownloadData = () => {
        // Mock download
        const data = [
            ['Date', 'Type', 'Amount', 'Description'],
            ['2025-01-01', 'Contribution', '$10.00', 'Support for Novel X'],
            ['2025-01-15', 'Subscription', '$5.00', 'Monthly Sub for Work Y']
        ];
        const csvContent = "data:text/csv;charset=utf-8," + data.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "my_financial_data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="w-full max-w-3xl px-8 py-10 text-white">
            <PasswordModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                onConfirm={modalConfig.onConfirm}
                title={modalConfig.title}
                message={modalConfig.message}
            />
            {/* Header */}
            <div style={{ marginTop: '40px' }}>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2" style={{ color: '#8b5cf6' }}>
                    Settings
                </h1>
                <p className="text-zinc-400 text-lg">You're the pilot. Not the product.</p>
                <div style={{ height: '40px' }} />
            </div>

            {/* Content Area - Stacked Sections */}
            <div className="space-y-16">
                {/* STATUS ALERT */}
                {status && (
                    <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        {status}
                    </div>
                )}

                {/* 1. Account Section */}
                <section>
                    <div className="flex items-center gap-3" style={{ marginTop: '20px', marginBottom: '10px' }}>
                        <div className="p-2 bg-violet-500/10 rounded-lg">
                            <User size={24} className="text-violet-500" />
                        </div>
                        <h2 className="text-2xl font-bold">Account</h2>
                    </div>

                    <div className="pl-2 space-y-12">
                        {/* Change Username */}
                        <div className="max-w-xl">
                            <h3 className="text-lg font-bold mb-4 text-zinc-200">Modify Username</h3>
                            <div className="flex-1" style={{ marginBottom: '20px' }}>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">New Handle (must be unique)</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleCopy}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 transition-colors"
                                    placeholder="@username"
                                />
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="max-w-3xl">
                            <h3 className="text-lg font-bold mb-4 text-red-400 flex items-center gap-2">
                                <AlertTriangle size={18} />
                                Danger Zone
                            </h3>

                            <div className="flex flex-col gap-6">
                                <div className="px-6 pb-6 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-colors">
                                    <div
                                        className="font-bold text-white flex items-center gap-2"
                                        style={{ paddingTop: '20px' }}
                                    >
                                        <PauseCircle size={18} />
                                        Suspend Account
                                    </div>
                                    <p className="text-sm text-zinc-400 mb-6">
                                        Temporarily disable your account. Your data will be preserved, but your profile and works will be hidden.
                                    </p>
                                    <button
                                        onClick={triggerSuspend}
                                        className="w-full py-2 px-4 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-all text-sm font-bold flex items-center justify-center gap-2"
                                    >
                                        Suspend Account
                                    </button>
                                </div>

                                <div className="px-6 pb-6 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-colors" style={{ marginBottom: '20px' }}>
                                    <div
                                        className="font-bold text-white flex items-center gap-2"
                                        style={{ paddingTop: '20px' }}
                                    >
                                        <Trash2 size={18} />
                                        Delete Account
                                    </div>
                                    <p className="text-sm text-zinc-400 mb-6">
                                        Permanently delete your account and all associated data. This action cannot be undone.
                                    </p>
                                    <button
                                        onClick={triggerDelete}
                                        className="w-full py-2 px-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-600 hover:text-white transition-all text-sm font-bold flex items-center justify-center gap-2"
                                    >
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="h-px bg-white/5 w-full max-w-3xl" />

                {/* 2. Data & Export Section */}
                <section>
                    <div className="flex items-center gap-3" style={{ marginTop: '20px', marginBottom: '10px' }}>
                        <div className="p-2 bg-violet-500/10 rounded-lg">
                            <Download size={24} className="text-violet-500" />
                        </div>
                        <h2 className="text-2xl font-bold">Data & Export</h2>
                    </div>

                    <div className="pl-2 max-w-3xl">
                        <div className="px-6 pt-6 pb-6 rounded-xl border border-white/10 bg-white/5 flex flex-col items-start">
                            <p className="text-sm text-zinc-400" style={{ marginBottom: '10px' }}>
                                We believe you own your data. Download a complete copy of your financial history, contributions, and account activity in CSV format.
                            </p>
                            <button
                                onClick={handleDownloadData}
                                className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-bold transition-all text-sm flex items-center gap-2"
                            >
                                <Download size={18} />
                                Download CSV
                            </button>
                        </div>
                    </div>
                </section>

                <div className="h-px bg-white/5 w-full max-w-3xl" />

                {/* 3. Support Section */}
                <section>
                    <div className="flex items-center gap-3 mb-8" style={{ marginTop: '30px' }}>
                        <div className="p-2 bg-violet-500/10 rounded-lg">
                            <MessageSquare size={24} className="text-violet-500" />
                        </div>
                        <h2 className="text-2xl font-bold">Support & Feedback</h2>
                    </div>

                    <div className="pl-2 max-w-xl">
                        <p className="text-zinc-400 mb-6">
                            Have an idea to make the platform better? We're listening. Submit your feature request directly to our product team.
                        </p>
                        <form onSubmit={handleFeatureSubmit} className="space-y-4">
                            <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                                <label className="block text-sm font-medium text-white mb-2">Your Request</label>
                                <textarea
                                    name="featureRequest"
                                    value={formData.featureRequest}
                                    onChange={handleCopy}
                                    rows="6"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-violet-500/50 transition-colors resize-none"
                                    placeholder="Describe the feature you'd like to see..."
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-6 py-3 bg-white text-black hover:bg-zinc-200 rounded-xl font-bold transition-colors w-full sm:w-auto"
                            >
                                Submit Request
                            </button>
                        </form>
                    </div>
                </section>

            </div>

            {/* Global Save Button */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px', marginBottom: '30px', width: '100%' }}>
                <button
                    onClick={triggerUsernameChange}
                    style={{
                        padding: '12px 32px',
                        backgroundColor: '#cc5500',
                        color: '#ffffff',
                        borderRadius: '9999px',
                        fontWeight: 'bold',
                        fontSize: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        border: 'none'
                    }}
                >
                    <Save size={20} />
                    Save
                </button>
            </div>
        </div>
    );
};

export default Settings;
