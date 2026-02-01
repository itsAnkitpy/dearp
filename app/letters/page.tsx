"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Heart, X } from "lucide-react";
import Navigation from "../components/Navigation";
import lettersData from "../../content/letters.json";
import styles from "./page.module.css";

export default function LettersPage() {
    const [openLetter, setOpenLetter] = useState<typeof lettersData[0] | null>(null);

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
                        Open When...
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Letters written from my heart to yours
                    </motion.p>
                </div>

                <div className={styles.envelopes}>
                    {lettersData.map((letter, index) => (
                        <motion.button
                            key={letter.id}
                            className={styles.envelope}
                            style={{ "--accent": letter.color } as React.CSSProperties}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setOpenLetter(letter)}
                        >
                            <div className={styles.envelopeFlap}></div>
                            <div className={styles.envelopeBody}>
                                <Mail size={32} />
                                <span className={styles.emoji}>{letter.emoji}</span>
                            </div>
                            <p className={styles.label}>{letter.label}</p>
                        </motion.button>
                    ))}
                </div>

                {/* Letter Modal */}
                <AnimatePresence>
                    {openLetter && (
                        <motion.div
                            className={styles.modal}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpenLetter(null)}
                        >
                            <motion.div
                                className={styles.letter}
                                initial={{ scale: 0.8, y: 50, rotateX: -30 }}
                                animate={{ scale: 1, y: 0, rotateX: 0 }}
                                exit={{ scale: 0.8, y: 50, opacity: 0 }}
                                transition={{ type: "spring", damping: 25 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    className={styles.closeButton}
                                    onClick={() => setOpenLetter(null)}
                                    aria-label="Close letter"
                                >
                                    <X size={20} />
                                </button>

                                <div className={styles.letterHeader}>
                                    <span className={styles.letterEmoji}>{openLetter.emoji}</span>
                                    <h2>{openLetter.label}</h2>
                                </div>

                                <div className={styles.letterContent}>
                                    {openLetter.content.split('\n').map((line, i) => (
                                        <p key={i}>{line || <br />}</p>
                                    ))}
                                </div>

                                <div className={styles.letterFooter}>
                                    <Heart size={24} fill="currentColor" />
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </>
    );
}
