import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, UserPlus, Check } from 'lucide-react';

const FollowButton = ({ authorId, style = {} }) => {
    const queryClient = useQueryClient();
    const [isHovered, setIsHovered] = useState(false);

    // 1. Fetch current status
    const { data, isLoading } = useQuery({
        queryKey: ['isFollowing', authorId],
        queryFn: async () => {
            const res = await fetch(`/api/community/following/${authorId}`);
            if (!res.ok) throw new Error('Failed to fetch status');
            return res.json();
        }
    });

    const isFollowing = data?.isFollowing;

    // 2. Mutation with Optimistic Update
    const mutation = useMutation({
        mutationFn: async (newStatus) => {
            const endpoint = newStatus ? 'follow' : 'unfollow';
            const res = await fetch(`/api/community/${endpoint}/${authorId}`, {
                method: 'POST'
            });
            if (!res.ok) throw new Error('Failed to update status');
            return res.json();
        },
        onMutate: async (newStatus) => {
            await queryClient.cancelQueries({ queryKey: ['isFollowing', authorId] });
            const previousStatus = queryClient.getQueryData(['isFollowing', authorId]);
            queryClient.setQueryData(['isFollowing', authorId], { isFollowing: newStatus });
            return { previousStatus };
        },
        onError: (err, newStatus, context) => {
            queryClient.setQueryData(['isFollowing', authorId], context.previousStatus);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['isFollowing', authorId] });
        },
    });

    const handleToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        mutation.mutate(!isFollowing);
    };

    // Inline Styles
    const baseStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'transparent',
        padding: '0',
        borderRadius: '0',
        fontSize: '0.75rem', // text-xs like before
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        cursor: mutation.isPending ? 'wait' : 'pointer',
        border: 'none',
        transition: 'color 0.2s ease',
        outline: 'none',
        ...style // Allow overrides
    };

    const activeStyle = {
        color: '#f97316' // Orange for Following
    };

    const inactiveStyle = {
        color: isHovered ? '#ffffff' : '#a1a1aa' // Hover White, default Zinc-400
    };

    const currentStyle = {
        ...baseStyle,
        ...(isFollowing ? activeStyle : inactiveStyle),
        opacity: isLoading ? 0.5 : 1
    };

    if (isLoading) {
        return (
            <button style={currentStyle} disabled>
                <Loader2 size={16} className="animate-spin" />
            </button>
        );
    }

    return (
        <button
            onClick={handleToggle}
            disabled={mutation.isPending}
            style={currentStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {isFollowing ? <Check size={16} /> : <UserPlus size={16} />}
            {isFollowing ? 'Following' : 'Follow'}
        </button>
    );
};

export default FollowButton;
