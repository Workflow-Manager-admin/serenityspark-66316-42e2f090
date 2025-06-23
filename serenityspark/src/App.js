import React, { useState } from 'react';
import './App.css';
import DailyQuote from './components/DailyQuote';
import Challenge from './components/Challenge';

// PUBLIC_INTERFACE
function App() {
  const [challengeComplete, setChallengeComplete] = useState(false);

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
          {/* Challenge comes before quote. DailyQuote is unlocked only after solving the challenge */}
          {!challengeComplete && (
            <Challenge onComplete={() => setChallengeComplete(true)} />
          )}
          {challengeComplete && (
            <DailyQuote />
          )}
          {/* More sections/components injected here as the app grows */}
        </div>
      </main>
    </div>
  );
}

export default App;