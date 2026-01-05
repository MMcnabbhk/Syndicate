import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, UserX, Trash2, Download, Shield, ShieldOff, Filter, Mail } from 'lucide-react';

const mockUsers = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'reader', status: 'active', joinedDate: '2025-01-15' },
    { id: '2', name: 'Jane Smith', email: 'jane@author.com', role: 'creator', status: 'active', joinedDate: '2025-02-10', worksCount: 5 },
    { id: '3', name: 'Robert Johnson', email: 'rob@writer.com', role: 'creator', status: 'suspended', joinedDate: '2025-03-05', worksCount: 2 },
    { id: '4', name: 'Alice Williams', email: 'alice@example.com', role: 'reader', status: 'active', joinedDate: '2025-04-20' },
    { id: '5', name: 'Admin User', email: 'admin@syndicate.com', role: 'admin', status: 'active', joinedDate: '2025-01-01' },
];

const AdminUsers = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all'); // 'all', 'reader', 'creator'

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (err) {
            console.error("Failed to fetch users:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSuspend = async (userId, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
        const action = currentStatus === 'active' ? 'Suspend' : 'Activate';
        if (window.confirm(`Are you sure you want to ${action} this user?`)) {
            try {
                const res = await fetch(`/api/admin/users/${userId}/status`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: newStatus })
                });
                if (res.ok) {
                    setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
                }
            } catch (err) {
                console.error("Failed to update user status:", err);
                alert("Failed to update user status");
            }
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to PERMANENTLY delete this user? This action cannot be undone.')) {
            try {
                const res = await fetch(`/api/admin/users/${userId}`, {
                    method: 'DELETE'
                });
                if (res.ok) {
                    setUsers(users.filter(u => u.id !== userId));
                }
            } catch (err) {
                console.error("Failed to delete user:", err);
                alert("Failed to delete user");
            }
        }
    };

    const handleExport = () => {
        alert("Exporting all user emails to CSV...");
        // Logic to generate and download CSV
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    return (
        <div style={{ margin: '0 auto', maxWidth: '1280px', padding: '2rem 1rem' }}>
            <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2" style={{ marginBottom: '8px' }}>User Management</h1>
                    <p className="text-zinc-400" style={{ color: '#a1a1aa' }}>Manage user accounts, roles, and status.</p>
                </div>
            </div>

            {/* Filters */}
            <div style={{ height: '20px' }}></div>
            <div className="flex flex-col md:flex-row gap-4 mb-6 bg-[#1a1a1a] p-4 rounded-xl border border-white/5">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#71717a' }} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                padding: '10px 10px 10px 40px',
                                color: 'white',
                                outline: 'none',
                                width: '256px'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', backgroundColor: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '8px', gap: '4px' }}>
                        {['all', 'reader', 'creator', 'admin'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilterRole(f)}
                                style={{
                                    padding: '6px 16px',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    transition: 'all 0.2s',
                                    backgroundColor: filterRole === f ? '#ef4444' : 'transparent',
                                    color: filterRole === f ? 'white' : '#a1a1aa',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div style={{ height: '20px' }}></div>

            {/* Users Table */}
            <div className="rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left" style={{ borderCollapse: 'separate', borderSpacing: '0 10px' }}>
                        <thead>
                            <tr style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 'bold', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}>User</th>
                                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 'bold', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left' }}>Role</th>
                                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 'bold', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Works</th>
                                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 'bold', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Contributors</th>
                                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 'bold', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Fans</th>
                                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 'bold', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left' }}>Balance</th>
                                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 'bold', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left' }}>Status</th>
                                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 'bold', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left' }}>Joined</th>
                                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 'bold', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right', borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="10" className="p-8 text-center">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="group" style={{ backgroundColor: 'transparent' }}>
                                        <td style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <User size={20} style={{ color: '#a1a1aa' }} />
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '14px', fontWeight: '500', color: 'white' }}>{user.name || 'Unknown'}</div>
                                                    <div style={{ fontSize: '12px', color: '#71717a' }}>{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '9999px',
                                                fontSize: '12px',
                                                backgroundColor: user.role === 'admin' ? 'rgba(239, 68, 68, 0.1)' : user.role === 'creator' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                                color: user.role === 'admin' ? '#ef4444' : user.role === 'creator' ? '#8b5cf6' : '#3b82f6',
                                                border: `1px solid ${user.role === 'admin' ? 'rgba(239, 68, 68, 0.2)' : user.role === 'creator' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`
                                            }}>
                                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px', fontSize: '14px', color: '#a1a1aa', fontWeight: '500', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                                            {user.works_count || 0}
                                        </td>
                                        <td style={{ padding: '16px', fontSize: '14px', color: '#a1a1aa', fontWeight: '500', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                                            {user.contributors_count || 0}
                                        </td>
                                        <td style={{ padding: '16px', fontSize: '14px', color: '#a1a1aa', fontWeight: '500', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                                            {user.fans_count || 0}
                                        </td>
                                        <td style={{ padding: '16px', fontSize: '14px', color: '#10b981', fontWeight: 'bold', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            ${parseFloat(user.author_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </td>
                                        <td style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <span style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                fontSize: '12px',
                                                color: (user.status || 'active') === 'active' ? '#10b981' : '#f43f5e'
                                            }}>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: (user.status || 'active') === 'active' ? '#10b981' : '#f43f5e' }}></div>
                                                {((user.status || 'active').charAt(0).toUpperCase() + (user.status || 'active').slice(1))}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px', fontSize: '14px', color: '#71717a', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                                {user.role !== 'admin' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleSuspend(user.id, user.status || 'active')}
                                                            style={{
                                                                padding: '8px',
                                                                backgroundColor: 'transparent',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                borderRadius: '8px',
                                                                color: '#71717a',
                                                                transition: 'all 0.2s'
                                                            }}
                                                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#ef4444'; }}
                                                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#71717a'; }}
                                                            title={(user.status || 'active') === 'active' ? 'Suspend' : 'Activate'}
                                                        >
                                                            {(user.status || 'active') === 'active' ? <ShieldOff size={18} /> : <Shield size={18} />}
                                                        </button>
                                                        <button
                                                            onClick={() => navigate('/admin/messages', { state: { email: user.email } })}
                                                            style={{
                                                                padding: '8px',
                                                                backgroundColor: 'transparent',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                borderRadius: '8px',
                                                                color: '#71717a',
                                                                transition: 'all 0.2s'
                                                            }}
                                                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)'; e.currentTarget.style.color = '#3b82f6'; }}
                                                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#71717a'; }}
                                                            title="Email User"
                                                        >
                                                            <Mail size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(user.id)}
                                                            style={{
                                                                padding: '8px',
                                                                backgroundColor: 'transparent',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                borderRadius: '8px',
                                                                color: '#71717a',
                                                                transition: 'all 0.2s'
                                                            }}
                                                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = '#ef4444'; }}
                                                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#71717a'; }}
                                                            title="Delete User"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="p-12 text-center text-zinc-500">
                                        No users match your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
