
import { useMemo } from 'react';
import { addDays, isPast, formatDistanceToNow } from 'date-fns';

export const useRelativeSchedule = (book, subscription) => {

    const schedule = useMemo(() => {
        if (!subscription || !book) return null;

        const startDate = new Date(subscription.startDate);
        const frequency = book.frequencyInterval || 1; // Default to daily

        const getUnlockDate = (sequenceNumber) => {
            // Logic: Sequence 1 is immediate (Day 0). Sequence 2 is Day 1*Freq, etc.
            // Offset = (Sequence - 1) * Frequency
            const daysOffset = Math.max(0, sequenceNumber - 1) * frequency;
            return addDays(startDate, daysOffset);
        };

        const checkUnlocked = (sequenceNumber) => {
            const unlockDate = getUnlockDate(sequenceNumber);
            return isPast(unlockDate); // True if unlockDate is in the past (or now)
        };

        const getTimeUntil = (sequenceNumber) => {
            const unlockDate = getUnlockDate(sequenceNumber);
            if (isPast(unlockDate)) return 'Available Now';
            return formatDistanceToNow(unlockDate, { addSuffix: true });
        };

        return {
            getUnlockDate,
            checkUnlocked,
            getTimeUntil
        };
    }, [book, subscription]);

    return schedule;
};
