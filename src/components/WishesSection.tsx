import { useState } from "react";
import Icon from "@/components/ui/icon";

const WISHES = [
  { from: "Друзья", text: "Ты самый классный! Желаем приключений, смеха и незабываемых моментов!", emoji: "🚀", color: "#00E5FF" },
  { from: "Коллеги", text: "Поздравляем! Ты звезда нашей команды. Пусть всё задуманное получится!", emoji: "🎯", color: "#FFE000" },
  { from: "От создателя сайта", text: "Пусть у тебя всегда будет один человек, которому можно позвонить среди ночи и услышать: Я рядом", emoji: "💻", color: "#FF2D78" },
];

export default function WishesSection() {
  const [showWish, setShowWish] = useState<number | null>(null);

  return (
    <div className="min-h-screen px-5 py-24"
      style={{ background: "linear-gradient(135deg, #0a0a1a 0%, #2a0a18 50%, #0a0a2a 100%)" }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10 bounce-in">
          <div className="text-7xl mb-4">💌</div>
          <h2 className="font-pacifico text-4xl md:text-5xl text-white mb-3">Пожелания</h2>
          <p className="text-white/50 font-rubik text-base">Самые тёплые слова для тебя</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {WISHES.map((w, i) => (
            <div
              key={i}
              className="party-card rounded-3xl p-6 cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${w.color}1a, ${w.color}0a)`,
                border: `2px solid ${w.color}40`,
              }}
              onClick={() => setShowWish(showWish === i ? null : i)}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="text-4xl">{w.emoji}</div>
                <div>
                  <p className="font-rubik font-black text-white text-lg">{w.from}</p>
                  <p style={{ color: w.color }} className="font-rubik text-xs font-medium">Личное пожелание</p>
                </div>
                <div className="ml-auto text-white/30">
                  <Icon name={showWish === i ? "ChevronUp" : "ChevronDown"} size={18} />
                </div>
              </div>
              <div className={`overflow-hidden transition-all duration-400 ${showWish === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                <p className="text-white/75 font-rubik text-sm leading-relaxed border-t border-white/10 pt-3">
                  {w.text}
                </p>
              </div>
              {showWish !== i && (
                <p className="text-white/30 font-rubik text-xs">Нажми, чтобы открыть ♥</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <div
            className="inline-block rounded-3xl px-8 py-6"
            style={{ background: "rgba(255,224,0,0.08)", border: "2px solid rgba(255,224,0,0.25)" }}
          >
            <p className="font-pacifico text-2xl text-party-yellow mb-1">Мы любим тебя! 💛</p>
            <p className="text-white/50 font-rubik text-sm">Пусть каждое из этих пожеланий сбудется!</p>
          </div>
        </div>
      </div>
    </div>
  );
}