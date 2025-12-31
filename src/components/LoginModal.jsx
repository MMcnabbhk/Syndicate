
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const LoginModal = () => {
    const { isLoginModalOpen, closeLoginModal, login, openCreateAccountModal } = useStore();
    const [email, setEmail] = useState('');
    const [isHovered, setIsHovered] = useState(false);

    if (!isLoginModalOpen) return null;

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        // Simple mock: if email contains 'creator', log in as creator
        if (email.toLowerCase().includes('creator')) {
            login('creator');
        } else {
            login('reader');
        }
    };

    const handleSocialLogin = () => {
        // Redirect to backend OAuth route
        window.location.href = 'http://localhost:4000/api/auth/google';
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-[#0a0a0a]/95 backdrop-blur-sm transition-opacity"
                onClick={closeLoginModal}
            ></div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-[360px] flex flex-col items-center">

                {/* Logo - with much more padding below */}
                <div className="mb-0">
                    <span className="font-bold text-4xl tracking-tight" style={{ color: '#cc5500' }}>
                        Syndicate
                    </span>
                </div>

                <div className="h-[30px]"></div>

                {/* Log in Title */}
                <h2 className="text-[28px] font-semibold text-white mb-0">Log in</h2>
                <div className="h-[40px]"></div>

                {/* Card */}
                <div className="bg-[#111111] border border-zinc-800/80 rounded-xl px-6 py-6 w-full">
                    <form onSubmit={handleEmailSubmit}>
                        {/* Email Label - WHITE */}
                        <label className="std-label">Email</label>

                        {/* Input - LIGHTER shade than page */}
                        <div className="std-form-group">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="std-input h-[48px] text-[15px]"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            style={{ backgroundColor: isHovered ? '#444444' : '#333333' }}
                            className="w-full h-[48px] text-white text-[14px] font-semibold uppercase tracking-wide rounded-lg transition-colors border border-zinc-300 flex items-center justify-center mb-[10px]"
                        >
                            Continue
                        </button>
                    </form>

                    {/* OR Divider */}
                    <div className="flex items-center gap-4 my-5">
                        <div className="h-px bg-zinc-800/80 flex-1"></div>
                        <span className="text-zinc-600 text-[11px] uppercase tracking-wider">OR</span>
                        <div className="h-px bg-zinc-800/80 flex-1"></div>
                    </div>

                    {/* Social Buttons */}
                    <div className="flex gap-2">
                        {/* Google */}
                        <button
                            onClick={handleSocialLogin}
                            className="flex-1 bg-[#1a1a1a] border border-zinc-800 hover:border-zinc-600 rounded-lg h-[44px] flex items-center justify-center transition-colors"
                            title="Continue with Google"
                        >
                            <img
                                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                alt="Google"
                                className="w-[18px] h-[18px]"
                            />
                        </button>

                        {/* Microsoft-style */}
                        <button
                            onClick={() => window.location.href = 'http://localhost:4000/api/auth/microsoft'}
                            className="flex-1 bg-[#1a1a1a] border border-zinc-800 hover:border-zinc-600 rounded-lg h-[44px] flex items-center justify-center transition-colors"
                            title="Continue with Microsoft"
                        >
                            <svg className="w-[18px] h-[18px]" viewBox="0 0 21 21" fill="none">
                                <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                                <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                                <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                                <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
                            </svg>
                        </button>

                        {/* Apple */}
                        <button
                            onClick={() => window.location.href = 'http://localhost:4000/api/auth/apple'}
                            className="flex-1 bg-[#1a1a1a] border border-zinc-800 hover:border-zinc-600 rounded-lg h-[44px] flex items-center justify-center transition-colors"
                            title="Continue with Apple"
                        >
                            <svg className="w-[18px] h-[18px] fill-white" viewBox="0 0 24 24">
                                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.21-1.21 3.75-.97 1.28.1 2.89.84 3.54 1.81-.02.03-2.11 1.23-2.09 3.5.02 2.76 2.41 3.7 2.45 3.72-.03.11-.38 1.3-1.25 2.58-.78 1.14-1.59 1.94-2.5 1.95-.01 0 0 0 .02-.36zm-3.9-13.9c.78-.95 1.31-2.27 1.16-3.59-1.12.05-2.48.75-3.29 1.69-.72.83-1.34 2.16-1.17 3.52 1.26.1 2.53-.66 3.3-1.62z" />
                            </svg>
                        </button>
                    </div>

                    {/* Create account link */}
                    <p className="text-center text-zinc-500 text-[14px] mt-6">
                        Don't have an account? <button onClick={() => { closeLoginModal(); openCreateAccountModal(); }} className="text-blue-500 hover:text-blue-400 transition-colors">Create one</button>
                    </p>
                </div>

                {/* Terms outside card */}
                <div className="mt-6 text-center">
                    <p className="text-zinc-600 text-[12px]">
                        By continuing, you agree to our <a href="#" className="underline hover:text-zinc-500">Terms</a> and <a href="#" className="underline hover:text-zinc-500">Privacy Policy</a>.
                    </p>
                </div>

                {/* Close Button */}
                <button
                    onClick={closeLoginModal}
                    className="absolute top-4 right-4 text-zinc-600 hover:text-white transition-colors p-2"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
};

export default LoginModal;
