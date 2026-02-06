"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Lock } from "lucide-react";
import FloatingHearts from "./components/FloatingHearts";
import styles from "./page.module.css";

const STORAGE_KEY = "dearp_authenticated";
const CORRECT_PASSWORD = "01042024"; // Valentine's Day format - change this!

export default function Home() {
  const router = useRouter();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Check if already authenticated
  const handleEnterClick = () => {
    if (typeof window !== "undefined") {
      const isAuthenticated = localStorage.getItem(STORAGE_KEY) === "true";
      if (isAuthenticated) {
        router.push("/timeline");
      } else {
        setShowPasswordModal(true);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, "true");
      setError("");
      router.push("/timeline");
    } else {
      setError("Not quite, my love... Try again? 💕");
      setPassword("");
    }
  };

  return (
    <main className={styles.hero}>
      <FloatingHearts count={20} />

      <div className={styles.content}>
        {/* Sparkles decoration */}
        <motion.div
          className={styles.sparkle}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles size={32} />
        </motion.div>

        {/* Main quote */}
        <motion.p
          className={styles.quote}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          To the girl who makes distance feel temporary...
        </motion.p>

        {/* Her name */}
        <motion.h1
          className={styles.name}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          Priya
          <motion.span
            className={styles.heart}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Heart fill="currentColor" size={48} />
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          This is our little internet home
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <button onClick={handleEnterClick} className={styles.ctaButton}>
            <span className={styles.ctaMain}>
              <Heart size={20} />
              Enter Our World
            </span>
            <span className={styles.ctaSub}>Click to begin</span>
          </button>
        </motion.div>
      </div>

      {/* Decorative gradient orbs */}
      <div className={styles.orb1}></div>
      <div className={styles.orb2}></div>

      {/* Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPasswordModal(false)}
          >
            <motion.div
              className={styles.modal}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalIcon}>
                <Lock size={40} />
              </div>
              <h2 className={styles.modalTitle}>Only You Belong Here</h2>
              <p className={styles.modalSubtitle}>Enter the secret password, my love 💝</p>
              
              <form onSubmit={handleSubmit} className={styles.modalForm}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Our special date..."
                  className={styles.modalInput}
                  autoFocus
                />
                
                <AnimatePresence>
                  {error && (
                    <motion.p
                      className={styles.modalError}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <button type="submit" className={styles.modalButton}>
                  <Heart size={18} />
                  Enter Our World
                </button>
              </form>
              
              <p className={styles.modalHint}>Hint: The day we started &quot;chatting&quot; (DDMMYYYY) 💕</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
