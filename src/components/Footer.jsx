import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Video } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="border-t border-white/10 bg-[#18181b] mt-20" style={{ paddingTop: '60px', paddingBottom: '80px' }}>
            <div className="container flex flex-col md:flex-row gap-8 md:gap-12 mb-12">
                {/* Left Side: Description */}
                <div>
                    <p className="text-zinc-400 leading-relaxed max-w-md">
                        <span className="font-bold" style={{ color: '#cc5500' }}>Syndicate</span> is a syndication platform for writers. We connect readers with authors through a daily or weekly content (chapters, stories, poems) release model. Readers can choose to make a contribution to authors to express appreciation for their art.
                    </p>

                    {/* Explicit Line Space */}
                    <div className="h-8"></div>

                    <p className="text-zinc-400 leading-relaxed max-w-md">
                        Read our <Link to="/faq" className="text-white hover:underline font-bold">FAQ</Link> for more details or <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-white hover:underline">create an account</button> to get started.
                    </p>
                </div>

                {/* Middle: Divider & Contacts */}
                <div className="flex gap-5">
                    {/* Vertical Line */}
                    <div className="hidden md:block w-px bg-zinc-800 h-full self-stretch"></div>

                    {/* Emails */}
                    <div className="flex flex-col gap-4 justify-start">
                        <div>
                            <span className="block text-zinc-500 text-sm mb-1 uppercase tracking-wider font-bold">For Authors</span>
                            <a href="mailto:Authorsupport@syndicate.direct" className="text-white hover:text-violet-400 transition-colors block text-[11pt] font-medium">Authorsupport@syndicate.direct</a>
                        </div>
                        <div>
                            <span className="block text-zinc-500 text-sm mb-1 uppercase tracking-wider font-bold">For Readers</span>
                            <a href="mailto:Readersupport@syndicate.direct" className="text-white hover:text-violet-400 transition-colors block text-[11pt] font-medium">Readersupport@syndicate.direct</a>
                        </div>
                    </div>
                </div>

                {/* Right Side: Socials & Links */}
                <div className="flex flex-col md:items-end gap-6 md:ml-auto translate-x-10">
                    <div className="flex gap-4">
                        <a href="#" className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-violet-600 hover:text-white transition-all">
                            <Facebook size={20} />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-pink-600 hover:text-white transition-all">
                            <Instagram size={20} />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-black hover:text-white transition-all">
                            <Video size={20} /> {/* TikTok placeholder */}
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-sky-500 hover:text-white transition-all">
                            <Twitter size={20} />
                        </a>
                    </div>
                    <div className="flex flex-wrap gap-6 text-sm text-zinc-400">
                        <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
                        <Link to="/faq" className="hover:text-white transition-colors">FAQ</Link>
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/accessibility" className="hover:text-white transition-colors">Accessibility</Link>
                    </div>
                </div>
            </div>

            <div className="container border-t border-white/5 pt-8 text-center text-zinc-600 text-sm">
                &copy; {new Date().getFullYear()} Syndicate Platform. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
