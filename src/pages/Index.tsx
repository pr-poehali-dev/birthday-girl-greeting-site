import { useState, useEffect, useRef, useCallback } from "react";
import Icon from "@/components/ui/icon";

/* ─── CONFETTI ─── */
const CONFETTI_COLORS = ["#FF2D78", "#FFE000", "#00E5FF", "#00FF88", "#FF6B00", "#BF00FF", "#fff"];

function useConfetti(active: boolean) {
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

/* ─── COUNTDOWN ─── */
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

/* ─── NAVIGATION ─── */
type Section = "home" | "countdown" | "wishes" | "games";

const NAV_ITEMS: { id: Section; label: string; emoji: string }[] = [
  { id: "home", label: "Главная", emoji: "🎉" },
  { id: "countdown", label: "Отсчёт", emoji: "⏰" },
  { id: "wishes", label: "Пожелания", emoji: "💌" },
  { id: "games", label: "Игры", emoji: "🎮" },
];

/* ─── WISHES DATA ─── */
const WISHES = [
  { from: "Друзья", text: "Ты самый классный! Желаем приключений, смеха и незабываемых моментов!", emoji: "🚀", color: "#00E5FF" },
  { from: "Коллеги", text: "Поздравляем! Ты звезда нашей команды. Пусть всё задуманное получится!", emoji: "🎯", color: "#FFE000" },
];

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

/* ─── MAIN PAGE ─── */
export default function Index() {
  const [section, setSection] = useState<Section>("home");
  const [activeGame, setActiveGame] = useState<"memory" | "quiz" | "balloon">("memory");
  const [showWish, setShowWish] = useState<number | null>(null);
  const confetti = useConfetti(true);
  const countdown = useCountdown(new Date("2025-04-15"));

  const CountdownCard = ({ value, label }: { value: number; label: string }) => (
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

  return (
    <div className="min-h-screen font-rubik" style={{ background: "#0a0a1a" }}>
      {/* CONFETTI */}
      {confetti.map(p => (
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
            <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { emoji: "🎉", title: "Поздравление", desc: "Яркое и особенное", to: "home" as Section },
                { emoji: "⏰", title: "Обратный отсчёт", desc: "До следующего ДР", to: "countdown" as Section },
                { emoji: "💌", title: "6 пожеланий", desc: "От близких и друзей", to: "wishes" as Section },
                { emoji: "🎮", title: "3 игры", desc: "Весело и задорно", to: "games" as Section },
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

      {/* ─── COUNTDOWN ─── */}
      {section === "countdown" && (
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
      )}

      {/* ─── WISHES ─── */}
      {section === "wishes" && (
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
      )}

      {/* ─── GAMES ─── */}
      {section === "games" && (
        <div className="min-h-screen px-4 py-24"
          style={{ background: "linear-gradient(135deg, #0a0a1a 0%, #0a1a2a 50%, #1a0a2a 100%)" }}>
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-8 bounce-in">
              <div className="text-7xl mb-4">🎮</div>
              <h2 className="font-pacifico text-4xl text-white mb-2">Игры</h2>
              <p className="text-white/50 font-rubik">Повеселись на полную!</p>
            </div>

            <div className="flex gap-2 mb-6 p-1.5 rounded-2xl" style={{ background: "rgba(255,255,255,0.06)" }}>
              {([
                { id: "memory", label: "🃏 Память" },
                { id: "quiz", label: "🧠 Квиз" },
                { id: "balloon", label: "🎈 Шарики" },
              ] as { id: "memory" | "quiz" | "balloon"; label: string }[]).map(tab => (
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
              {activeGame === "memory" && "Найди все одинаковые пары карточек"}
              {activeGame === "quiz" && "Ответь на вопросы о праздниках"}
              {activeGame === "balloon" && "Лопай как можно больше шариков за 20 секунд!"}
            </div>
          </div>
        </div>
      )}

      <div className="h-28" />
    </div>
  );
}