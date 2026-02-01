"use client";

import { motion } from "framer-motion";
import { Calendar, Heart } from "lucide-react";
import Navigation from "../components/Navigation";
import timelineData from "../../content/timeline.json";
import styles from "./page.module.css";

export default function TimelinePage() {
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
                        Our Story
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Every moment with you is a treasure
                    </motion.p>
                </div>

                <div className={styles.timeline}>
                    {/* Timeline line */}
                    <div className={styles.line}></div>

                    {timelineData.map((item, index) => (
                        <motion.div
                            key={item.id}
                            className={`${styles.item} ${index % 2 === 0 ? styles.left : styles.right}`}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            {/* Timeline dot */}
                            <div className={styles.dot}>
                                <Heart size={16} fill="currentColor" />
                            </div>

                            {/* Card */}
                            <div className={styles.card}>
                                <div className={styles.date}>
                                    <Calendar size={14} />
                                    <span>{item.date}</span>
                                </div>
                                <h3 className={styles.title}>{item.title}</h3>
                                <p className={styles.description}>{item.description}</p>
                                {item.image && (
                                    <div className={styles.imageWrapper}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={item.image} alt={item.title} className={styles.image} />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* End marker */}
                <motion.div
                    className={styles.endMarker}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, type: "spring" }}
                >
                    <Heart size={32} fill="currentColor" />
                    <p>And our story continues...</p>
                </motion.div>
            </main>
        </>
    );
}
