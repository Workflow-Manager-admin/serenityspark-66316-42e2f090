// DailyQuote: shows daily quote and theme controls, and now renders VoiceNarration below the quote.
import React, { useEffect, useState, useRef } from "react";
import { quotesDataset, quoteThemes, getQuotesByTheme } from "../utils/quotes";
import VoiceNarration from "./VoiceNarration";
// PUBLIC_INTERFACE
/**
 * DailyQuote Component
 * - Displays a daily motivational/spiritual quote based on selected theme.
 * - Supports animated transitions and offline local quote source.
 * - Provides a theme selector (dropdown or tabs).
 */
function DailyQuote() {
  const [theme, setTheme] = useState("all");
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [quotes, setQuotes] = useState(getQuotesByTheme("all"));
  const [fade, setFade] = useState(true);
  const themeSelectRef = useRef();

  // Rebuild quotes when theme changes
  useEffect(() => {
    setFade(false);
    setTimeout(() => {
      setQuotes(getQuotesByTheme(theme));
      setQuoteIdx(0);
      setFade(true);
    }, 230); // Syncs with fade-out
  }, [theme]);

  // Fade in/out controller for next quote
  const showNextQuote = () => {
    setFade(false);
    setTimeout(() => {
      setQuoteIdx(idx => (idx + 1) % quotes.length);
      setFade(true);
    }, 230);
  };

  // Re-fade-in when quotes reload (if dataset changes)
  useEffect(() => {
    setFade(true);
  }, [quotes]);

  const currentQuote = quotes[quoteIdx] || {
    text: "Take a deep breath and let serenity guide you.",
    author: "SerenitySpark",
  };

  // Accessible: focus on select when just rendered/focused
  useEffect(() => {
    if (themeSelectRef.current) {
      themeSelectRef.current.blur();
    }
  }, [theme]);

  return (
    <section
      className="daily-quote-section"
      style={{
        background: "var(--secondary)",
        borderRadius: "var(--border-radius)",
        boxShadow: "0 1px 16px var(--shadow-color)",
        padding: "30px 20px 18px 20px",
        margin: "0 auto 1.5rem auto",
        maxWidth: 440,
        transition: "background var(--transition), box-shadow var(--transition)"
      }}
    >
      {/* Quote text + author */}
      <div
        className={`quote-fade${fade ? " visible" : ""}`}
        aria-live="polite"
        style={{
          transition: "opacity 0.23s cubic-bezier(.76,0,.24,1)",
          opacity: fade ? 1 : 0.06
        }}
      >
        <div
          className="quote-text"
          style={{
            fontSize: "1.35rem",
            fontWeight: 600,
            color: "var(--text-color)",
            lineHeight: 1.45,
            marginBottom: 13,
            minHeight: 52,
            textAlign: "center",
          }}
        >
          “{currentQuote.text}”
        </div>
        <div
          className="quote-author"
          style={{
            fontSize: "1.01rem",
            color: "var(--muted-text)",
            fontWeight: 500,
            marginBottom: 10,
            textAlign: "center",
          }}
        >
          — {currentQuote.author}
        </div>
        {/* Voice Narration: calm, cohesive, minimalist. Accessible, gently spaced below quote */}
        <div
          style={{
            margin: "16px auto 0 auto",
            padding: 0,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transition: "margin 0.3s"
          }}
        >
          <VoiceNarration quote={currentQuote.text} />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginTop: 18,
          justifyContent: "space-between"
        }}
      >
        {/* Theme Selector Dropdown */}
        <label htmlFor="theme-selector" style={{ fontSize: 15, color: "var(--muted-text)" }}>
          Theme:
        </label>
        <select
          id="theme-selector"
          ref={themeSelectRef}
          value={theme}
          onChange={e => setTheme(e.target.value)}
          className="quote-theme-dropdown"
          style={{
            border: "1px solid #ddd",
            borderRadius: 99,
            padding: "7px 14px",
            fontSize: 15,
            minWidth: 105,
            background: "#fff"
          }}
        >
          {quoteThemes.map(opt => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
        <button
          className="btn"
          style={{
            padding: "8px 20px",
            borderRadius: 24,
            fontSize: "1rem",
            fontWeight: 600,
            marginLeft: "auto"
          }}
          onClick={showNextQuote}
          tabIndex={0}
          aria-label="Show next quote"
          disabled={quotes.length <= 1}
        >
          Next
        </button>
      </div>
    </section>
  );
}

export default DailyQuote;
