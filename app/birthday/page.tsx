import Navigation from "../components/Navigation";
import birthday from "../../content/birthday.json";
import quiz from "../../content/quiz.json";
import wrapped from "../../content/wrapped.json";
import Countdown from "./Countdown";
import BirthdayFlow from "./BirthdayFlow";
import styles from "./page.module.css";

// Check the time on every request, never at build time
export const dynamic = "force-dynamic";

// Runs per request on the server (force-dynamic), so reading the clock here is intended
function isUnlocked(unlockAt: string) {
    return Date.now() >= new Date(unlockAt).getTime();
}

// Days since we started talking, counted in India time
function daysTogether() {
    return Math.floor((Date.now() - new Date("2024-04-01T00:00:00+05:30").getTime()) / 864e5);
}

export default function BirthdayPage() {
    // Env override lets us preview locally: set it to a past or near-future time
    const unlockAt = process.env.BIRTHDAY_UNLOCK_AT ?? birthday.unlockAt;
    const unlocked = isUnlocked(unlockAt);

    return (
        <>
            <Navigation />
            <main className={styles.page}>
                {/* Birthday content is only sent to the browser after unlock */}
                {unlocked ? (
                    <BirthdayFlow
                        letterTitle={birthday.letterTitle}
                        letter={birthday.letter}
                        voiceNote={birthday.voiceNote}
                        quiz={quiz}
                        wrapped={wrapped}
                        daysTogether={daysTogether()}
                        finale={birthday.finale}
                    />
                ) : (
                    <Countdown target={unlockAt} />
                )}
            </main>
        </>
    );
}
