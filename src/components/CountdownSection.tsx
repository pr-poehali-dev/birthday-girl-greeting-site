import { useState, useEffect } from "react";

function useCountdown(targetDate: Date) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const next = new Date(targetDate);
      next.setFullYear(now.getFullYear());
      if (next <= now) next.setFullYear(now.getFullYear() + 1);
      const diff = next.getTime() - now.getTime();
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return time;
}

function CountdownCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-16 h-16 md:w-24 md:h-24 rounded-3xl flex items-center justify-center font-rubik font-black text-2xl md:text-4xl text-white border-2 border-white/20"
        style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}
      >
        {String(value).padStart(2, "0")}
      </div>
      <span className="mt-2 text-white/70 font-rubik text-xs uppercase tracking-widest">{label}</span>
    </div>
  );
}

export default function CountdownSection() {
  const countdown = useCountdown(new Date("2025-05-01"));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-24"
      style={{ background: "linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a1a0a 100%)" }}>
      <div className="text-center max-w-2xl w-full">
        <div className="bounce-in text-8xl mb-6">⏰</div>
        <h2 className="font-pacifico text-4xl md:text-6xl text-white mb-2">До следующего</h2>
        <h2 className="font-pacifico text-4xl md:text-6xl text-party-yellow mb-4">Дня Рождения</h2>
        <p className="text-white/50 font-rubik mb-12 text-base">Каждая секунда приближает нас к новому празднику!</p>

        <div className="flex justify-center gap-3 md:gap-6 mb-10">
          <CountdownCard value={countdown.days} label="Дней" />
          <div className="text-white/40 font-black text-3xl md:text-5xl self-center pb-6">:</div>
          <CountdownCard value={countdown.hours} label="Часов" />
          <div className="text-white/40 font-black text-3xl md:text-5xl self-center pb-6">:</div>
          <CountdownCard value={countdown.minutes} label="Минут" />
          <div className="text-white/40 font-black text-3xl md:text-5xl self-center pb-6">:</div>
          <CountdownCard value={countdown.seconds} label="Секунд" />
        </div>

        <div className="rounded-2xl overflow-hidden mb-8" style={{ background: "rgba(255,255,255,0.08)", height: 10 }}>
          <div
            className="h-full rounded-2xl transition-all duration-1000"
            style={{
              width: `${Math.max(1, 100 - (countdown.days / 365 * 100))}%`,
              background: "linear-gradient(90deg, #FF2D78, #FFE000, #00FF88)",
            }}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { emoji: "🎂", text: "Торт уже ждёт!", color: "#FF2D78" },
            { emoji: "🎁", text: "Подарки готовятся!", color: "#FFE000" },
            { emoji: "🎈", text: "Шарики надуваются!", color: "#00E5FF" },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-2xl p-4 text-center"
              style={{ background: `${item.color}18`, border: `1px solid ${item.color}40` }}
            >
              <div className="text-3xl mb-1">{item.emoji}</div>
              <p className="text-white/70 font-rubik text-xs">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}