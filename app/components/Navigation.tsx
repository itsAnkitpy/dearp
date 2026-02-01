"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Menu, X, Home, BookOpen, Image, Mail, Sparkles, Star, MapPin } from "lucide-react";
import styles from "./Navigation.module.css";

const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/timeline", label: "Our Story", icon: BookOpen },
    { href: "/gallery", label: "Memories", icon: Image },
    { href: "/letters", label: "Letters", icon: Mail },
    { href: "/loves", label: "I Love You", icon: Star },
    { href: "/distance", label: "Distance", icon: MapPin },
    { href: "/valentine", label: "Valentine's", icon: Sparkles },
];

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    return (
        <>
            {/* Desktop Navigation */}
            <nav className={styles.nav}>
                <Link href="/" className={styles.logo}>
                    <Heart size={24} />
                    <span>dearP</span>
                </Link>

                <div className={styles.links}>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${styles.link} ${isActive ? styles.active : ""}`}
                            >
                                <Icon size={16} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>

                <button
                    className={styles.menuButton}
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={styles.mobileMenu}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {navItems.map((item, index) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <motion.div
                                    key={item.href}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Link
                                        href={item.href}
                                        className={`${styles.mobileLink} ${isActive ? styles.active : ""}`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <Icon size={20} />
                                        <span>{item.label}</span>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
