import { useState, useEffect, useRef, useCallback } from "react";

/* ─── MEMORY GAME ─── */
const EMOJIS = ["🎂", "🎁", "🎈", "🌟", "🦄", "🍭", "🎊", "🔥"];
type Card = { id: number; emoji: string; flipped: boolean; matched: boolean };

function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [score, setScore] = useState(0);

  const init = useCallback(() => {
    const doubled = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, id) => ({ id, emoji, flipped: false, matched: false }));
    setCards(doubled);
    setSelected([]);
    setMoves(0);
    setWon(false);
    setScore(0);
  }, []);

  useEffect(() => { init(); }, [init]);

  useEffect(() => {
    if (selected.length === 2) {
      const [a, b] = selected;
      const cardA = cards[a];
      const cardB = cards[b];
      if (cardA && cardB && cardA.emoji === cardB.emoji) {
        setCards(prev => prev.map(c => c.id === a || c.id === b ? { ...c, matched: true } : c));
        setScore(s => s + 10);
        setSelected([]);
      } else {
        const t = setTimeout(() => {
          setCards(prev => prev.map(c => c.id === a || c.id === b ? { ...c, flipped: false } : c));
          setSelected([]);
        }, 900);
        return () => clearTimeout(t);
      }
      setMoves(m => m + 1);
    }
  }, [selected, cards]);

  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.matched)) setWon(true);
  }, [cards]);

  const flip = (id: number) => {
    if (selected.length === 2) return;
    const card = cards[id];
    if (!card || card.flipped || card.matched) return;
    setCards(prev => prev.map(c => c.id === id ? { ...c, flipped: true } : c));
    setSelected(prev => [...prev, id]);
  };

  return (
    <div className="text-center">
      <div className="flex justify-between items-center mb-4">
        <div className="bg-white/20 rounded-2xl px-4 py-2 text-white font-rubik font-bold">
          Ходов: {moves}
        </div>
        <div className="bg-party-yellow rounded-2xl px-4 py-2 font-rubik font-black text-gray-900">
          ⭐ {score}
        </div>
        <button
          onClick={init}
          className="bg-white/20 hover:bg-white/30 rounded-2xl px-4 py-2 text-white font-rubik font-bold transition-all"
        >
          Заново
        </button>
      </div>

      {won ? (
        <div className="bounce-in text-center py-8">
          <div className="text-6xl mb-4">🏆</div>
          <p className="font-pacifico text-3xl text-party-yellow mb-2">Победа!</p>
          <p className="text-white/80 font-rubik mb-4">Все пары найдены за {moves} ходов!</p>
          <button onClick={init} className="bg-party-yellow text-gray-900 font-rubik font-black px-8 py-3 rounded-2xl wiggle-hover">
            Играть ещё!
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto">
          {cards.map(card => (
            <button
              key={card.id}
              onClick={() => flip(card.id)}
              className={`
                aspect-square rounded-2xl text-3xl flex items-center justify-center
                transition-all duration-300 font-rubik border-2
                ${card.flipped || card.matched
                  ? "bg-white border-white scale-105 shadow-lg"
                  : "bg-white/20 border-white/30 hover:bg-white/30 hover:scale-105 cursor-pointer"
                }
                ${card.matched ? "opacity-60" : ""}
              `}
            >
              {(card.flipped || card.matched) ? card.emoji : "🎁"}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── QUIZ GAME ─── */
const QUESTIONS = [
  { q: "Что задувают на день рождения?", options: ["Торт", "Свечи", "Шарики", "Конфетти"], answer: 1 },
  { q: "Какого числа был первый полёт человека в космос?", options: ["9 марта", "12 апреля", "1 мая", "7 ноября"], answer: 1 },
  { q: "Что дарят имениннику?", options: ["Проблемы", "Подарки", "Домашнее задание", "Понедельник"], answer: 1 },
  { q: "Как называется главная песня именинника?", options: ["С Днём рождения", "Много лет", "Праздник", "Именины"], answer: 0 },
  { q: "Сколько свечей задувает именинник?", options: ["Столько, сколько хочет", "Столько, сколько лет", "Всегда 5", "Всегда 10"], answer: 1 },
];

function QuizGame() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [shake, setShake] = useState(false);

  const answer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === QUESTIONS[current].answer) {
      setScore(s => s + 1);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    setTimeout(() => {
      if (current + 1 >= QUESTIONS.length) {
        setDone(true);
      } else {
        setCurrent(c => c + 1);
        setSelected(null);
      }
    }, 1000);
  };

  const reset = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  };

  if (done) return (
    <div className="bounce-in text-center py-6">
      <div className="text-5xl mb-3">{score >= 4 ? "🏆" : score >= 2 ? "🎯" : "😅"}</div>
      <p className="font-pacifico text-2xl text-party-yellow mb-1">{score >= 4 ? "Гений!" : score >= 2 ? "Молодец!" : "Попробуй ещё!"}</p>
      <p className="text-white/80 font-rubik mb-5">{score} из {QUESTIONS.length} правильных!</p>
      <button onClick={reset} className="bg-party-yellow text-gray-900 font-rubik font-black px-8 py-3 rounded-2xl wiggle-hover">
        Ещё раз!
      </button>
    </div>
  );

  const q = QUESTIONS[current];
  return (
    <div>
      <div className="flex justify-between mb-4">
        <span className="text-white/70 font-rubik">Вопрос {current + 1}/{QUESTIONS.length}</span>
        <span className="bg-party-yellow text-gray-900 font-rubik font-black px-3 py-1 rounded-xl">⭐ {score}</span>
      </div>
      <p className={`text-white font-rubik font-bold text-lg mb-5 leading-snug ${shake ? "shake" : ""}`}>
        {q.q}
      </p>
      <div className="grid grid-cols-2 gap-3">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => answer(i)}
            className={`
              p-3 rounded-2xl font-rubik font-medium text-sm transition-all duration-300 border-2
              ${selected === null
                ? "bg-white/20 border-white/30 hover:bg-white/30 hover:scale-105 text-white"
                : i === q.answer
                  ? "bg-party-green border-party-green text-gray-900 scale-105"
                  : selected === i
                    ? "bg-party-pink border-party-pink text-white"
                    : "bg-white/10 border-white/10 text-white/50"
              }
            `}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── BALLOON POP GAME ─── */
type Balloon = { id: number; x: number; y: number; color: string; size: number; speed: number; popped: boolean };

function BalloonPop() {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [score, setBalloonScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const moveRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    setBalloons([]);
    setBalloonScore(0);
    setTimeLeft(20);
    setPlaying(true);
  };

  useEffect(() => {
    if (!playing) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setPlaying(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    spawnRef.current = setInterval(() => {
      setBalloons(prev => [
        ...prev.filter(b => b.y > -20),
        {
          id: Date.now() + Math.random(),
          x: 5 + Math.random() * 85,
          y: 110,
          color: "#FF2D78",
          size: 40 + Math.random() * 25,
          speed: 0.5 + Math.random() * 1.5,
          popped: false,
        }
      ]);
    }, 600);

    moveRef.current = setInterval(() => {
      setBalloons(prev =>
        prev
          .map(b => ({ ...b, y: b.y - b.speed }))
          .filter(b => b.y > -15 && !b.popped)
      );
    }, 50);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (spawnRef.current) clearInterval(spawnRef.current);
      if (moveRef.current) clearInterval(moveRef.current);
    };
  }, [playing]);

  const pop = (id: number) => {
    setBalloons(prev => prev.filter(b => b.id !== id));
    setBalloonScore(s => s + 1);
  };

  if (!playing && timeLeft === 0) return (
    <div className="bounce-in text-center py-6">
      <div className="text-5xl mb-3">{score >= 20 ? "🏆" : score >= 10 ? "🎯" : "🎈"}</div>
      <p className="font-pacifico text-2xl text-party-yellow mb-1">Время вышло!</p>
      <p className="text-white/80 font-rubik mb-5">Ты лопнул {score} шариков!</p>
      <button onClick={start} className="bg-party-yellow text-gray-900 font-rubik font-black px-8 py-3 rounded-2xl wiggle-hover">
        Снова!
      </button>
    </div>
  );

  if (!playing) return (
    <div className="text-center py-6">
      <div className="text-5xl mb-4">🎈</div>
      <p className="text-white font-rubik text-lg mb-2">Лопай шарики!</p>
      <p className="text-white/60 font-rubik text-sm mb-6">У тебя 20 секунд. Нажимай быстрее!</p>
      <button onClick={start} className="bg-party-yellow text-gray-900 font-rubik font-black px-8 py-3 rounded-2xl wiggle-hover text-lg">
        Начать!
      </button>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between mb-3">
        <span className="bg-party-pink text-white font-rubik font-black px-3 py-1 rounded-xl">⏱ {timeLeft}с</span>
        <span className="bg-party-yellow text-gray-900 font-rubik font-black px-3 py-1 rounded-xl">🎈 {score}</span>
      </div>
      <div
        className="relative rounded-3xl overflow-hidden bg-white/10 border-2 border-white/20 select-none"
        style={{ height: 260 }}
      >
        {balloons.map(b => (
          <button
            key={b.id}
            onClick={() => pop(b.id)}
            className="absolute cursor-pointer hover:scale-125 transition-transform"
            style={{
              left: `${b.x}%`,
              bottom: `${b.y}%`,
              fontSize: b.size,
              lineHeight: 1,
              transform: "translateX(-50%)",
              background: "none",
              border: "none",
              padding: 0,
            }}
          >
            🎈
          </button>
        ))}
        {balloons.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-white/30 font-rubik text-sm">
            Готовься...
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── GAMES SECTION ─── */
type GameId = "memory" | "quiz" | "balloon";

const GAME_TABS: { id: GameId; label: string }[] = [
  { id: "memory", label: "🃏 Память" },
  { id: "quiz", label: "🧠 Квиз" },
  { id: "balloon", label: "🎈 Шарики" },
];

const GAME_HINTS: Record<GameId, string> = {
  memory: "Найди все одинаковые пары карточек",
  quiz: "Ответь на вопросы о праздниках",
  balloon: "Лопай как можно больше шариков за 20 секунд!",
};

export default function GamesSection() {
  const [activeGame, setActiveGame] = useState<GameId>("memory");

  return (
    <div className="min-h-screen px-4 py-24"
      style={{ background: "linear-gradient(135deg, #0a0a1a 0%, #0a1a2a 50%, #1a0a2a 100%)" }}>
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8 bounce-in">
          <div className="text-7xl mb-4">🎮</div>
          <h2 className="font-pacifico text-4xl text-white mb-2">Игры</h2>
          <p className="text-white/50 font-rubik">Повеселись на полную!</p>
        </div>

        <div className="flex gap-2 mb-6 p-1.5 rounded-2xl" style={{ background: "rgba(255,255,255,0.06)" }}>
          {GAME_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveGame(tab.id)}
              className={`
                flex-1 py-2.5 rounded-xl font-rubik font-bold text-sm transition-all duration-300
                ${activeGame === tab.id
                  ? "bg-party-yellow text-gray-900 shadow-lg scale-105"
                  : "text-white/50 hover:text-white"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          className="rounded-3xl p-6"
          style={{
            background: "linear-gradient(135deg, rgba(255,45,120,0.12), rgba(0,229,255,0.12))",
            border: "1.5px solid rgba(255,255,255,0.1)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          }}
        >
          {activeGame === "memory" && <MemoryGame />}
          {activeGame === "quiz" && <QuizGame />}
          {activeGame === "balloon" && <BalloonPop />}
        </div>

        <div className="mt-4 text-center text-white/30 font-rubik text-xs">
          {GAME_HINTS[activeGame]}
        </div>
      </div>
    </div>
  );
}
