"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageProvider";

// Start of professional software development: 11/10/2022 08:00 (local time).
const START = new Date(2022, 9, 11, 8, 0, 0);

const pad = (n: number) => String(n).padStart(2, "0");

function elapsed(now: Date) {
  if (now < START) return { years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  let years = now.getFullYear() - START.getFullYear();
  let anniversary = new Date(START);
  anniversary.setFullYear(START.getFullYear() + years);
  if (anniversary > now) {
    years--;
    anniversary = new Date(START);
    anniversary.setFullYear(START.getFullYear() + years);
  }
  const rest = now.getTime() - anniversary.getTime();
  return {
    years,
    days: Math.floor(rest / 86_400_000),
    hours: Math.floor((rest % 86_400_000) / 3_600_000),
    minutes: Math.floor((rest % 3_600_000) / 60_000),
    seconds: Math.floor((rest % 60_000) / 1000),
  };
}

export function ExperienceCounter() {
  const { lang } = useLanguage();
  // null until mounted, so the static HTML doesn't bake in a build-time value.
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    let timer: number;
    const loop = () => {
      setNow(new Date());
      timer = window.setTimeout(loop, 1000 - (Date.now() % 1000));
    };
    loop();
    const onVisible = () => !document.hidden && setNow(new Date());
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const fr = lang === "fr";
  let main = "—";
  let clock = "loading…";
  if (now) {
    const { years, days, hours, minutes, seconds } = elapsed(now);
    main = fr ? `${years}a ${days}j` : `${years}y ${days}d`;
    clock = `${pad(hours)}:${pad(minutes)}:${pad(seconds)} · ${
      fr ? "depuis le 11/10/2022" : "since 11/10/2022"
    }`;
  }

  return (
    <div className="metric metric-live">
      <strong id="exp-elapsed">{main}</strong>
      <span id="exp-clock">{clock}</span>
    </div>
  );
}
