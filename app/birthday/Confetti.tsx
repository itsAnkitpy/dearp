"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import styles from "./page.module.css";

const COLORS = ["#ff6b9d", "#ffd700", "#c084fc", "#ffffff", "#ff8fb3", "#7dd3fc", "#fb7185"];
const SHAPES = ["ribbon", "ribbon", "dot", "heart", "sparkle"] as const;
const PER_BURST = 90;

// Fixed pseudo-random values so server and browser render the same pieces
const rand = (i: number, k: number) => ((i * 9301 + k * 49297) % 233280) / 233280;

// Two cannons (bottom-left, bottom-right) x two waves
const PIECES = Array.from({ length: PER_BURST * 4 }, (_, i) => {
    const fromLeft = i % 2 === 0;
    const wave = Math.floor(i / (PER_BURST * 2));
    const dir = fromLeft ? 1 : -1;
    const reach = 25 + rand(i, 1) * 55; // how far across the screen, in vw
    const peak = 55 + rand(i, 2) * 40; // how high it flies, in vh
    return {
        fromLeft,
        shape: SHAPES[i % SHAPES.length],
        color: COLORS[i % COLORS.length],
        x: ["0vw", `${dir * reach * 0.6}vw`, `${dir * reach}vw`],
        y: ["0vh", `-${peak}vh`, "15vh"],
        rotate: rand(i, 3) * 1080 - 540,
        flip: rand(i, 4) * 1440,
        delay: wave * 1.2 + rand(i, 5) * 0.25,
        duration: 2.8 + rand(i, 6) * 1.6,
        size: 0.8 + rand(i, 7) * 0.6,
    };
});

export default function Confetti() {
    return (
        <div className={styles.confetti} aria-hidden="true">
            {PIECES.map((p, i) => (
                <motion.span
                    key={i}
                    className={`${styles.piece} ${styles[p.shape]}`}
                    style={{
                        [p.fromLeft ? "left" : "right"]: "-10px",
                        color: p.color,
                        background: p.shape === "ribbon" || p.shape === "dot" ? p.color : undefined,
                        scale: p.size,
                    }}
                    initial={{ x: "0vw", y: "0vh", rotate: 0, rotateX: 0, opacity: 1 }}
                    animate={{ x: p.x, y: p.y, rotate: p.rotate, rotateX: p.flip, opacity: [1, 1, 0] }}
                    transition={{
                        duration: p.duration,
                        delay: p.delay,
                        times: [0, 0.3, 1],
                        ease: ["easeOut", "easeIn"],
                    }}
                >
                    {p.shape === "heart" && <Heart size={16} fill="currentColor" strokeWidth={0} />}
                    {p.shape === "sparkle" && "✦"}
                </motion.span>
            ))}
        </div>
    );
}
