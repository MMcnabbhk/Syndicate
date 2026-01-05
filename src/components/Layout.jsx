import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { BookOpen, User, Library, PenTool, Search, Headphones, House, LayoutDashboard, ChevronDown, UserCircle, Settings, Users, DollarSign, Mail } from 'lucide-react';
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
    const [isReaderMenuOpen, setIsReaderMenuOpen] = React.useState(false);
    const [isAdminMenuOpen, setIsAdminMenuOpen] = React.useState(false);

    const isCreator = userState.isAuthenticated && userState.role === 'creator';
    const isAdmin = userState.isAuthenticated && userState.role === 'admin';
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
                        <div className="absolute right-0 flex items-center gap-6 z-20">
                            <NotificationCenter />
                            {userState.isAuthenticated ? (
                                <div className="flex items-center gap-4">
                                    {isAdmin && (
                                        <div className="relative">
                                            <button
                                                onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                                                className="flex items-center gap-1 px-3 py-2 rounded-lg transition-all"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    padding: '8px 12px',
                                                    borderRadius: '8px',
                                                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                                    color: '#ef4444',
                                                    border: '1px solid rgba(239, 68, 68, 0.2)',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <LayoutDashboard size={20} />
                                                <span className="text-sm font-bold" style={{ marginLeft: '4px' }}>Admin</span>
                                                <ChevronDown size={14} className={`transition-transform ${isAdminMenuOpen ? 'rotate-180' : ''}`} />
                                            </button>

                                            {isAdminMenuOpen && (
                                                <div
                                                    className="absolute right-0 mt-2 w-56 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[100]"
                                                    style={{
                                                        backgroundColor: '#1a1a1a',
                                                        display: 'block',
                                                        position: 'absolute',
                                                        right: 0,
                                                        marginTop: '8px',
                                                        width: '14rem'
                                                    }}
                                                >
                                                    <div className="p-2 space-y-[9px]" style={{ padding: '8px' }}>
                                                        <Link
                                                            to="/admin/dashboard"
                                                            onClick={() => setIsAdminMenuOpen(false)}
                                                            className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors"
                                                            style={{ color: '#d4d4d8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px' }}
                                                        >
                                                            <LayoutDashboard size={16} style={{ color: '#ef4444' }} />
                                                            <span>Dashboard</span>
                                                        </Link>
                                                        <Link
                                                            to="/admin/users"
                                                            onClick={() => setIsAdminMenuOpen(false)}
                                                            className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors"
                                                            style={{ color: '#d4d4d8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px' }}
                                                        >
                                                            <Users size={16} style={{ color: '#ef4444' }} />
                                                            <span>Users</span>
                                                        </Link>
                                                        <Link
                                                            to="/admin/messages"
                                                            onClick={() => setIsAdminMenuOpen(false)}
                                                            className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors"
                                                            style={{ color: '#d4d4d8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px' }}
                                                        >
                                                            <Mail size={16} style={{ color: '#ef4444' }} />
                                                            <span>Messaging</span>
                                                        </Link>
                                                        <Link
                                                            to="/admin/financials"
                                                            onClick={() => setIsAdminMenuOpen(false)}
                                                            className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors"
                                                            style={{ color: '#d4d4d8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px' }}
                                                        >
                                                            <DollarSign size={16} style={{ color: '#ef4444' }} />
                                                            <span>Financials</span>
                                                        </Link>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

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
                                                            <span>Works</span>
                                                        </Link>
                                                        <Link
                                                            to="/manage-profile"
                                                            onClick={() => setIsCreatorMenuOpen(false)}
                                                            className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                                        >
                                                            <UserCircle size={16} className="text-violet-500" />
                                                            <span>Profile</span>
                                                        </Link>
                                                        <Link
                                                            to="/community"
                                                            onClick={() => setIsCreatorMenuOpen(false)}
                                                            className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                                        >
                                                            <Users size={16} className="text-violet-500" />
                                                            <span>Fans & Contributors</span>
                                                        </Link>
                                                        <Link
                                                            to="/invites"
                                                            onClick={() => setIsCreatorMenuOpen(false)}
                                                            className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                                        >
                                                            <Mail size={16} className="text-violet-500" />
                                                            <span>Invites</span>
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

                                    {!isCreator && !isAdmin && (
                                        <div className="relative">
                                            <button
                                                onClick={() => setIsReaderMenuOpen(!isReaderMenuOpen)}
                                                className={`flex items-center gap-1 px-3 py-2 rounded-lg bg-violet-600/20 text-violet-400 border border-violet-500/30 hover:bg-violet-600/30 transition-all`}
                                            >
                                                <LayoutDashboard size={20} />
                                                <ChevronDown size={14} className={`transition-transform ${isReaderMenuOpen ? 'rotate-180' : ''}`} />
                                            </button>

                                            {isReaderMenuOpen && (
                                                <div className="absolute right-0 mt-2 w-56 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[100] animate-in fade-in zoom-in duration-200">
                                                    <div className="p-2 space-y-[9px]">
                                                        <Link
                                                            to="/subscribed-works"
                                                            onClick={() => setIsReaderMenuOpen(false)}
                                                            className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                                        >
                                                            <Library size={16} className="text-violet-500" />
                                                            <span>Works</span>
                                                        </Link>
                                                        <Link
                                                            to="/following-creators"
                                                            onClick={() => setIsReaderMenuOpen(false)}
                                                            className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                                        >
                                                            <UserCircle size={16} className="text-violet-500" />
                                                            <span>Creators</span>
                                                        </Link>
                                                        <Link
                                                            to="/reader-contributions"
                                                            onClick={() => setIsReaderMenuOpen(false)}
                                                            className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                                        >
                                                            <DollarSign size={16} className="text-violet-500" />
                                                            <span>Contributions</span>
                                                        </Link>
                                                        <div className="h-px bg-white/5 my-1"></div>
                                                        <Link
                                                            to="/settings"
                                                            onClick={() => setIsReaderMenuOpen(false)}
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

            {/* 50px Footer Spacer */}
            <div style={{ height: '50px' }}></div>

            <Footer />
            <LoginModal />
            <CreateAccountModal />
        </div>
    );
};

export default Layout;
