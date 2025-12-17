import { useState, useEffect } from 'react';

export const useCountdown = (targetTimestamp) => {
    const [countdown, setCountdown] = useState('');

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = Math.floor(Date.now() / 1000);
            const difference = targetTimestamp - now;

            if (difference <= 0) {
                return '¡EN VIVO!';
            }

            const days = Math.floor(difference / (60 * 60 * 24));
            const hours = Math.floor((difference % (60 * 60 * 24)) / (60 * 60));
            const minutes = Math.floor((difference % (60 * 60)) / 60);
            const seconds = difference % 60;

            if (days > 0) {
                return `${days}d ${hours}h ${minutes}m`;
            } else if (hours > 0) {
                return `${hours}h ${minutes}m ${seconds}s`;
            } else {
                return `${minutes}m ${seconds}s`;
            }
        };

        setCountdown(calculateTimeLeft());

        const timer = setInterval(() => {
            setCountdown(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetTimestamp]);

    return countdown;
};
