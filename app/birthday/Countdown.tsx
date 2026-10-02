"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Cake } from "lucide-react";
import { calculateTimeLeft, TimeLeft } from "../../lib/time";
import styles from "./page.module.css";

export default function Countdown({ target }: { target: string }) {
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

    useEffect(() => {
        const tick = () => {
            const left = calculateTimeLeft(target);
            setTimeLeft(left);
            // Time's up: ask the server for the unlocked page
            if (!left) router.refresh();
        };
        const first = setTimeout(tick, 0);
        const timer = setInterval(tick, 1000);
        return () => {
            clearTimeout(first);
            clearInterval(timer);
        };
    }, [target, router]);

    const units: [keyof TimeLeft, string][] = [
        ["days", "Days"],
        ["hours", "Hours"],
        ["minutes", "Minutes"],
        ["seconds", "Seconds"],
    ];

    return (
        <motion.div
            className={styles.countdown}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <motion.div
                className={styles.cakeIcon}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
                <Cake size={56} />
            </motion.div>
            <h1>Something special is coming...</h1>
            <p className={styles.subtitle}>It opens at midnight on your birthday</p>

            <div className={styles.timerGrid}>
                {units.map(([key, label]) => (
                    <div key={key} className={styles.timerItem}>
                        <span className={styles.timerNumber}>{timeLeft ? timeLeft[key] : "--"}</span>
                        <span className={styles.timerLabel}>{label}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
