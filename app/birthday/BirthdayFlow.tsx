"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ArrowRight, Cake as CakeIcon, Mail, HelpCircle, BarChart3 } from "lucide-react";
import Confetti from "./Confetti";
import Cake from "./Cake";
import BirthdayLetter from "./BirthdayLetter";
import Quiz, { QuizQuestion } from "./Quiz";
import Wrapped, { WrappedStats } from "./Wrapped";
import styles from "./page.module.css";

interface BirthdayFlowProps {
    letterTitle: string;
    letter: string;
    voiceNote: string | null;
    quiz: QuizQuestion[];
    wrapped: WrappedStats;
    daysTogether: number;
    finale: string;
}

type Step = "cake" | "wish" | "letter" | "quiz" | "wrapped" | "finale";

// Once she reaches the finale, later visits open there instead of the cake.
// Losing this flag only means walking the steps again, so browser storage is fine.
const FINISHED_KEY = "dearp_birthday_finished";
const noSubscribe = () => () => {};
const readFinished = () => {
    try {
        return localStorage.getItem(FINISHED_KEY) === "true";
    } catch {
        return false;
    }
};

const REPLAYS: { step: Step; label: string; icon: typeof Heart }[] = [
    { step: "cake", label: "Blow the candles", icon: CakeIcon },
    { step: "letter", label: "Read my letter", icon: Mail },
    { step: "quiz", label: "Take the quiz", icon: HelpCircle },
    { step: "wrapped", label: "Our year, wrapped", icon: BarChart3 },
];

export default function BirthdayFlow({
    letterTitle,
    letter,
    voiceNote,
    quiz,
    wrapped,
    daysTogether,
    finale,
}: BirthdayFlowProps) {
    const finished = useSyncExternalStore(noSubscribe, readFinished, () => false);
    const [chosen, setChosen] = useState<Step | null>(null);
    const step = chosen ?? (finished ? "finale" : "cake");

    const show = useCallback((next: Step) => {
        if (next === "finale") {
            try {
                localStorage.setItem(FINISHED_KEY, "true");
            } catch {}
        }
        setChosen(next);
    }, []);
    const toWish = useCallback(() => show("wish"), [show]);

    return (
        <AnimatePresence mode="wait">
            {step === "cake" && (
                <motion.div key="cake" exit={{ opacity: 0, scale: 0.95 }} className={styles.step}>
                    <Cake onDone={toWish} />
                </motion.div>
            )}

            {step === "wish" && (
                <motion.div
                    key="wish"
                    className={styles.finale}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <Confetti />
                    <h1>Your wish is on its way</h1>
                    <p className={styles.subtitle}>I hope every single one comes true, my love</p>
                    <motion.button
                        className={styles.nextButton}
                        onClick={() => show("letter")}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.5 }}
                    >
                        Continue <ArrowRight size={18} />
                    </motion.button>
                </motion.div>
            )}

            {step === "letter" && (
                <motion.div key="letter" exit={{ opacity: 0, y: -20 }} className={styles.step}>
                    <BirthdayLetter
                        title={letterTitle}
                        letter={letter}
                        voiceNote={voiceNote}
                        onNext={() => show("quiz")}
                    />
                </motion.div>
            )}

            {step === "quiz" && (
                <motion.div key="quiz" exit={{ opacity: 0, y: -20 }} className={styles.step}>
                    <Quiz questions={quiz} onNext={() => show("wrapped")} />
                </motion.div>
            )}

            {step === "wrapped" && (
                <motion.div key="wrapped" exit={{ opacity: 0 }}>
                    <Wrapped stats={wrapped} daysTogether={daysTogether} onNext={() => show("finale")} />
                </motion.div>
            )}

            {step === "finale" && (
                <motion.div
                    key="finale"
                    className={styles.finale}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <h1>Happy Birthday, Priya</h1>
                    <p className={styles.subtitle}>{finale}</p>
                    <motion.span
                        className={styles.finaleHeart}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <Heart size={40} fill="currentColor" />
                    </motion.span>

                    <p className={styles.replayTitle}>Relive any part</p>
                    <div className={styles.replays}>
                        {REPLAYS.map(({ step: target, label, icon: Icon }) => (
                            <button key={target} className={styles.replay} onClick={() => show(target)}>
                                <Icon size={18} />
                                {label}
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
