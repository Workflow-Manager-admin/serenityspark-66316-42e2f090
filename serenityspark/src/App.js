import React from 'react';
import './App.css';
import DailyQuote from './components/DailyQuote';

// PUBLIC_INTERFACE
function App() {
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
          {/* DailyQuote follows the hero section, matching the calming theme */}
          <DailyQuote />
          {/* More sections/components injected here as the app grows */}
        </div>
      </main>
    </div>
  );
}

export default App;