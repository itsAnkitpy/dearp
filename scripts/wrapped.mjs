// Turns docs/chat.txt (WhatsApp export, gitignored) into content/wrapped.json.
// Output holds numbers only, never message text.
// Run: node scripts/wrapped.mjs
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import assert from "node:assert/strict";

const ME = "Ankit Sharma";
// "01/09/25, 6:47 pm - Name: text" (space before am/pm is U+202F on some phones)
const LINE = /^(\d{2})\/(\d{2})\/(\d{2}), (\d{1,2}):(\d{2})\s?(am|pm) - ([^:]+): (.*)$/;
const GOOD_MORNING = /\b(good\s*morning|gud\s*mo?rn?i?n?g|gm)\b/i;
const GOOD_NIGHT = /\b(good\s*night|gud\s*ni(ght|te)|gn)\b/i;
const LOVE_YOU = /\b(i\s*)?(love|luv)\s*(you|u|yu)\b/i;
const EMOJI = /\p{Extended_Pictographic}/gu;

export function parse(text) {
    const messages = [];
    for (const line of text.split("\n")) {
        const m = line.match(LINE);
        if (!m) {
            // Continuation of a multi-line message
            if (messages.length) messages.at(-1).text += "\n" + line;
            continue;
        }
        const [, dd, mm, yy, h, min, ampm, sender, body] = m;
        const hour = (Number(h) % 12) + (ampm === "pm" ? 12 : 0);
        messages.push({
            day: `20${yy}-${mm}-${dd}`,
            minutes: hour * 60 + Number(min),
            fromMe: sender === ME,
            text: body,
        });
    }
    return messages;
}

function topN(counts, n) {
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, n);
}

export function stats(messages) {
    const perDay = {};
    const emojis = {};
    const s = {
        total: messages.length,
        fromMe: 0,
        fromHer: 0,
        goodMorning: 0,
        goodNight: 0,
        loveYou: { me: 0, her: 0 },
        media: 0,
    };
    // Latest-night message: hours before 5am count as "after midnight"
    let latest = { day: null, minutes: -1 };

    for (const msg of messages) {
        if (msg.fromMe) s.fromMe++;
        else s.fromHer++;
        perDay[msg.day] = (perDay[msg.day] ?? 0) + 1;
        if (msg.text.includes("<Media omitted>")) s.media++;
        if (GOOD_MORNING.test(msg.text)) s.goodMorning++;
        if (GOOD_NIGHT.test(msg.text)) s.goodNight++;
        if (LOVE_YOU.test(msg.text)) s.loveYou[msg.fromMe ? "me" : "her"]++;
        for (const e of msg.text.match(EMOJI) ?? []) emojis[e] = (emojis[e] ?? 0) + 1;

        const lateness = msg.minutes < 5 * 60 ? msg.minutes + 24 * 60 : msg.minutes;
        if (lateness > latest.minutes) latest = { day: msg.day, minutes: lateness };
    }

    const days = Object.keys(perDay).sort();
    let streak = 0, best = 0;
    for (let i = 0; i < days.length; i++) {
        const gap = i && (new Date(days[i]) - new Date(days[i - 1])) / 864e5;
        streak = gap === 1 ? streak + 1 : 1;
        best = Math.max(best, streak);
    }

    const [busiestDay, busiestCount] = topN(perDay, 1)[0];
    const mins = latest.minutes % (24 * 60);
    return {
        ...s,
        firstDay: days[0],
        lastDay: days.at(-1),
        daysTalked: days.length,
        busiestDay: { day: busiestDay, messages: busiestCount },
        longestStreakDays: best,
        latestMessage: { day: latest.day, time: `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}` },
        topEmojis: topN(emojis, 5).map(([emoji, count]) => ({ emoji, count })),
    };
}

// Self-check: runs before every real run
{
    const sample = [
        "01/09/25, 11:50 pm - Ankit Sharma: Good night motu ❤️",
        "02/09/25, 1:05 am - Laadi: I love you",
        "second line of the same message 😘",
        "02/09/25, 9:00 am - Ankit Sharma: <Media omitted>",
    ].join("\n");
    const m = parse(sample);
    assert.equal(m.length, 3);
    assert.equal(m[1].text, "I love you\nsecond line of the same message 😘");
    const r = stats(m);
    assert.deepEqual([r.fromMe, r.fromHer, r.goodNight, r.media], [2, 1, 1, 1]);
    assert.deepEqual(r.loveYou, { me: 0, her: 1 });
    assert.deepEqual(r.latestMessage, { day: "2025-09-02", time: "01:05" });
    assert.equal(r.longestStreakDays, 2);
    assert.equal(r.topEmojis.length, 2);
}

if (!existsSync("docs/chat.txt")) {
    console.log("Self-check passed. No docs/chat.txt, nothing to write.");
    process.exit(0);
}

const out = "content/wrapped.json";
// Keep hand-entered stats across reruns
const manual = existsSync(out)
    ? JSON.parse(readFileSync(out, "utf8")).manual
    : { timesMet: null };
const result = { ...stats(parse(readFileSync("docs/chat.txt", "utf8"))), manual };
writeFileSync(out, JSON.stringify(result, null, 4) + "\n");
console.log(result);
