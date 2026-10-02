export interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export function calculateTimeLeft(targetDate: string | null): TimeLeft | null {
    if (!targetDate) return null;

    const difference = new Date(targetDate).getTime() - new Date().getTime();

    if (difference <= 0) return null;

    return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
    };
}
