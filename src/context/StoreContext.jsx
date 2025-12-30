
import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USER_STATE } from '../data/mockData';

const StoreContext = createContext();

export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }) => {
    // Initialize state from LocalStorage or default mock
    const [userState, setUserState] = useState(() => {
        console.log('StoreProvider initializing state');
        const saved = localStorage.getItem('syndicate_user_v2');
        return saved ? JSON.parse(saved) : INITIAL_USER_STATE;
    });

    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] = useState(false);

    // Persist to LocalStorage whenever state changes
    useEffect(() => {
        localStorage.setItem('syndicate_user_v2', JSON.stringify(userState));
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

    const login = (role = 'reader') => {
        setUserState(prev => ({ ...prev, isAuthenticated: true, role }));
        setIsLoginModalOpen(false);
    };

    const logout = () => {
        setUserState(prev => ({ ...prev, isAuthenticated: false }));
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
