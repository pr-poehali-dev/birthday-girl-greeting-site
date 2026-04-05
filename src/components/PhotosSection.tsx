import { useState } from "react";

const PHOTOS = [
  { url: "https://cdn.poehali.dev/files/06612636-3fb6-42d9-ac92-139d4c87fcd1.jpg", caption: "✨ Просто красотка", color: "#FF2D78" },
  { url: "https://cdn.poehali.dev/files/d57d8d9a-3e90-4aa4-8b51-c01abfdfa5d9.jpg", caption: "🦋 С бабочками", color: "#BF00FF" },
  { url: "https://cdn.poehali.dev/files/0d91ff8a-fbb3-4d3d-99b7-e717d7055623.jpg", caption: "🌸 С букетом", color: "#00FF88" },
  { url: "https://cdn.poehali.dev/files/1e102777-e53e-4175-bd9f-f823468e346e.jpg", caption: "💖 В розовом", color: "#FF6B00" },
  { url: "https://cdn.poehali.dev/files/61697d1e-ea19-47ba-a315-af4bc56f5088.jpg", caption: "🌹 С розами", color: "#FF2D78" },
];

export default function PhotosSection() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div
      className="min-h-screen px-5 py-24"
      style={{ background: "linear-gradient(135deg, #0a0a1a 0%, #0a1a2e 50%, #1a0a18 100%)" }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10 bounce-in">
          <div className="text-7xl mb-4">📸</div>
          <h2 className="font-pacifico text-4xl md:text-5xl text-white mb-3">Фото</h2>
          <p className="text-white/50 font-rubik text-base">Моменты, которые греют душу</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {PHOTOS.map((photo, i) => (
            <div
              key={i}
              className="party-card rounded-3xl overflow-hidden cursor-pointer relative group"
              style={{ border: `2px solid ${photo.color}40` }}
              onClick={() => setActive(i)}
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div
                className="absolute bottom-0 left-0 right-0 px-4 py-3 rounded-b-3xl"
                style={{ background: `linear-gradient(to top, ${photo.color}cc, transparent)` }}
              >
                <p className="text-white font-rubik font-bold text-sm">{photo.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {active !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.92)" }}
          onClick={() => setActive(null)}
        >
          <div className="relative max-w-sm w-full bounce-in" onClick={e => e.stopPropagation()}>
            <img
              src={PHOTOS[active].url}
              alt={PHOTOS[active].caption}
              className="w-full rounded-3xl shadow-2xl"
            />
            <div
              className="mt-3 text-center py-3 rounded-2xl"
              style={{ background: `${PHOTOS[active].color}22`, border: `1px solid ${PHOTOS[active].color}44` }}
            >
              <p className="text-white font-rubik font-bold">{PHOTOS[active].caption}</p>
            </div>
            <button
              onClick={() => setActive(null)}
              className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white font-black flex items-center justify-center transition-all text-lg"
            >
              ✕
            </button>
            <div className="flex justify-between mt-3 gap-2">
              <button
                onClick={() => setActive((active - 1 + PHOTOS.length) % PHOTOS.length)}
                className="flex-1 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-rubik font-bold transition-all"
              >
                ← Пред.
              </button>
              <button
                onClick={() => setActive((active + 1) % PHOTOS.length)}
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