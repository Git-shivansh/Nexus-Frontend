import React from 'react';

const WaveLayer = ({ fillId, speed, opacity }) => (
  <svg
    viewBox="0 0 240 28"
    style={{
      width: '100%',
      height: '100px',
      position: 'absolute',
      bottom: 0,
      left: 0,
      opacity,
      overflow: 'hidden',
      pointerEvents: 'none',
      userSelect: 'none',
      filter: 'drop-shadow(0 0 6px rgba(0,0,0,0.05))',
    }}
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id={fillId} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="10%" stopColor="#b35400" />
        <stop offset="90%" stopColor="#ff8800" />
      </linearGradient>
      <path
        id="wavePath"
        d="M 0,6 C 60,6 60,18 120,18 180,18 180,6 240,6 v 22 h -240 z"
      />
    </defs>
    <g
      style={{
        animation: `moveWave ${speed}s linear infinite`,
      }}
    >
      <use href="#wavePath" x="0" y="0" fill={`url(#${fillId})`} />
      <use href="#wavePath" x="240" y="0" fill={`url(#${fillId})`} />
    </g>
    <style>{`
      @keyframes moveWave {
        0% { transform: translateX(0); }
        100% { transform: translateX(-240px); }
      }
    `}</style>
  </svg>
);

const App = () => (
  <div
    style={{
      position: 'relative',
      width: '100%',
      height: '100px',
      overflow: 'hidden',
      boxSizing: 'border-box',
    }}
  >
    <WaveLayer fillId="grad1" speed={7} opacity={0.7} />
    <WaveLayer fillId="grad2" speed={9} opacity={0.5} />
    <WaveLayer fillId="grad3" speed={15} opacity={0.3} />
  </div>
);

export default App;
