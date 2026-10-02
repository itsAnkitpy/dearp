"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wind } from "lucide-react";
import styles from "./Cake.module.css";

const CANDLES = 5;
// Mic loudness (0–1) that counts as blowing. Phones differ: tune on her phone model.
// ponytail: plain loudness check, add frequency analysis only if talking triggers it
const BLOW_THRESHOLD = 0.15;
const BLOW_MS = 150; // must stay loud this long to count
const GAP_MS = 400; // pause between candles so one breath doesn't clear the cake

export default function Cake({ onDone }: { onDone: () => void }) {
    const [lit, setLit] = useState<boolean[]>(Array(CANDLES).fill(true));
    const [listening, setListening] = useState(false);
    const [micFailed, setMicFailed] = useState(false);
    const stopRef = useRef<() => void>(() => {});
    const allOut = lit.every((l) => !l);

    // Stop the mic when unmounting
    useEffect(() => () => stopRef.current(), []);

    useEffect(() => {
        if (!allOut) return;
        stopRef.current();
        const t = setTimeout(onDone, 900);
        return () => clearTimeout(t);
    }, [allOut, onDone]);

    const blowOut = (index?: number) => {
        navigator.vibrate?.(40);
        setLit((prev) => {
            const i = index ?? prev.indexOf(true);
            if (i < 0 || !prev[i]) return prev;
            return prev.map((l, j) => (j === i ? false : l));
        });
    };

    const startListening = async () => {
        // iOS needs the AudioContext created inside the tap
        const ctx = new AudioContext();
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            await ctx.resume();
            window.dispatchEvent(new Event("dearp:pause-music"));

            const analyser = ctx.createAnalyser();
            analyser.fftSize = 512;
            ctx.createMediaStreamSource(stream).connect(analyser);
            const samples = new Uint8Array(analyser.fftSize);

            let loudSince = 0;
            let lastBlow = 0;
            let frame = 0;
            const loop = (now: number) => {
                analyser.getByteTimeDomainData(samples);
                let sum = 0;
                for (const s of samples) sum += ((s - 128) / 128) ** 2;
                const loudness = Math.sqrt(sum / samples.length);

                if (loudness > BLOW_THRESHOLD) {
                    loudSince ||= now;
                    if (now - loudSince > BLOW_MS && now - lastBlow > GAP_MS) {
                        blowOut();
                        lastBlow = now;
                    }
                } else {
                    loudSince = 0;
                }
                frame = requestAnimationFrame(loop);
            };
            frame = requestAnimationFrame(loop);

            stopRef.current = () => {
                // Runs once: called when candles are out and again on unmount
                stopRef.current = () => {};
                cancelAnimationFrame(frame);
                stream.getTracks().forEach((t) => t.stop());
                ctx.close();
                setListening(false);
            };
            setListening(true);
        } catch {
            // Mic denied or missing: tapping the flames still works
            ctx.close();
            setMicFailed(true);
        }
    };

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>Happy Birthday, Priya</h1>
            <p className={styles.subtitle}>
                {allOut
                    ? "Yay!"
                    : listening
                      ? "Now blow into your phone..."
                      : micFailed
                        ? "Tap each flame to blow it out"
                        : "Close your eyes, make a wish, then blow out the candles"}
            </p>

            <div className={styles.cake}>
                <div className={styles.candles}>
                    {lit.map((on, i) => (
                        <button
                            key={i}
                            className={styles.candle}
                            onClick={() => blowOut(i)}
                            aria-label={on ? `Blow out candle ${i + 1}` : `Candle ${i + 1} is out`}
                        >
                            <AnimatePresence>
                                {on ? (
                                    <motion.span
                                        key="flame"
                                        className={styles.flame}
                                        style={{ animationDelay: `${i * 0.13}s` }}
                                        exit={{ scaleY: 0, opacity: 0, transition: { duration: 0.25 } }}
                                    />
                                ) : (
                                    <motion.span
                                        key="smoke"
                                        className={styles.smoke}
                                        initial={{ opacity: 0.7, y: 0, scale: 0.6 }}
                                        animate={{ opacity: 0, y: -40, scale: 1.6 }}
                                        transition={{ duration: 1.4, ease: "easeOut" }}
                                    />
                                )}
                            </AnimatePresence>
                            <span className={styles.wick} />
                            <span className={styles.stick} />
                        </button>
                    ))}
                </div>
                <div className={styles.tierTop}>
                    <span className={styles.drip} />
                </div>
                <div className={styles.tierBottom}>
                    <span className={styles.drip} />
                </div>
                <div className={styles.plate} />
            </div>

            {!listening && !micFailed && !allOut && (
                <motion.button
                    className={styles.blowButton}
                    onClick={startListening}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Wind size={20} />
                    Blow the candles
                </motion.button>
            )}
        </div>
    );
}
