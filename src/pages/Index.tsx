import { useState } from "react";
import Confetti from "@/components/Confetti";
import CountdownSection from "@/components/CountdownSection";
import WishesSection from "@/components/WishesSection";
import GamesSection from "@/components/GamesSection";

type Section = "home" | "countdown" | "wishes" | "games";

const NAV_ITEMS: { id: Section; label: string; emoji: string }[] = [
  { id: "home", label: "Главная", emoji: "🎉" },
  { id: "countdown", label: "Отсчёт", emoji: "⏰" },
  { id: "wishes", label: "Пожелания", emoji: "💌" },
  { id: "games", label: "Игры", emoji: "🎮" },
];

const PHOTOS = [
  { url: "https://cdn.poehali.dev/files/06612636-3fb6-42d9-ac92-139d4c87fcd1.jpg", caption: "✨ Просто красотка", color: "#FF2D78" },
  { url: "https://cdn.poehali.dev/files/d57d8d9a-3e90-4aa4-8b51-c01abfdfa5d9.jpg", caption: "🦋 С бабочками", color: "#BF00FF" },
  { url: "https://cdn.poehali.dev/files/0d91ff8a-fbb3-4d3d-99b7-e717d7055623.jpg", caption: "🌸 С букетом", color: "#00FF88" },
  { url: "https://cdn.poehali.dev/files/1e102777-e53e-4175-bd9f-f823468e346e.jpg", caption: "💖 В розовом", color: "#FF6B00" },
  { url: "https://cdn.poehali.dev/files/61697d1e-ea19-47ba-a315-af4bc56f5088.jpg", caption: "🌹 С розами", color: "#FF2D78" },
];

export default function Index() {
  const [section, setSection] = useState<Section>("home");
  const [lightbox, setLightbox] = useState<number | null>(null);

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
                flex items-center gap-1.5 px-3 py-2.5 md:px-5 rounded-[1.5rem] transition-all duration-300 font-rubik font-medium text-sm
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
          {/* HERO */}
          <div className="relative flex-1 hero-bg flex flex-col items-center justify-center px-6 py-20 overflow-hidden text-center">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full opacity-20 animate-spin-slow"
                style={{ background: "radial-gradient(circle, rgba(255,255,255,0.6), transparent)" }} />
              <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-15"
                style={{ background: "radial-gradient(circle, rgba(255,255,255,0.5), transparent)" }} />
            </div>

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

          {/* PHOTO GALLERY */}
          <div className="py-14 px-6" style={{ background: "#0f0f22" }}>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="font-pacifico text-3xl md:text-4xl text-white mb-2">📸 Фото</h2>
                <p className="text-white/40 font-rubik text-sm">Нажми, чтобы открыть</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {PHOTOS.map((photo, i) => (
                  <div
                    key={i}
                    className="party-card rounded-3xl overflow-hidden cursor-pointer relative group"
                    style={{ border: `2px solid ${photo.color}40` }}
                    onClick={() => setLightbox(i)}
                  >
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div
                      className="absolute bottom-0 left-0 right-0 px-3 py-2 rounded-b-3xl"
                      style={{ background: `linear-gradient(to top, ${photo.color}cc, transparent)` }}
                    >
                      <p className="text-white font-rubik font-bold text-xs md:text-sm">{photo.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FEATURE STRIP */}
          <div className="py-10 px-6" style={{ background: "#0a0a1a" }}>
            <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { emoji: "⏰", title: "Отсчёт", desc: "До следующего ДР", to: "countdown" as Section },
                { emoji: "💌", title: "Пожелания", desc: "От близких и друзей", to: "wishes" as Section },
                { emoji: "🎮", title: "Игры", desc: "Весело и задорно", to: "games" as Section },
                { emoji: "🎊", title: "Конфетти", desc: "Праздник уже здесь!", to: "home" as Section },
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
      {section === "games" && <GamesSection />}

      <div className="h-28" />

      {/* LIGHTBOX */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.92)" }}
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-sm w-full bounce-in" onClick={e => e.stopPropagation()}>
            <img
              src={PHOTOS[lightbox].url}
              alt={PHOTOS[lightbox].caption}
              className="w-full rounded-3xl shadow-2xl"
            />
            <div
              className="mt-3 text-center py-3 rounded-2xl"
              style={{ background: `${PHOTOS[lightbox].color}22`, border: `1px solid ${PHOTOS[lightbox].color}44` }}
            >
              <p className="text-white font-rubik font-bold">{PHOTOS[lightbox].caption}</p>
            </div>
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white font-black flex items-center justify-center transition-all text-lg"
            >
              ✕
            </button>
            <div className="flex justify-between mt-3 gap-2">
              <button
                onClick={() => setLightbox((lightbox - 1 + PHOTOS.length) % PHOTOS.length)}
                className="flex-1 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-rubik font-bold transition-all"
              >
                ← Пред.
              </button>
              <button
                onClick={() => setLightbox((lightbox + 1) % PHOTOS.length)}
                className="flex-1 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-rubik font-bold transition-all"
              >
                След. →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
