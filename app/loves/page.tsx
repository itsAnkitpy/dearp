"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import Navigation from "../components/Navigation";
import lovesData from "../../content/loves.json";
import styles from "./page.module.css";

export default function LovesPage() {
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
                        Things I Love About You
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        A never-ending list that keeps growing
                    </motion.p>
                </div>

                <div className={styles.grid}>
                    {lovesData.map((item, index) => (
                        <motion.div
                            key={item.id}
                            className={styles.card}
                            initial={{ opacity: 0, y: 30, rotate: -2 }}
                            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.08,
                                type: "spring",
                                stiffness: 100
                            }}
                            whileHover={{
                                scale: 1.05,
                                rotate: Math.random() > 0.5 ? 2 : -2,
                                boxShadow: "0 0 40px rgba(255, 107, 157, 0.3)"
                            }}
                        >
                            <div className={styles.cardInner}>
                                <span className={styles.number}>#{item.id}</span>
                                <p className={styles.text}>{item.text}</p>
                                <Heart
                                    className={styles.heart}
                                    size={20}
                                    fill="currentColor"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Infinite love indicator */}
                <motion.div
                    className={styles.more}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                >
                    <Heart size={24} fill="currentColor" />
                    <p>...and a million more reasons</p>
                </motion.div>
            </main>
        </>
    );
}
