"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
import styles from "./Wrapped.module.css";

export interface WrappedStats {
    total: number;
    fromMe: number;
    fromHer: number;
    goodMorning: number;
    goodNight: number;
    loveYou: { me: number; her: number };
    media: number;
    firstDay: string;
    lastDay: string;
    daysTalked: number;
    busiestDay: { day: string; messages: number };
    longestStreakDays: number;
    latestMessage: { day: string; time: string };
    topEmojis: { emoji: string; count: number }[];
    manual: { timesMet: number | null };
}

interface Slide {
    kicker?: string;
    big: React.ReactNode;
    line: string;
    sub?: string;
    bg: string;
}

const DAY_MS = 864e5;
const fmt = (n: number) => n.toLocaleString("en-IN");
// Dates in wrapped.json are plain YYYY-MM-DD, so read and print them in UTC to avoid a day shift
const longDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const time12 = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`;
};

function CountUp({ to }: { to: number }) {
    const [value, setValue] = useState(0);
    useEffect(() => {
        const controls = animate(0, to, { duration: 1.4, ease: "easeOut", onUpdate: (v) => setValue(Math.round(v)) });
        return () => controls.stop();
    }, [to]);
    return <>{fmt(value)}</>;
}

function buildSlides(s: WrappedStats, daysTogether: number): Slide[] {
    const spanDays = Math.round((new Date(s.lastDay).getTime() - new Date(s.firstDay).getTime()) / DAY_MS) + 1;
    const slides: Slide[] = [
        {
            kicker: "1 April 2024",
            big: <CountUp to={daysTogether} />,
            line: "days ago, it all started",
            sub: "Here's our last year together, in numbers",
            bg: "linear-gradient(160deg, #2d1f3d, #ff6b9d)",
        },
        {
            kicker: `Since ${longDate(s.firstDay)}`,
            big: <CountUp to={s.total} />,
            line: "messages to each other",
            sub: `That's about ${Math.round(s.total / spanDays)} every single day`,
            bg: "linear-gradient(160deg, #1a1a2e, #a855f7)",
        },
        {
            big: (
                <span className={styles.split}>
                    <span>
                        <CountUp to={s.fromMe} />
                        <small>me</small>
                    </span>
                    <span>
                        <CountUp to={s.fromHer} />
                        <small>you</small>
                    </span>
                </span>
            ),
            line: "Okay fine, I talk more",
            bg: "linear-gradient(160deg, #3b0764, #ec4899)",
        },
        {
            big: (
                <>
                    <CountUp to={s.daysTalked} />
                    <small> / {spanDays}</small>
                </>
            ),
            line: "days we talked",
            sub: `We only went quiet on ${spanDays - s.daysTalked} days the whole year`,
            bg: "linear-gradient(160deg, #0f172a, #3b82f6)",
        },
        {
            big: <CountUp to={s.longestStreakDays} />,
            line: "days in a row, our longest streak",
            sub: "Not a single day without you",
            bg: "linear-gradient(160deg, #431407, #f97316)",
        },
        {
            big: (
                <span className={styles.split}>
                    <span>
                        <CountUp to={s.goodMorning} />
                        <small>good mornings</small>
                    </span>
                    <span>
                        <CountUp to={s.goodNight} />
                        <small>good nights</small>
                    </span>
                </span>
            ),
            line: "You're my first and last thought every day",
            bg: "linear-gradient(160deg, #1e1b4b, #fbbf24)",
        },
        {
            kicker: "\"I love you\"",
            big: (
                <span className={styles.split}>
                    <span>
                        <CountUp to={s.loveYou.me} />
                        <small>me</small>
                    </span>
                    <span>
                        <CountUp to={s.loveYou.her} />
                        <small>you</small>
                    </span>
                </span>
            ),
            line: s.loveYou.me >= s.loveYou.her ? "I'm winning this one 😌" : "You win this one 🥰",
            sub: "But who's counting... (me, obviously)",
            bg: "linear-gradient(160deg, #4c0519, #ff6b9d)",
        },
        {
            kicker: "Our favourite emojis",
            big: (
                <span className={styles.emojis}>
                    {s.topEmojis.map((e) => (
                        <span key={e.emoji}>
                            {e.emoji}
                            <small>{fmt(e.count)}</small>
                        </span>
                    ))}
                </span>
            ),
            line: "We speak fluent heart",
            bg: "linear-gradient(160deg, #2e1065, #c084fc)",
        },
        {
            kicker: longDate(s.busiestDay.day),
            big: <CountUp to={s.busiestDay.messages} />,
            line: "messages in one day, our busiest",
            sub: s.busiestDay.day.endsWith("-04-09")
                ? "Exactly two years after our first call 💞"
                : "What were we even talking about? 😂",
            bg: "linear-gradient(160deg, #052e16, #22c55e)",
        },
        {
            kicker: longDate(s.latestMessage.day),
            big: time12(s.latestMessage.time),
            line: "our latest night of talking",
            sub: "Who needs sleep anyway 🌙",
            bg: "linear-gradient(160deg, #020617, #6366f1)",
        },
        {
            big: <CountUp to={s.media} />,
            line: "photos and videos shared",
            sub: "And somehow I want more of your face",
            bg: "linear-gradient(160deg, #3f1d38, #fb7185)",
        },
    ];

    if (s.manual.timesMet) {
        slides.push({
            big: <CountUp to={s.manual.timesMet} />,
            line: "times we met this year",
            sub: "Every single one was worth the wait",
            bg: "linear-gradient(160deg, #1a1a2e, #ffd700)",
        });
    }

    slides.push({
        big: "...",
        line: "and that's just one year",
        sub: "Here's to all the ones still coming 💖",
        bg: "linear-gradient(160deg, #2d1f3d, #ff6b9d)",
    });
    return slides;
}

export default function Wrapped({
    stats,
    daysTogether,
    onNext,
}: {
    stats: WrappedStats;
    daysTogether: number;
    onNext: () => void;
}) {
    const slides = buildSlides(stats, daysTogether);
    const [index, setIndex] = useState(0);
    const slide = slides[index];

    const go = (dir: 1 | -1) => {
        if (dir === 1 && index === slides.length - 1) return onNext();
        setIndex((i) => Math.max(0, i + dir));
    };

    return (
        <motion.div className={styles.wrapped} animate={{ background: slide.bg }} transition={{ duration: 0.6 }}>
            <div className={styles.progress}>
                {slides.map((_, i) => (
                    <span key={i} className={styles.bar}>
                        <span className={styles.fill} style={{ width: i <= index ? "100%" : "0%" }} />
                    </span>
                ))}
            </div>

            {/* Tap left third to go back, anywhere else to go forward. Swipe works too. */}
            <motion.div
                className={styles.tapArea}
                // onTap (not onClick) so a swipe doesn't also count as a tap
                onTap={(_, info) => go(info.point.x < window.innerWidth / 3 ? -1 : 1)}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                    if (info.offset.x < -60) go(1);
                    else if (info.offset.x > 60) go(-1);
                }}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        className={styles.slide}
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {slide.kicker && <p className={styles.kicker}>{slide.kicker}</p>}
                        <div className={styles.big}>{slide.big}</div>
                        <p className={styles.line}>{slide.line}</p>
                        {slide.sub && <p className={styles.sub}>{slide.sub}</p>}
                    </motion.div>
                </AnimatePresence>
            </motion.div>

            <p className={styles.hint}>{index === slides.length - 1 ? "Tap to continue" : "Tap to see more"}</p>
        </motion.div>
    );
}
