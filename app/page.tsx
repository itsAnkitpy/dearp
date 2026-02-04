"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, Sparkles } from "lucide-react";
import FloatingHearts from "./components/FloatingHearts";
import styles from "./page.module.css";

export default function Home() {
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
          <Link href="/timeline" className={styles.ctaButton}>
            <span className={styles.ctaMain}>
              <Heart size={20} />
              Enter Our World
            </span>
            <span className={styles.ctaSub}>Click to begin</span>
          </Link>
        </motion.div>
      </div>

      {/* Decorative gradient orbs */}
      <div className={styles.orb1}></div>
      <div className={styles.orb2}></div>
    </main>
  );
}
