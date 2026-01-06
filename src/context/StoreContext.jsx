
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const INITIAL_USER_STATE = {
    subscriptions: [],
    walletBalance: 50.00,
    role: 'creator',
    isAuthenticated: true
};


const StoreContext = createContext();

export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }) => {
    const navigate = useNavigate();

    // Initialize state from LocalStorage or default mock
    const [userState, setUserState] = useState(() => {
        console.log('StoreProvider initializing state');
        const saved = localStorage.getItem('syndicate_user_v3');
        return saved ? JSON.parse(saved) : INITIAL_USER_STATE;
    });

    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] = useState(false);

    // Check session on mount
    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await fetch('/api/auth/me', {
                    credentials: 'include' // Critical for sending the session cookie
                });
                const data = await res.json();
                if (data.isAuthenticated) {
                    setUserState(prev => ({
                        ...prev,
                        isAuthenticated: true,
                        role: data.user.role || 'reader',
                        authorId: data.user.authorId || null
                    }));
                } else {
                    // If server says not authenticated, clear local state
                    setUserState(prev => ({ ...prev, isAuthenticated: false, role: 'reader', authorId: null }));
                    localStorage.removeItem('syndicate_user_v3');
                }
            } catch (err) {
                console.error("Session check failed", err);
            }
        };
        checkSession();
    }, []);

    // Persist to LocalStorage whenever state changes (keep this for preferences/subscriptions if not fully migrated)
    useEffect(() => {
        localStorage.setItem('syndicate_user_v3', JSON.stringify(userState));
    }, [userState]);

    // Actions
    const subscribeToBook = (bookId) => {
        // Check if already subscribed
        if (userState.subscriptions.find(s => s.bookId === bookId)) return;

        const newSub = {
            bookId,
            startDate: new Date().toISOString(), // Critical: The start timer
            lastReadChapterIndex: 0
        };

        setUserState(prev => ({
            ...prev,
            subscriptions: [...prev.subscriptions, newSub]
        }));
    };

    const getSubscription = (bookId) => {
        return userState.subscriptions.find(s => s.bookId === bookId);
    };


    const updateProgress = (bookId, chapterIndex) => {
        setUserState(prev => ({
            ...prev,
            subscriptions: prev.subscriptions.map(s =>
                s.bookId === bookId
                    ? { ...s, lastReadChapterIndex: Math.max(s.lastReadChapterIndex, chapterIndex) }
                    : s
            )
        }));
    };

    const login = (userData = 'reader') => {
        if (typeof userData === 'string') {
            setUserState(prev => ({ ...prev, isAuthenticated: true, role: userData }));
        } else {
            setUserState(prev => ({
                ...prev,
                isAuthenticated: true,
                role: userData.role || 'reader',
                authorId: userData.authorId || null
            }));
        }
        setIsLoginModalOpen(false);
    };

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch (e) {
            console.error("Logout error", e);
        }
        setUserState(prev => ({ ...prev, isAuthenticated: false }));
        navigate('/');
    };

    const openLoginModal = () => setIsLoginModalOpen(true);
    const closeLoginModal = () => setIsLoginModalOpen(false);

    const openCreateAccountModal = () => setIsCreateAccountModalOpen(true);
    const closeCreateAccountModal = () => setIsCreateAccountModalOpen(false);

    const value = {
        userState,
        subscribeToBook,
        getSubscription,
        updateProgress,
        login,
        logout,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        isCreateAccountModalOpen,
        openCreateAccountModal,
        closeCreateAccountModal
    };

    return (
        <StoreContext.Provider value={value}>
            {children}
        </StoreContext.Provider>
    );
};
