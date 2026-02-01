"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, VolumeX, Volume2 } from "lucide-react";
import styles from "./MusicToggle.module.css";

export default function MusicToggle() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [showHint, setShowHint] = useState(true);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Create audio element on mount
        audioRef.current = new Audio("/music/song.mp3");
        audioRef.current.loop = true;
        audioRef.current.volume = 0.5;

        // Hide hint after 5 seconds
        const timer = setTimeout(() => setShowHint(false), 5000);

        return () => {
            clearTimeout(timer);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const toggleMusic = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch((e) => {
                console.log("Audio play failed:", e);
            });
        }
        setIsPlaying(!isPlaying);
        setShowHint(false);
    };

    return (
        <div className={styles.container}>
            {/* Hint tooltip */}
            <AnimatePresence>
                {showHint && (
                    <motion.div
                        className={styles.hint}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.3 }}
                    >
                        🎵 Play our song?
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Music button */}
            <motion.button
                className={`${styles.button} ${isPlaying ? styles.playing : ""}`}
                onClick={toggleMusic}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={isPlaying ? "Pause music" : "Play music"}
            >
                {isPlaying ? (
                    <Volume2 size={20} />
                ) : (
                    <VolumeX size={20} />
                )}

                {/* Animated sound waves when playing */}
                {isPlaying && (
                    <div className={styles.waves}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                )}
            </motion.button>
        </div>
    );
}
