"use client";

import { motion } from "framer-motion";
import { Heart, ArrowRight } from "lucide-react";
import letterStyles from "../letters/page.module.css";
import styles from "./page.module.css";

interface BirthdayLetterProps {
    title: string;
    letter: string;
    voiceNote: string | null;
    onNext: () => void;
}

export default function BirthdayLetter({ title, letter, voiceNote, onNext }: BirthdayLetterProps) {
    return (
        <div className={styles.letterStep}>
            <motion.div
                className={letterStyles.letter}
                initial={{ scale: 0.8, y: 50, rotateX: -30, opacity: 0 }}
                animate={{ scale: 1, y: 0, rotateX: 0, opacity: 1 }}
                transition={{ type: "spring", damping: 25 }}
            >
                <div className={letterStyles.letterHeader}>
                    <span className={letterStyles.letterEmoji}>🎂</span>
                    <h2>{title}</h2>
                </div>

                {voiceNote && (
                    <div className={styles.voiceNote}>
                        <p>Press play, I recorded this for you</p>
                        {/* Stop the site song so the two don't overlap */}
                        <audio
                            controls
                            src={voiceNote}
                            onPlay={() => window.dispatchEvent(new Event("dearp:pause-music"))}
                        />
                    </div>
                )}

                <div className={letterStyles.letterContent}>
                    {letter.split("\n").map((line, i) => (
                        <p key={i}>{line || <br />}</p>
                    ))}
                </div>

                <div className={letterStyles.letterFooter}>
                    <Heart size={24} fill="currentColor" />
                </div>
            </motion.div>

            <button className={styles.nextButton} onClick={onNext}>
                Continue <ArrowRight size={18} />
            </button>
        </div>
    );
}
