import { useState } from "react";
import Confetti from "@/components/Confetti";
import CountdownSection from "@/components/CountdownSection";
import WishesSection from "@/components/WishesSection";
import GamesSection from "@/components/GamesSection";
import PhotosSection from "@/components/PhotosSection";

type Section = "home" | "countdown" | "wishes" | "games" | "photos";

const NAV_ITEMS: { id: Section; label: string; emoji: string }[] = [
  { id: "home", label: "Главная", emoji: "🎉" },
  { id: "countdown", label: "Отсчёт", emoji: "⏰" },
  { id: "wishes", label: "Пожелания", emoji: "💌" },
  { id: "photos", label: "Фото", emoji: "📸" },
  { id: "games", label: "Игры", emoji: "🎮" },
];

export default function Index() {
  const [section, setSection] = useState<Section>("home");

  return (
    <div className="min-h-screen font-rubik" style={{ background: "#0a0a1a" }}>
      <Confetti active={true} />

      {/* NAVIGATION */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div
          className="flex gap-1 p-2 rounded-[2rem]"
          style={{
            background: "rgba(20,20,40,0.85)",
            backdropFilter: "blur(20px)",
            border: "1.5px solid rgba(255,255,255,0.15)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          }}
        >
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`
                flex items-center gap-1.5 px-3 py-2.5 md:px-4 rounded-[1.5rem] transition-all duration-300 font-rubik font-medium text-sm
                ${section === item.id
                  ? "bg-party-yellow text-gray-900 font-black shadow-lg scale-105"
                  : "text-white/60 hover:text-white hover:bg-white/10"
                }
              `}
            >
              <span>{item.emoji}</span>
              <span className="hidden md:inline">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* ─── HOME ─── */}
      {section === "home" && (
        <div className="min-h-screen flex flex-col">
          <div className="relative flex-1 hero-bg flex flex-col items-center justify-center px-6 py-20 overflow-hidden text-center">
            {/* Decorative bg circles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full opacity-20 animate-spin-slow"
                style={{ background: "radial-gradient(circle, rgba(255,255,255,0.6), transparent)" }} />
              <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-15"
                style={{ background: "radial-gradient(circle, rgba(255,255,255,0.5), transparent)" }} />
            </div>

            {/* Floating emojis */}
            {["🎂", "🎁", "🎈", "⭐", "🦄", "🍭", "🎊", "✨"].map((emoji, i) => (
              <div
                key={i}
                className="absolute text-2xl md:text-4xl balloon-float pointer-events-none select-none"
                style={{
                  left: `${6 + i * 12}%`,
                  top: `${8 + (i % 4) * 20}%`,
                  animationDelay: `${i * 0.4}s`,
                  animationDuration: `${2.5 + (i % 3) * 0.5}s`,
                  opacity: 0.65,
                }}
              >
                {emoji}
              </div>
            ))}

            <div className="relative z-10">
              <div className="bounce-in mb-2">
                <span className="text-8xl md:text-9xl">🎂</span>
              </div>
              <div className="slide-up" style={{ animationDelay: "0.3s", opacity: 0 }}>
                <h1 className="font-pacifico text-5xl md:text-8xl text-white mb-2"
                  style={{ textShadow: "0 0 40px rgba(255,255,255,0.4), 0 4px 16px rgba(0,0,0,0.4)" }}>
                  С Днём
                </h1>
                <h1 className="font-pacifico text-5xl md:text-8xl text-party-yellow mb-6"
                  style={{ textShadow: "0 0 50px rgba(255,224,0,0.6), 0 4px 16px rgba(0,0,0,0.4)" }}>
                  Рождения!
                </h1>
              </div>
              <div className="slide-up" style={{ animationDelay: "0.6s", opacity: 0 }}>
                <p className="text-white/90 font-rubik text-xl md:text-2xl mb-10 max-w-lg mx-auto leading-relaxed">
                  Пусть этот день будет полон<br />
                  <span className="font-black text-party-yellow">радости, смеха и чудес!</span> ✨
                </p>
              </div>
              <div className="slide-up flex flex-col sm:flex-row gap-4 justify-center" style={{ animationDelay: "0.9s", opacity: 0 }}>
                <button
                  onClick={() => setSection("wishes")}
                  className="pulse-glow bg-white text-gray-900 font-rubik font-black px-8 py-4 rounded-2xl text-lg hover:scale-105 transition-transform"
                >
                  💌 Читать пожелания
                </button>
                <button
                  onClick={() => setSection("games")}
                  className="bg-white/20 border-2 border-white/40 text-white font-rubik font-black px-8 py-4 rounded-2xl text-lg hover:bg-white/30 hover:scale-105 transition-all"
                >
                  🎮 Играть!
                </button>
              </div>
            </div>
          </div>

          {/* Feature strip */}
          <div className="py-12 px-6" style={{ background: "#0f0f22" }}>
            <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { emoji: "🎉", title: "Поздравление", desc: "Яркое и особенное", to: "home" as Section },
                { emoji: "⏰", title: "Отсчёт", desc: "До следующего ДР", to: "countdown" as Section },
                { emoji: "💌", title: "Пожелания", desc: "От близких и друзей", to: "wishes" as Section },
                { emoji: "📸", title: "Фото", desc: "Красивые моменты", to: "photos" as Section },
                { emoji: "🎮", title: "Игры", desc: "Весело и задорно", to: "games" as Section },
              ].map((f, i) => (
                <div
                  key={i}
                  className="party-card rounded-3xl p-5 text-center cursor-pointer"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  onClick={() => setSection(f.to)}
                >
                  <div className="text-4xl mb-2">{f.emoji}</div>
                  <div className="font-rubik font-black text-white text-sm">{f.title}</div>
                  <div className="font-rubik text-white/40 text-xs mt-1">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {section === "countdown" && <CountdownSection />}
      {section === "wishes" && <WishesSection />}
      {section === "photos" && <PhotosSection />}
      {section === "games" && <GamesSection />}

      <div className="h-28" />
    </div>
  );
}
