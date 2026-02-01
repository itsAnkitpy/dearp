"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import styles from "./FloatingHearts.module.css";

interface FloatingHeartsProps {
    count?: number;
}

interface HeartData {
    id: number;
    size: number;
    left: number;
    delay: number;
    duration: number;
    opacity: number;
    xOffset: number;
    rotation: number;
}

export default function FloatingHearts({ count = 15 }: FloatingHeartsProps) {
    const [hearts, setHearts] = useState<HeartData[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setHearts(
            Array.from({ length: count }, (_, i) => ({
                id: i,
                size: Math.random() * 20 + 10,
                left: Math.random() * 100,
                delay: Math.random() * 5,
                duration: Math.random() * 10 + 15,
                opacity: Math.random() * 0.3 + 0.1,
                xOffset: Math.random() * 100 - 50,
                rotation: Math.random() * 360,
            }))
        );
    }, [count]);

    if (!mounted) return null;

    return (
        <div className={styles.container} aria-hidden="true">
            {hearts.map((heart) => (
                <motion.div
                    key={heart.id}
                    className={styles.heart}
                    style={{
                        left: `${heart.left}%`,
                        fontSize: heart.size,
                        opacity: heart.opacity,
                    }}
                    animate={{
                        y: [0, -1000],
                        x: [0, heart.xOffset],
                        rotate: [0, heart.rotation],
                    }}
                    transition={{
                        duration: heart.duration,
                        repeat: Infinity,
                        delay: heart.delay,
                        ease: "linear",
                    }}
                >
                    <Heart fill="currentColor" />
                </motion.div>
            ))}
        </div>
    );
}
