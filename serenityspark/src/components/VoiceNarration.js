import React, { useEffect, useRef, useState } from "react";

/**
 * VoiceNarration Component
 * - Narrates the given quote text using Web Speech API (where available).
 * - Provides play/pause controls, allows user to select among voices.
 * - Optionally overlays calming ambient sound (toggleable).
 * - Minimalist styling matching SerenitySpark app theme.
 * - Gracefully degrades if speech synthesis not supported.
 *
 * Props:
 *   - quote (string): The quote text to narrate.
 */

const CALMING_SOUND_URL =
  "https://cdn.pixabay.com/audio/2022/02/23/audio_115b9c8524.mp3"; // Public domain calming track

// PUBLIC_INTERFACE
function VoiceNarration({ quote }) {
  // Browser Speech Synthesis support detection
  const synthSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  // State vars
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [canResume, setCanResume] = useState(false);
  const [speechError, setSpeechError] = useState("");
  const utterRef = useRef(null);

  // Calming sound
  const [ambientOn, setAmbientOn] = useState(false);
  const calmAudioRef = useRef(null);

  // Load voices on mount & when browser loads them
  useEffect(() => {
    if (!synthSupported) return;
    function handleVoices() {
      const v = window.speechSynthesis.getVoices();
      setVoices(v.filter(voice =>
        voice.lang.startsWith("en") || voice.default || /Serenity|Calm|Soft/i.test(voice.name)
      ));
      if (v.length > 0 && !selectedVoice) {
        setSelectedVoice(v.find(x => x.default)?.voiceURI || v[0].voiceURI || "");
      }
    }
    handleVoices();
    window.speechSynthesis.onvoiceschanged = handleVoices;
    // Clean up
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
    // eslint-disable-next-line
  }, []);

  // Stop narration when unmounting or quote changes
  useEffect(() => {
    return () => {
      stopNarration();
      if (calmAudioRef.current) {
        calmAudioRef.current.pause();
        calmAudioRef.current = null;
      }
    };
    // eslint-disable-next-line
  }, []);

  // Automatically stop speech if quote changes
  useEffect(() => {
    stopNarration(); // Stop if text changes; auto-reset state
    // eslint-disable-next-line
  }, [quote]);

  // Voice picker changes
  function handleVoiceChange(e) {
    setSelectedVoice(e.target.value);
    stopNarration();
  }

  // Play/pause/stop handlers
  function playNarration() {
    if (!synthSupported) return;
    stopNarration(false);
    setSpeechError("");
    const utter = new window.SpeechSynthesisUtterance(quote);
    const chosen =
      voices.find(v => v.voiceURI === selectedVoice) ||
      window.speechSynthesis.getVoices().find(v => v.default) ||
      window.speechSynthesis.getVoices()[0];
    if (chosen) utter.voice = chosen;
    utter.rate = 0.94;
    utter.pitch = 1.0;
    utter.volume = 1.0;
    utter.onstart = () => {
      setSpeaking(true);
      setPaused(false);
      setCanResume(false);
    };
    utter.onpause = () => { setPaused(true); setCanResume(true); };
    utter.onresume = () => { setPaused(false); };
    utter.onerror = (e) => {
      setSpeechError(
        e.error === "not-allowed"
          ? "Speech not allowed: please allow audio"
          : "Speech API error"
      );
      setSpeaking(false);
    };
    utter.onend = () => {
      setSpeaking(false);
      setPaused(false);
      setCanResume(false);
      utterRef.current = null;
    };
    utterRef.current = utter;
    window.speechSynthesis.speak(utter);
  }

  function pauseNarration() {
    if (!synthSupported || !window.speechSynthesis.speaking) return;
    window.speechSynthesis.pause();
    setPaused(true);
    setCanResume(true);
  }
  function resumeNarration() {
    if (!synthSupported || !window.speechSynthesis.paused) return;
    window.speechSynthesis.resume();
    setPaused(false);
    setCanResume(false);
  }
  function stopNarration(clearError = true) {
    if (synthSupported && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
    setPaused(false);
    setCanResume(false);
    utterRef.current = null;
    if (clearError) setSpeechError("");
  }

  // Play/pause/stop ambient sound
  useEffect(() => {
    if (!ambientOn) {
      if (calmAudioRef.current) {
        calmAudioRef.current.pause();
        calmAudioRef.current.currentTime = 0;
      }
      return;
    }
    if (!calmAudioRef.current) {
      calmAudioRef.current = new Audio(CALMING_SOUND_URL);
      calmAudioRef.current.loop = true;
      calmAudioRef.current.volume = 0.21;
    }
    calmAudioRef.current.play().catch(() => { /* fail silently */ });
    // Pause sound if component is unmounted or ambientOn turned off
    return () => {
      if (calmAudioRef.current) {
        calmAudioRef.current.pause();
      }
    };
  }, [ambientOn]);

  // Accessibility: Keyboard shortcuts for play/stop (space, esc)
  function handleKey(e) {
    if (e.code === "Space") {
      if (!speaking) playNarration();
      else if (paused) resumeNarration();
      else pauseNarration();
      e.preventDefault();
    } else if (e.code === "Escape") {
      stopNarration();
    }
  }

  // Speech API unavailable fallback
  if (!synthSupported) {
    return (
      <section
        aria-label="Voice Narration"
        style={{
          background: "var(--secondary)",
          borderRadius: "var(--border-radius)",
          boxShadow: "0 1px 16px var(--shadow-color)",
          padding: 22,
          margin: "18px 0 0 0",
          maxWidth: 440,
          textAlign: "center"
        }}
      >
        <div style={{ fontSize: "1.08rem", color: "var(--muted-text)", marginBottom: 6 }}>
          <span role="img" aria-label="speaker" style={{filter: "grayscale(0.6)", fontSize:20}}>🔇</span>
          <br />
          Voice narration is not supported in your browser/device.
        </div>
      </section>
    );
  }

  // UI
  return (
    <section
      className="voice-narration"
      aria-label="Quote voice narration controls"
      style={{
        margin: "0 auto 1.1rem auto",
        maxWidth: 420,
        padding: "23px 12px 16px 12px",
        borderRadius: "var(--border-radius)",
        background: "var(--secondary)",
        boxShadow: "0 1px 14px var(--shadow-color)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        fontFamily: "inherit"
      }}
      tabIndex={0}
      onKeyDown={handleKey}
    >
      <div
        style={{
          display: "flex", alignItems: "center", gap: 14, justifyContent: "center", marginBottom: 7
        }}
      >
        <button
          className="btn"
          style={{
            background: speaking ? "var(--primary)" : "var(--accent)",
            color: speaking ? "#1A1A1A" : "#fff",
            padding: "8px 20px",
            borderRadius: 24,
            fontWeight: 600,
            outline: "none",
            border: "none",
            fontSize: "1.06rem",
            minWidth: 92,
            boxShadow: "0 1px 8px 0 rgba(168,213,186,0.08)",
            marginRight: 2,
            opacity: 1
          }}
          title={!speaking ? "Play narration" : paused ? "Resume" : "Pause"}
          aria-label={!speaking ? "Play narration" : paused ? "Resume narration" : "Pause narration"}
          onClick={() => {
            if (!speaking) playNarration();
            else if (paused) resumeNarration();
            else pauseNarration();
          }}
        >
          {speaking ? (
            paused ? <span>Resume&nbsp;▶️</span> : <span>Pause&nbsp;⏸️</span>
          ) : (
            <span>Play&nbsp;🔊</span>
          )}
        </button>
        <button
          className="btn"
          style={{
            background: "rgba(168,213,186,0.17)",
            color: "#155b30",
            border: "none",
            padding: "8px 18px",
            borderRadius: 19,
            fontWeight: 500,
            fontSize: "1.02rem"
          }}
          disabled={!speaking}
          aria-label="Stop narration"
          title="Stop narration"
          onClick={stopNarration}
        >
          Stop&nbsp;⏹️
        </button>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", width: "100%", justifyContent: "center" }}>
        <label htmlFor="voice-select" style={{
          color: "var(--muted-text)",
          fontSize: 14,
          marginRight: 3,
          fontWeight: 500
        }}>
          Voice:
        </label>
        <select
          name="voice-select"
          id="voice-select"
          onChange={handleVoiceChange}
          value={selectedVoice}
          aria-label="Narration voice"
          style={{
            padding: "5px 11px",
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: 11,
            minWidth: 74,
            fontSize: 14
          }}
        >
          {voices.length === 0 && <option>No voices found</option>}
          {voices.map(v => (
            <option key={v.voiceURI} value={v.voiceURI}>
              {v.name.replace(/Google|Microsoft\s*/gi, "").trim()} ({v.lang})
              {v.default ? " ★" : ""}
            </option>
          ))}
        </select>
        <span tabIndex={-1}>
          <button
            className="btn"
            aria-pressed={ambientOn}
            title={ambientOn ? "Mute calming sound" : "Play calming sound"}
            style={{
              marginLeft: 17,
              background: ambientOn ? "var(--primary)" : "#e0edeb",
              color: ambientOn ? "#213f2e" : "#567",
              padding: "7px 14px",
              borderRadius: 17,
              fontWeight: 500,
              border: "none",
              fontSize: "1.01rem",
              outline: "none"
            }}
            onClick={() => setAmbientOn(on => !on)}
          >
            {ambientOn ? "Calm On 🌊" : "Calm Off 🌊"}
          </button>
        </span>
      </div>
      {speechError && <div style={{ color: "#a44135", marginTop: 7, fontSize: 13 }}>{speechError}</div>}
      <div
        aria-label="Tip"
        style={{
          color: "var(--muted-text)",
          fontSize: 13.5,
          marginTop: 10,
          fontWeight: 400,
        }}
      >
        <span style={{opacity: 0.56}}>Ctrl/Space: Play&nbsp;·&nbsp;Esc: Stop&nbsp;·&nbsp;Try different voices</span>
      </div>
    </section>
  );
}

export default VoiceNarration;
