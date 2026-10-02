"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import styles from "./Quiz.module.css";
import pageStyles from "./page.module.css";

export interface QuizQuestion {
    question: string;
    options: string[];
    answer: number;
    wrongReply: string;
    rightReply: string;
}

function scoreMessage(score: number, total: number) {
    if (score === total) return "Perfect score! You know us better than anyone 🥇";
    if (score >= total * 0.75) return "Wow, you really pay attention to us 🥰";
    if (score >= total * 0.5) return "Not bad at all, my love 😘";
    return "Okay, we're making more memories so you study harder 😂";
}

export default function Quiz({ questions, onNext }: { questions: QuizQuestion[]; onNext: () => void }) {
    const [index, setIndex] = useState(0);
    const [wrongPicks, setWrongPicks] = useState<number[]>([]);
    const [solved, setSolved] = useState(false);
    const [score, setScore] = useState(0);
    const done = index >= questions.length;
    const q = questions[index];

    const pick = (i: number) => {
        if (solved || wrongPicks.includes(i)) return;
        if (i === q.answer) {
            setSolved(true);
            if (wrongPicks.length === 0) setScore((s) => s + 1);
        } else {
            setWrongPicks((w) => [...w, i]);
        }
    };

    const next = () => {
        setIndex((i) => i + 1);
        setWrongPicks([]);
        setSolved(false);
    };

    if (done) {
        return (
            <motion.div className={styles.quiz} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <p className={styles.kicker}>How well do you know us?</p>
                <h2 className={styles.result}>
                    {score} / {questions.length}
                </h2>
                <p className={styles.resultLabel}>right on the first try</p>
                <p className={pageStyles.subtitle}>{scoreMessage(score, questions.length)}</p>
                <button className={pageStyles.nextButton} onClick={onNext}>
                    Continue <ArrowRight size={18} />
                </button>
            </motion.div>
        );
    }

    const lastWrong = wrongPicks.at(-1);

    return (
        <div className={styles.quiz}>
            <p className={styles.kicker}>How well do you know us?</p>
            <div className={styles.dots}>
                {questions.map((_, i) => (
                    <span key={i} className={`${styles.dot} ${i < index ? styles.dotDone : ""} ${i === index ? styles.dotNow : ""}`} />
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.3 }}
                >
                    <h2 className={styles.question}>{q.question}</h2>

                    <div className={styles.options}>
                        {q.options.map((option, i) => {
                            const isWrong = wrongPicks.includes(i);
                            const isRight = solved && i === q.answer;
                            return (
                                <motion.button
                                    key={i}
                                    className={`${styles.option} ${isWrong ? styles.wrong : ""} ${isRight ? styles.right : ""}`}
                                    onClick={() => pick(i)}
                                    disabled={isWrong || solved}
                                    animate={isWrong && i === lastWrong ? { x: [0, -10, 10, -8, 8, 0] } : {}}
                                    transition={{ duration: 0.4 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    {option}
                                </motion.button>
                            );
                        })}
                    </div>

                    <AnimatePresence mode="wait">
                        {(solved || lastWrong !== undefined) && (
                            <motion.p
                                key={solved ? "right" : `wrong-${lastWrong}`}
                                className={`${styles.reply} ${solved ? styles.replyRight : ""}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                            >
                                {solved ? q.rightReply : q.wrongReply}
                            </motion.p>
                        )}
                    </AnimatePresence>

                    {solved && (
                        <motion.button
                            className={pageStyles.nextButton}
                            onClick={next}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            {index === questions.length - 1 ? "See my score" : "Next"} <ArrowRight size={18} />
                        </motion.button>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
