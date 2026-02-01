"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, MapPin, Plane } from "lucide-react";
import Navigation from "../components/Navigation";
import distanceData from "../../content/distance.json";
import styles from "./page.module.css";

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

function calculateTimeLeft(targetDate: string | null): TimeLeft | null {
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

export default function DistancePage() {
    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        if (distanceData.nextMeeting) {
            const timer = setInterval(() => {
                setTimeLeft(calculateTimeLeft(distanceData.nextMeeting));
            }, 1000);

            setTimeLeft(calculateTimeLeft(distanceData.nextMeeting));

            return () => clearInterval(timer);
        }
    }, []);

    return (
        <>
            <Navigation />
            <main className={styles.page}>
                <div className={styles.header}>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Distance Doesn&apos;t Define Us
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {distanceData.message}
                    </motion.p>
                </div>

                {/* Visual Map */}
                <motion.div
                    className={styles.mapContainer}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    <div className={styles.map}>
                        {/* Your City */}
                        <motion.div
                            className={styles.city}
                            style={{ left: "15%", top: "40%" }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, type: "spring" }}
                        >
                            <div className={styles.pin}>
                                <MapPin size={32} />
                                <Heart className={styles.pinHeart} size={12} fill="currentColor" />
                            </div>
                            <p className={styles.cityName}>{distanceData.yourCity.name}</p>
                            <span className={styles.cityLabel}>Me</span>
                        </motion.div>

                        {/* Dotted Line */}
                        <svg className={styles.connection} viewBox="0 0 100 100" preserveAspectRatio="none">
                            <motion.path
                                d="M 20 50 Q 50 30 80 50"
                                fill="none"
                                stroke="var(--accent-pink)"
                                strokeWidth="0.5"
                                strokeDasharray="2 2"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1.5, delay: 0.8 }}
                            />
                        </svg>

                        {/* Airplane */}
                        <motion.div
                            className={styles.airplane}
                            initial={{ left: "20%", top: "35%", opacity: 0 }}
                            animate={{
                                left: ["20%", "50%", "75%"],
                                top: ["35%", "25%", "35%"],
                                opacity: [0, 1, 0]
                            }}
                            transition={{
                                duration: 3,
                                delay: 1,
                                repeat: Infinity,
                                repeatDelay: 2
                            }}
                        >
                            <Plane size={24} />
                        </motion.div>

                        {/* Her City */}
                        <motion.div
                            className={styles.city}
                            style={{ right: "15%", top: "40%" }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.7, type: "spring" }}
                        >
                            <div className={styles.pin}>
                                <MapPin size={32} />
                                <Heart className={styles.pinHeart} size={12} fill="currentColor" />
                            </div>
                            <p className={styles.cityName}>{distanceData.herCity.name}</p>
                            <span className={styles.cityLabel}>You</span>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Distance Display */}
                <motion.div
                    className={styles.distanceDisplay}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1 }}
                >
                    <span className={styles.distanceNumber}>
                        {mounted ? distanceData.distanceKm.toLocaleString() : "---"}
                    </span>
                    <span className={styles.distanceUnit}>kilometers apart</span>
                    <Heart className={styles.distanceHeart} size={24} fill="currentColor" />
                    <span className={styles.distanceSub}>but our hearts are always together</span>
                </motion.div>

                {/* Countdown Timer */}
                {timeLeft && (
                    <motion.div
                        className={styles.countdown}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.2 }}
                    >
                        <h3>Until we meet again</h3>
                        <div className={styles.timerGrid}>
                            <div className={styles.timerItem}>
                                <span className={styles.timerNumber}>{timeLeft.days}</span>
                                <span className={styles.timerLabel}>Days</span>
                            </div>
                            <div className={styles.timerItem}>
                                <span className={styles.timerNumber}>{timeLeft.hours}</span>
                                <span className={styles.timerLabel}>Hours</span>
                            </div>
                            <div className={styles.timerItem}>
                                <span className={styles.timerNumber}>{timeLeft.minutes}</span>
                                <span className={styles.timerLabel}>Minutes</span>
                            </div>
                            <div className={styles.timerItem}>
                                <span className={styles.timerNumber}>{timeLeft.seconds}</span>
                                <span className={styles.timerLabel}>Seconds</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {!distanceData.nextMeeting && (
                    <motion.p
                        className={styles.noDate}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                    >
                        💕 Set your next meeting date in content/distance.json
                    </motion.p>
                )}
            </main>
        </>
    );
}
