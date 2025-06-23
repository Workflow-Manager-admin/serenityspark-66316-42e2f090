import React, { useState } from 'react';
import './App.css';
import DailyQuote from './components/DailyQuote';
import Challenge from './components/Challenge';

// PUBLIC_INTERFACE
function App() {
  // State to control whether the challenge is complete
  const [challengeComplete, setChallengeComplete] = useState(false);
  // State to gently fade out the Challenge and reveal the Quote, for smoothness
  const [showQuote, setShowQuote] = useState(false);

  // Handler to be called when the Challenge is solved
  function handleChallengeComplete() {
    setChallengeComplete(true);
    // Delay to animate hiding Challenge before revealing quote
    setTimeout(() => setShowQuote(true), 600);
  }

  return (
    <div className="app">
      <nav className="navbar" role="navigation">
        <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="logo">
            <span className="logo-symbol" aria-label="spark" title="spark">&#10024;</span>
            SerenitySpark
          </div>
        </div>
      </nav>
      <main>
        <div className="container">
          <section className="hero">
            <span className="subtitle">A touch of calm every day</span>
            <h1 className="title">Welcome to SerenitySpark</h1>
            <div className="description">
              Discover daily inspiration, gentle interactions, and your peaceful reflection space.<br />
              <span style={{opacity: 0.8}}>Minimal distractions. Maximum serenity.</span>
            </div>
            <button className="btn btn-large" tabIndex={0}>
              Begin Your Journey
            </button>
          </section>
          {/* Calming fade transition: show Challenge, then fade in DailyQuote */}
          <div
            style={{
              minHeight: 180,
              position: 'relative',
              transition: "opacity 0.5s cubic-bezier(.76,0,.24,1)",
            }}
          >
            {!challengeComplete && (
              <div
                style={{
                  opacity: challengeComplete ? 0 : 1,
                  pointerEvents: challengeComplete ? "none" : "auto",
                  transition: "opacity 0.5s cubic-bezier(.76,0,.24,1)",
                  position: showQuote ? 'absolute' : 'relative',
                  width: "100%",
                }}
              >
                <Challenge onComplete={handleChallengeComplete} />
              </div>
            )}
            {showQuote && (
              <div
                style={{
                  opacity: showQuote ? 1 : 0,
                  transition: "opacity 0.7s cubic-bezier(.76,0,.24,1)",
                  position: 'relative',
                  width: "100%",
                }}
              >
                <DailyQuote />
              </div>
            )}
          </div>
          {/* More sections/components injected here as the app grows */}
        </div>
      </main>
    </div>
  );
}

export default App;