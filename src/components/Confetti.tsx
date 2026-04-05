import { useState, useEffect } from "react";

const CONFETTI_COLORS = ["#FF2D78", "#FFE000", "#00E5FF", "#00FF88", "#FF6B00", "#BF00FF", "#fff"];

export function useConfetti(active: boolean) {
  const [pieces, setPieces] = useState<{ id: number; left: number; color: string; delay: number; duration: number; size: number }[]>([]);
  useEffect(() => {
    if (!active) return;
    const arr = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      delay: Math.random() * 4,
      duration: 3 + Math.random() * 3,
      size: 8 + Math.random() * 10,
    }));
    setPieces(arr);
  }, [active]);
  return pieces;
}

export default function Confetti({ active }: { active: boolean }) {
  const pieces = useConfetti(active);
  return (
    <>
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            width: p.size,
            height: p.size * 1.4,
          }}
        />
      ))}
    </>
  );
}
