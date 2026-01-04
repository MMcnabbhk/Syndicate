import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, X, Check, Info } from 'lucide-react';

const NotificationCenter = () => {
    const [unreadCount, setUnreadCount] = React.useState(0);
    const location = useLocation();
    const navigate = useNavigate();
    const isOnNotificationsPage = location.pathname === '/notifications';

    // Fetch real notifications count
    React.useEffect(() => {
        const fetchNotifications = async () => {
            try {
                // In a real app with auth context, get userId from there.
                // Here we rely on the backend default or session.
                const response = await fetch('http://localhost:4000/api/notifications');
                if (response.ok) {
                    const data = await response.json();
                    const count = data.filter(n => !n.is_read).length;
                    setUnreadCount(count);
                }
            } catch (error) {
                console.error('Failed to fetch notification count:', error);
            }
        };

        fetchNotifications();
        // Optional: Poll every minute? For now, just once on mount/nav change
    }, [location.pathname]); // Re-fetch when moving pages might be good to update count

    const handleClick = (e) => {
        if (isOnNotificationsPage) {
            e.preventDefault();
            navigate('/'); // "Close" behavior: Go to Home
        }
    };

    return (
        <Link
            to="/notifications"
            onClick={handleClick}
            className={`relative p-2 transition-colors rounded-full border border-white/5 ${isOnNotificationsPage
                ? 'bg-white text-black hover:bg-zinc-200'
                : 'bg-white/5 text-zinc-400 hover:text-white'
                }`}
        >
            <Bell size={20} />
            {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-[#1a1a1a]">
                    {unreadCount}
                </span>
            )}
        </Link>
    );
};

export default NotificationCenter;
