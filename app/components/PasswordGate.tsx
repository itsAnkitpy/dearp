"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Lock } from "lucide-react";
import styles from "./PasswordGate.module.css";

interface PasswordGateProps {
    children: React.ReactNode;
    correctPassword?: string;
}

const STORAGE_KEY = "dearp_authenticated";

export default function PasswordGate({
    children,
    correctPassword = "14022024" // Default: Valentine's Day format
}: PasswordGateProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // Check localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === "true") {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (password === correctPassword) {
            localStorage.setItem(STORAGE_KEY, "true");
            setIsAuthenticated(true);
            setError("");
        } else {
            setError("Not quite, my love... Try again? 💕");
            setPassword("");
        }
    };

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <Heart className={styles.loadingHeart} />
            </div>
        );
    }

    if (isAuthenticated) {
        return <>{children}</>;
    }

    return (
        <div className={styles.container}>
            <motion.div
                className={styles.gate}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className={styles.icon}>
                    <Lock size={48} />
                </div>

                <h1 className={styles.title}>Only You Belong Here</h1>
                <p className={styles.subtitle}>Enter our secret password, my love 💝</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Our special date..."
                        className={styles.input}
                        autoFocus
                    />

                    <AnimatePresence>
                        {error && (
                            <motion.p
                                className={styles.error}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                            >
                                {error}
                            </motion.p>
                        )}
                    </AnimatePresence>

                    <button type="submit" className={`btn btn-primary ${styles.button}`}>
                        <Heart size={18} />
                        Enter Our World
                    </button>
                </form>

                <p className={styles.hint}>Hint: The day we became "us" (DDMMYYYY) 💕</p>
            </motion.div>
        </div>
    );
}
