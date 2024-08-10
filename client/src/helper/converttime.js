import { differenceInMinutes, differenceInHours, differenceInDays } from 'date-fns';

export const formatTimeAgo = (date) => {
    const now = new Date();
    const createdDate = new Date(date);

    const minutes = differenceInMinutes(now, createdDate);
    if (minutes < 60) return `${minutes}m`;

    const hours = differenceInHours(now, createdDate);
    if (hours < 24) return `${hours}h`;

    const days = differenceInDays(now, createdDate);
    return `${days}d`;
};
