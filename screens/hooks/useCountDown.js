import { useEffect, useState } from 'react'

export default function useCountDown() {
    const [timeLeft, setTimeLeft] = useState(0)

    useEffect (() => {
        if (timeLeft <= 0) return;
        
        const timeout = setTimeout(() => {
            setTimeLeft(timeLeft - 1)
        }, 1000);

        return () => clearTimeout(timeout);
    }, [timeLeft]);

    const start = (seconds) => {
        setTimeLeft(seconds);
    }
    
    return {timeLeft, start};
}
