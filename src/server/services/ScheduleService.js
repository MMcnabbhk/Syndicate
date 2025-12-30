import { differenceInDays, addDays } from 'date-fns';

class ScheduleService {
    /**
     * Checks if a specific piece of content is available to a reader
     * based on their subscription date and the content's relative release day.
     * 
     * @param {Date|string} userJoinDate - When the user subscribed to this work
     * @param {number} releaseDay - The relative day this chapter should unlock (0, 7, etc.)
     * @returns {boolean}
     */
    static isContentAvailable(userJoinDate, releaseDay) {
        const today = new Date();
        const joinDate = new Date(userJoinDate);

        // Days elapsed since user joined
        const daysElapsed = differenceInDays(today, joinDate);

        return daysElapsed >= releaseDay;
    }

    /**
     * Calculates the date a specific relative day will occur for a user.
     * 
     * @param {Date|string} userJoinDate 
     * @param {number} releaseDay 
     * @returns {Date}
     */
    static getEstimatedUnlockDate(userJoinDate, releaseDay) {
        return addDays(new Date(userJoinDate), releaseDay);
    }
}

export default ScheduleService;
