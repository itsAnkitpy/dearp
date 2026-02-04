"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Navigation from "../components/Navigation";
import galleryData from "../../content/gallery.json";
import styles from "./page.module.css";

export default function GalleryPage() {
    const [selectedImage, setSelectedImage] = useState<typeof galleryData[0] | null>(null);

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
                        Our Memories
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Every photo holds a thousand feelings
                    </motion.p>
                </div>

                <div className={styles.gallery}>
                    {galleryData.map((item, index) => (
                        <motion.div
                            key={item.id}
                            className={styles.item}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            onClick={() => setSelectedImage(item)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={item.src}
                                alt={item.alt}
                                className={styles.image}
                            />

                            <div className={styles.overlay}>
                                <p className={styles.caption}>{item.caption}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Lightbox */}
                <AnimatePresence>
                    {selectedImage && (
                        <motion.div
                            className={styles.lightbox}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedImage(null)}
                        >
                            <button
                                className={styles.closeButton}
                                onClick={() => setSelectedImage(null)}
                                aria-label="Close lightbox"
                            >
                                <X size={24} />
                            </button>

                            <motion.div
                                className={styles.lightboxContent}
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={selectedImage.src}
                                    alt={selectedImage.alt}
                                    className={styles.lightboxImage}
                                />
                                <p className={styles.lightboxCaption}>{selectedImage.caption}</p>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.p
                    className={styles.hint}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    💝 Replace placeholders with your actual photos in /public/images
                </motion.p>
            </main>
        </>
    );
}
