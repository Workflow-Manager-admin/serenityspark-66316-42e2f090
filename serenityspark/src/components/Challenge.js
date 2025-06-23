import React, { useState, useMemo } from "react";

// PUBLIC_INTERFACE
/**
 * Challenge (Word Scramble) Component
 * - Presents a minimalist, calming UI for a simple word scramble game.
 * - User must correctly unscramble the word to complete the challenge.
 * - Calls `onComplete()` when solved.
 */
function Challenge({ onComplete }) {
  // A small set of inspirational and quote-related words for scrambling
  const words = useMemo(() => [
    "serenity",
    "gratitude",
    "mindfulness",
    "kindness",
    "calmness",
    "reflection",
    "spark",
    "peaceful",
    "motivation"
  ], []);

  // Picks today's word based on day to ensure consistency per day
  const todayIndex = useMemo(() => {
    // One word per day, cycling
    const d = new Date();
    return (d.getFullYear() * 1000 + d.getMonth() * 50 + d.getDate()) % words.length;
  }, [words.length]);

  const [input, setInput] = useState("");
  const [solved, setSolved] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const word = words[todayIndex];
  const scrambled = useMemo(() => {
    // Shuffle using Fisher-Yates, avoid unscrambled match
    let arr = word.split("");
    do {
      arr = word.split("");
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    } while (arr.join("") === word);
    return arr.join("");
    // eslint-disable-next-line
  }, [word]);

  function handleInput(e) {
    setInput(e.target.value);
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (input.trim().toLowerCase() === word) {
      setSolved(true);
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        if (onComplete) onComplete();
      }, 1400); // brief celebration animation
    }
  }

  // Minimal confetti animation (emoji sprinkle)
  function Celebration() {
    return (
      <div
        aria-label="Celebration"
        style={{
          position: "absolute",
          left: 0, top: 0, width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "3rem",
          animation: "popAndFade 1.3s cubic-bezier(.44,1.55,.58,1) both"
        }}
      >
        <span role="img" aria-label="sparkles">✨ 🎉 ✨</span>
        <style>{`
        @keyframes popAndFade {
          0% { opacity:0; transform: scale(0.7) translateY(32px);}
          44% { opacity:1; transform: scale(1.12) translateY(-8px);}
          94% { opacity:1; }
          100% { opacity:0; transform: scale(0.92) translateY(-20px);}
        }
        `}</style>
      </div>
    );
  }

  return (
    <section
      className="challenge-section"
      aria-label="Word Scramble Challenge"
      style={{
        background: "var(--secondary)",
        borderRadius: "var(--border-radius)",
        boxShadow: "0 1px 16px var(--shadow-color)",
        padding: "32px 14px 26px 14px",
        margin: "0 auto 1.5rem auto",
        maxWidth: 440,
        position: "relative",
        textAlign: "center",
        transition: "background var(--transition), box-shadow var(--transition)"
      }}
    >
      {showCelebration && <Celebration />}
      <div
        className="subtitle"
        style={{
          marginBottom: 18,
          background: "rgba(60,160,90,0.06)",
          color: "var(--accent)",
        }}
      >
        Unlock today’s quote
      </div>
      <div
        style={{
          fontSize: "1.1rem",
          marginBottom: 7,
          color: "var(--muted-text)",
          letterSpacing: 0.03,
        }}>
        Unscramble the word:
      </div>
      <div
        style={{
          letterSpacing: "0.16em",
          fontSize: "1.75rem",
          fontWeight: 700,
          display: "inline-block",
          marginBottom: 18,
          color: "var(--text-color)",
          background: "rgba(220,233,218,0.56)",
          borderRadius: 18,
          padding: "6px 22px"
        }}>
        {scrambled.split("").join(" ")}
      </div>
      <form
        autoComplete="off"
        style={{
          display: "flex",
          gap: 10,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 16,
          flexWrap: "wrap"
        }}
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          autoFocus
          maxLength={14}
          aria-label="Type unscrambled word"
          value={input}
          onChange={handleInput}
          disabled={solved}
          tabIndex={0}
          style={{
            fontSize: "1.13rem",
            padding: "8px 16px",
            border: "1.5px solid #cce1cf",
            borderRadius: 12,
            outline: "none",
            background: "#f7fff8",
            letterSpacing: "0.06em"
          }}
        />
        <button
          type="submit"
          className="btn"
          style={{
            fontSize: "1.07rem",
            padding: "8px 24px",
            borderRadius: 22,
            background: "var(--primary)",
            color: "#155b30",
            fontWeight: 600
          }}
          disabled={solved}
        >
          Submit
        </button>
      </form>
      {solved && !showCelebration &&
        <div style={{
          color: "var(--primary)",
          marginTop: 19,
          fontWeight: 500,
          fontSize: "1.12rem",
          letterSpacing: 0.03
        }}>
          Challenge complete! Quote unlocked.
        </div>
      }
    </section>
  );
}

export default Challenge;
