"use client";

import { motion } from "framer-motion";
import { Heart, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Navigation from "../components/Navigation";
import FloatingHearts from "../components/FloatingHearts";
import styles from "./page.module.css";

export default function ValentinePage() {
    return (
        <>
            <Navigation />
            <main className={styles.page}>
                <FloatingHearts count={30} />

                <motion.div
                    className={styles.content}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    {/* Decorative hearts */}
                    <motion.div
                        className={styles.decoration}
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    >
                        <Sparkles size={40} />
                    </motion.div>

                    {/* Main heading */}
                    <motion.h1
                        className={styles.title}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        Happy Valentine&apos;s Day
                    </motion.h1>

                    <motion.p
                        className={styles.to}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        My Dearest Priya 💝
                    </motion.p>

                    {/* The letter */}
                    <motion.div
                        className={styles.letter}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                    >
                        <p>
                            If you&apos;re reading this, it means I managed to pour my heart into code just for you.
                        </p>
                        <p>
                            Every pixel on this website is a love letter. Every animation is a heartbeat. Every color was chosen thinking of you.
                        </p>
                        <p>
                            This distance between us? It&apos;s nothing compared to how close you are to my heart. Every day I choose you. Every moment I think of you. And every tomorrow, I look forward to building our forever.
                        </p>
                        <p>
                            You are my favorite notification. My most awaited call. My sweetest good morning text. My &quot;I can&apos;t wait to see you&quot; feeling every single day.
                        </p>
                        <p>
                            This website is just a tiny reflection of what you mean to me. The real gift? It&apos;s the promise that I&apos;ll keep choosing you, loving you, and fighting for us – no matter the distance.
                        </p>
                        <p className={styles.signature}>
                            Forever and always yours,
                            <br />
                            <strong>Ankit</strong>
                        </p>
                    </motion.div>

                    {/* Promise section */}
                    <motion.div
                        className={styles.promise}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.2 }}
                    >
                        <Heart className={styles.promiseHeart} size={32} fill="currentColor" />
                        <p className={styles.promiseText}>
                            &quot;This distance is temporary. Us is permanent.&quot;
                        </p>
                    </motion.div>

                    {/* Navigation */}
                    <motion.div
                        className={styles.nav}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.5 }}
                    >
                        <Link href="/" className={styles.backLink}>
                            <ArrowLeft size={18} />
                            Back to our home
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Decorative orbs */}
                <div className={styles.orb1}></div>
                <div className={styles.orb2}></div>
                <div className={styles.orb3}></div>
            </main>
        </>
    );
}
