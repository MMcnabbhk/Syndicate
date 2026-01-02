import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { BookOpen, User, Library, PenTool, Search, Headphones, House, LayoutDashboard, ChevronDown, UserCircle, Settings, Users, DollarSign } from 'lucide-react';
import Footer from './Footer';
import LoginModal from './LoginModal';
import CreateAccountModal from './CreateAccountModal';
import NotificationCenter from './NotificationCenter';

const NavItem = ({ to, icon: Icon, label, active }) => (
    <Link
        to={to}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${active ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
    >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
    </Link>
);

import { useStore } from '../context/StoreContext';

const Layout = () => {
    const location = useLocation();
    const { userState, logout, openLoginModal } = useStore();
    const [isCreatorMenuOpen, setIsCreatorMenuOpen] = React.useState(false);

    const isCreator = userState.isAuthenticated && userState.role === 'creator';
    const isEditingContent = location.pathname === '/syndicate-content';

    return (
        /* Added pl-[40px] for 40px gutter as requested */
        <div className="min-h-screen flex flex-col pl-[40px]">
            {/* Navbar */}
            {(
                <header className="sticky top-0 z-50 bg-[#333333]/80 backdrop-blur-md border-b border-white/5">
                    <div className="container h-16 flex items-center justify-center relative">

                        <div className="absolute left-0 flex flex-col justify-center h-full">
                            <Link to="/" className="flex items-center gap-2 font-bold text-3xl leading-none" style={{ color: '#cc5500' }}>
                                <span>Syndicate</span>
                            </Link>
                            <span className="text-xs font-bold tracking-wider mt-[5px]" style={{ color: '#cc5500' }}>Create. Share. Save Humanity.</span>
                        </div>

                        <nav className="hidden md:flex items-center gap-4" style={{ marginLeft: '20px' }}>
                            <NavItem to="/" label="Home" icon={House} active={location.pathname === '/'} />
                            <NavItem to="/discover" label="Discover" icon={Search} active={location.pathname === '/discover'} />
                            <NavItem to="/library" label="Books" icon={Library} active={location.pathname === '/library'} />
                            <NavItem to="/audiobooks" label="AudioBooks" icon={Headphones} active={location.pathname === '/audiobooks'} />
                            <NavItem to="/stories" label="Stories" icon={BookOpen} active={location.pathname === '/stories'} />
                            <NavItem to="/poetry" label="Poetry" icon={PenTool} active={location.pathname === '/poetry'} />
                            <NavItem to="/visual-arts" label="Visual Arts" icon={PenTool} active={location.pathname === '/visual-arts'} />
                        </nav>

                        {/* Right side: Login Function */}
                        <div className="absolute right-0 flex items-center gap-6">
                            <NotificationCenter />
                            {userState.isAuthenticated ? (
                                <div className="flex items-center gap-4">
                                    {isCreator && (
                                        <div className="relative">
                                            <button
                                                onClick={() => setIsCreatorMenuOpen(!isCreatorMenuOpen)}
                                                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-violet-600/20 text-violet-400 border border-violet-500/30 hover:bg-violet-600/30 transition-all"
                                            >
                                                <LayoutDashboard size={20} />
                                                <ChevronDown size={14} className={`transition-transform ${isCreatorMenuOpen ? 'rotate-180' : ''}`} />
                                            </button>

                                            {isCreatorMenuOpen && (
                                                <div className="absolute right-0 mt-2 w-56 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[100] animate-in fade-in zoom-in duration-200">
                                                    <div className="p-2 space-y-[9px]">
                                                        <Link
                                                            to={`/author/${userState.authorId}/manage-works`}
                                                            onClick={() => setIsCreatorMenuOpen(false)}
                                                            className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                                        >
                                                            <Library size={16} className="text-violet-500" />
                                                            <span>Manage Works</span>
                                                        </Link>
                                                        <Link
                                                            to="/manage-profile"
                                                            onClick={() => setIsCreatorMenuOpen(false)}
                                                            className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                                        >
                                                            <UserCircle size={16} className="text-violet-500" />
                                                            <span>Manage Profile</span>
                                                        </Link>
                                                        {userState.authorId && (
                                                            <Link
                                                                to={`/author/${userState.authorId}`}
                                                                onClick={() => setIsCreatorMenuOpen(false)}
                                                                className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                                            >
                                                                <User size={16} className="text-violet-500" />
                                                                <span>My Profile</span>
                                                            </Link>
                                                        )}
                                                        <Link
                                                            to="/community"
                                                            onClick={() => setIsCreatorMenuOpen(false)}
                                                            className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                                        >
                                                            <Users size={16} className="text-violet-500" />
                                                            <span>Fans & Contributors</span>
                                                        </Link>
                                                        <Link
                                                            to="/money"
                                                            onClick={() => setIsCreatorMenuOpen(false)}
                                                            className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                                        >
                                                            <DollarSign size={16} className="text-violet-500" />
                                                            <span>Money</span>
                                                        </Link>
                                                        <Link
                                                            to="/manifesto"
                                                            onClick={() => setIsCreatorMenuOpen(false)}
                                                            className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                                        >
                                                            <BookOpen size={16} className="text-violet-500" />
                                                            <span>Manifesto</span>
                                                        </Link>
                                                        <div className="h-px bg-white/5 my-1"></div>
                                                        <Link
                                                            to="/settings"
                                                            onClick={() => setIsCreatorMenuOpen(false)}
                                                            className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                                        >
                                                            <Settings size={16} className="text-violet-500" />
                                                            <span>Settings</span>
                                                        </Link>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {!isCreator && (
                                        <Link
                                            to="/profile"
                                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${location.pathname === '/profile' ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                                        >
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold border border-white/10">
                                                M
                                            </div>
                                            <span className="font-medium hidden sm:inline">Profile</span>
                                        </Link>
                                    )}

                                    <button
                                        onClick={logout}
                                        className="text-sm text-zinc-500 hover:text-white transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={openLoginModal}
                                    className="px-5 py-2 rounded-full border border-white text-white text-sm hover:bg-white hover:text-black transition-colors"
                                >
                                    Login/Join
                                </button>
                            )}
                        </div>
                    </div>
                </header>
            )}

            {/* Spacer */}
            <div style={{ height: '40px', width: '100%' }} />

            {/* Main Content */}
            <main className="flex-1">
                <Outlet />
            </main>

            <Footer />
            <LoginModal />
            <CreateAccountModal />
        </div>
    );
};

export default Layout;
