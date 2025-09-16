import React, { useRef, useEffect, useState, useCallback } from 'react';

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 300;
const SHIP_WIDTH = 40;
const SHIP_HEIGHT = 30;
const LASER_WIDTH = 8;
const LASER_HEIGHT = 4;
const OB_WIDTH = 30;
const OB_HEIGHT = 24;
const GAME_SPEED = 2.5;
const LASER_SPEED = 6;
const SPAWN_EVERY = 90;
const KEY_UP = ['ArrowUp', 'w', 'W'];
const KEY_DOWN = ['ArrowDown', 's', 'S'];
const KEY_SHOOT = [' '];
const NUM_STARS = 80;

// Axis-aligned bounding box collision
function rectsOverlap(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

export default function SpaceRunner() {
  const canvasRef = useRef(null);
  const frameRef = useRef();
  const bufferCanvasRef = useRef(null);

  // Skins: images
  const shipImg = useRef(null);
  const obstacleImg = useRef(null);
  const obstructionImg = useRef(null); // For indestructible obstacles
  const laserImg = useRef(null);

  // Audio
  const laserSound = useRef(null);
  const gameOverSound = useRef(null);

  // Game state
  const ship = useRef({ x: 50, y: CANVAS_HEIGHT / 2 - SHIP_HEIGHT / 2 });
  const lasers = useRef([]);
  const obsts = useRef([]);
  const keys = useRef(new Set());
  const frame = useRef(0);
  const score = useRef(0);
  const paused = useRef(false);
  const laserCooldown = useRef(0); // Laser cooldown timer
  const maxLasersOnScreen = useRef(3); // Maximum lasers allowed on screen

  const [displayScore, setDisplayScore] = useState(0);
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'gameover'
  const [finalScore, setFinalScore] = useState(0);
  const [, forceRerender] = useState(0); // For UI update triggers

  // Starfield
  const stars = useRef([]);

  // Load images and audio once
  useEffect(() => {
    shipImg.current = new window.Image();
    obstacleImg.current = new window.Image();
    obstructionImg.current = new window.Image();
    laserImg.current = new window.Image();

    shipImg.current.src = '/ship.png';
    obstacleImg.current.src = '/rock.png';
    obstructionImg.current.src = '/obstruction.png';
    laserImg.current.src = 'https://i.ibb.co/HrtGdb3/laser.png';

    // Load audio files
    laserSound.current = new Audio('/laser-shoot.mp3');
    gameOverSound.current = new Audio('/GameOver.mp3');
    
    // Preload audio
    laserSound.current.preload = 'auto';
    gameOverSound.current.preload = 'auto';
  }, []);

  // Initialize stars once
  useEffect(() => {
    stars.current = Array.from({ length: NUM_STARS }).map(() => ({
      x: Math.random() * CANVAS_WIDTH,
      y: Math.random() * CANVAS_HEIGHT,
      radius: Math.random() * 1.5 + 0.6,
      speed: Math.random() * 1.1 + 0.4,
    }));
  }, []);

  // Keyboard Handlers
  const handleKeyDown = useCallback(
    (e) => {
      if (
        KEY_UP.includes(e.key) ||
        KEY_DOWN.includes(e.key) ||
        KEY_SHOOT.includes(e.key)
      ) {
        e.preventDefault();
      }
      keys.current.add(e.key);
      if (gameState === 'playing' && (e.key === 'p' || e.key === 'P')) {
        paused.current = !paused.current;
        forceRerender((v) => v + 1);
      }
      if (gameState === 'gameover' && (e.key === 'r' || e.key === 'R')) resetGame();
    },
    [gameState]
  );

  const handleKeyUp = useCallback((e) => {
    keys.current.delete(e.key);
  }, []);

  // Main GAME LOOP
  const loop = useCallback(() => {
    frame.current += 1;

    if (gameState === 'playing' && !paused.current) {
      // Progressive difficulty - spawn rate increases over time
      const currentSpawnRate = Math.max(30, SPAWN_EVERY - Math.floor(score.current / 500));
      
      if (frame.current % currentSpawnRate === 0) {
        const yPos = Math.random() * (CANVAS_HEIGHT - OB_HEIGHT);
        const type = Math.random() > 0.4 ? 'asteroid' : 'enemy';
        const isIndestructible = Math.random() > (0.85 - score.current * 0.0001); // Slightly more indestructible over time
        const direction = Math.random() > (0.8 - score.current * 0.0002) ? 'vertical' : 'horizontal'; // More vertical obstacles over time
        
        if (direction === 'vertical') {
          // Spawn from top or bottom with safe zone around ship
          const fromTop = Math.random() > 0.5;
          let safeX;
          
          // Create safe zone around ship (ship is at x: 50, width: 40)
          const shipLeft = ship.current.x;
          const shipRight = ship.current.x + SHIP_WIDTH;
          const safeZoneWidth = 80; // 40px buffer on each side of ship
          
          // Choose spawn position avoiding ship area
          if (Math.random() > 0.5) {
            // Spawn on right side of safe zone
            safeX = Math.max(shipRight + 20, Math.random() * (CANVAS_WIDTH - OB_WIDTH - (shipRight + 20)) + (shipRight + 20));
          } else {
            // Spawn on left side of safe zone (if there's space)
            const leftSpace = Math.max(0, shipLeft - 20);
            if (leftSpace > OB_WIDTH) {
              safeX = Math.random() * (leftSpace - OB_WIDTH);
            } else {
              // Fallback to right side if left side too small
              safeX = Math.max(shipRight + 20, Math.random() * (CANVAS_WIDTH - OB_WIDTH - (shipRight + 20)) + (shipRight + 20));
            }
          }
          
          obsts.current.push({ 
            x: Math.min(safeX, CANVAS_WIDTH - OB_WIDTH), // Ensure within bounds
            y: fromTop ? -OB_HEIGHT : CANVAS_HEIGHT, 
            w: OB_WIDTH, 
            h: OB_HEIGHT, 
            skin: type,
            isIndestructible,
            direction: 'vertical',
            speed: fromTop ? (2 + score.current * 0.001) : -(2 + score.current * 0.001)
          });
        } else {
          // Regular horizontal spawn with safe zone consideration
          let safeY;
          const shipTop = ship.current.y;
          const shipBottom = ship.current.y + SHIP_HEIGHT;
          const safeZoneHeight = 60; // 30px buffer above and below ship
          
          // Choose spawn position avoiding immediate ship area
          if (Math.random() > 0.5) {
            // Spawn above safe zone
            const topSpace = Math.max(0, shipTop - 30);
            if (topSpace > OB_HEIGHT) {
              safeY = Math.random() * (topSpace - OB_HEIGHT);
            } else {
              // Fallback to below safe zone
              safeY = Math.max(shipBottom + 30, Math.random() * (CANVAS_HEIGHT - OB_HEIGHT - (shipBottom + 30)) + (shipBottom + 30));
            }
          } else {
            // Spawn below safe zone
            const bottomSpace = CANVAS_HEIGHT - (shipBottom + 30);
            if (bottomSpace > OB_HEIGHT) {
              safeY = Math.max(shipBottom + 30, Math.random() * (bottomSpace - OB_HEIGHT) + (shipBottom + 30));
            } else {
              // Fallback to above safe zone
              const topSpace = Math.max(0, shipTop - 30);
              safeY = Math.random() * (topSpace - OB_HEIGHT);
            }
          }
          
          obsts.current.push({ 
            x: CANVAS_WIDTH, 
            y: Math.max(0, Math.min(safeY, CANVAS_HEIGHT - OB_HEIGHT)), // Ensure within bounds
            w: OB_WIDTH, 
            h: OB_HEIGHT, 
            skin: type,
            isIndestructible,
            direction: 'horizontal',
            speed: -(GAME_SPEED + 0.003 * score.current)
          });
        }
      }
      if (KEY_UP.some((k) => keys.current.has(k))) ship.current.y = Math.max(0, ship.current.y - 4);
      if (KEY_DOWN.some((k) => keys.current.has(k))) ship.current.y = Math.min(CANVAS_HEIGHT - SHIP_HEIGHT, ship.current.y + 4);

      // Update laser cooldown
      if (laserCooldown.current > 0) {
        laserCooldown.current--;
      }

      // Lasers with cooldown and limit
      if (KEY_SHOOT.some((k) => keys.current.has(k)) && 
          laserCooldown.current === 0 && 
          lasers.current.length < maxLasersOnScreen.current) {
        
        lasers.current.push({
          x: ship.current.x + SHIP_WIDTH,
          y: ship.current.y + SHIP_HEIGHT / 2 - LASER_HEIGHT / 2,
          w: LASER_WIDTH,
          h: LASER_HEIGHT,
        });
        
        // Set cooldown (20 frames = ~0.33 seconds at 60fps)
        laserCooldown.current = 20;
        
        // Play laser sound effect
        if (laserSound.current) {
          laserSound.current.currentTime = 0;
          laserSound.current.play().catch(e => console.log('Audio play failed:', e));
        }
      }
      lasers.current.forEach((l) => (l.x += LASER_SPEED));
      lasers.current = lasers.current.filter((l) => l.x < CANVAS_WIDTH);

      // Obstacle movement
      obsts.current.forEach((o) => {
        if (o.direction === 'vertical') {
          o.y += o.speed;
        } else {
          o.x += o.speed;
        }
      });

      // Star movement
      stars.current.forEach((star) => {
        star.x -= star.speed;
        if (star.x < 0) {
          star.x = CANVAS_WIDTH;
          star.y = Math.random() * CANVAS_HEIGHT;
          star.radius = Math.random() * 1.5 + 0.6;
          star.speed = Math.random() * 1.1 + 0.4;
        }
      });

      // Collisions
      for (let i = obsts.current.length - 1; i >= 0; i--) {
        const ob = obsts.current[i];
        if (
          rectsOverlap(
            { x: ship.current.x, y: ship.current.y, w: SHIP_WIDTH, h: SHIP_HEIGHT },
            ob
          )
        ) {
          paused.current = true;
          setGameState('gameover');
          setFinalScore(score.current);
          
          // Play game over sound effect
          if (gameOverSound.current) {
            gameOverSound.current.currentTime = 0;
            gameOverSound.current.play().catch(e => console.log('Audio play failed:', e));
          }
          
          break;
        }
        for (let j = lasers.current.length - 1; j >= 0; j--) {
          const lz = lasers.current[j];
          if (rectsOverlap(lz, ob)) {
            if (!ob.isIndestructible) {
              obsts.current.splice(i, 1);
              lasers.current.splice(j, 1);
              score.current += 50;
              break;
            } else {
              // Remove laser but keep indestructible obstacle
              lasers.current.splice(j, 1);
              break;
            }
          }
        }
      }

      obsts.current = obsts.current.filter((o) => {
        if (o.direction === 'vertical') {
          return o.y > -OB_HEIGHT && o.y < CANVAS_HEIGHT + OB_HEIGHT;
        } else {
          return o.x + o.w > 0;
        }
      });

      if (frame.current % 6 === 0) {
        score.current += 1;
      }
      setDisplayScore(score.current);
    }

    // ---- DRAWING ----
    const buf = bufferCanvasRef.current;
    const ctx = buf.getContext('2d');

    ctx.fillStyle = 'rgb(24 24 27)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.save();
    stars.current.forEach((star) => {
      ctx.globalAlpha = 0.85 + star.radius * 0.01;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.restore();

    // Ship with image skin (no bounce, only subtle rotation)
    if (shipImg.current.complete && shipImg.current.naturalWidth) {
      ctx.save();
      ctx.translate(ship.current.x + SHIP_WIDTH / 2, ship.current.y + SHIP_HEIGHT / 2);
      ctx.rotate(Math.sin(frame.current / 12) * 0.03);
      ctx.drawImage(shipImg.current, -SHIP_WIDTH / 2, -SHIP_HEIGHT / 2, SHIP_WIDTH, SHIP_HEIGHT);
      ctx.restore();
    } else {
      ctx.fillStyle = '#0ff';
      ctx.beginPath();
      ctx.moveTo(ship.current.x, ship.current.y);
      ctx.lineTo(ship.current.x, ship.current.y + SHIP_HEIGHT);
      ctx.lineTo(ship.current.x + SHIP_WIDTH, ship.current.y + SHIP_HEIGHT / 2);
      ctx.closePath();
      ctx.fill();
    }

    // Lasers with skin
    lasers.current.forEach((lz) => {
      if (laserImg.current.complete && laserImg.current.naturalWidth) {
        ctx.drawImage(laserImg.current, lz.x, lz.y, lz.w, lz.h);
      } else {
        ctx.fillStyle = '#f00';
        ctx.fillRect(lz.x, lz.y, lz.w, lz.h);
      }
    });

    // Obstacles with skin and reduced bounce/rotation
    obsts.current.forEach((ob) => {
      ctx.save();
      ctx.translate(ob.x + ob.w / 2, ob.y + ob.h / 2);
      const angle = Math.sin((frame.current + ob.x) / 30) * 0.15;
      ctx.rotate(angle);
      const bounce = Math.sin(frame.current / 18 + ob.x / 40) * 2;
      
      // Choose the appropriate image based on obstacle type
      const imageToUse = ob.isIndestructible ? obstructionImg.current : obstacleImg.current;
      
      if (imageToUse && imageToUse.complete && imageToUse.naturalWidth) {
        ctx.drawImage(imageToUse, -ob.w / 2, -ob.h / 2 + bounce, ob.w, ob.h);
      } else {
        // Fallback colors
        ctx.fillStyle = ob.isIndestructible ? '#f44' : '#aaa';
        ctx.fillRect(-ob.w / 2, -ob.h / 2 + bounce, ob.w, ob.h);
      }
      ctx.restore();
    });

    // UI overlays
    ctx.fillStyle = '#fff';
    ctx.font = '12px "Pixelify Sans", monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`Score: ${score.current}`, CANVAS_WIDTH - 12, 20);
    
    // Laser count and cooldown indicator
    ctx.fillText(`Lasers: ${lasers.current.length}/${maxLasersOnScreen.current}`, CANVAS_WIDTH - 12, 35);
    
    // Cooldown bar near ship
    if (laserCooldown.current > 0) {
      const barWidth = 30;
      const barHeight = 4;
      const barX = ship.current.x + SHIP_WIDTH / 2 - barWidth / 2;
      const barY = ship.current.y - 10;
      
      // Background bar
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(barX, barY, barWidth, barHeight);
      
      // Cooldown progress
      const progress = (20 - laserCooldown.current) / 20;
      ctx.fillStyle = progress < 0.5 ? '#f44' : '#4f4';
      ctx.fillRect(barX, barY, barWidth * progress, barHeight);
    }
    
    ctx.textAlign = 'start';

    // Overlay screens inside the loop
    if (gameState === 'start' || gameState === 'gameover') {
      ctx.fillStyle = 'rgb(24 24 27)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.fillStyle = '#fff';
      ctx.font = gameState === 'start' ? 'bold 32px "Pixelify Sans", monospace' : 'bold 28px "Pixelify Sans", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(gameState === 'start' ? 'SPACE RUNNER' : 'GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 30);

      ctx.font = '18px "Pixelify Sans", monospace';
      if (gameState === 'start') {
        ctx.fillText('Click to Start', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10);
        ctx.font = '14px "Pixelify Sans", monospace';
        ctx.fillText('Use Up/Down arrows to move', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);
        ctx.fillText('Spacebar to shoot, P to pause', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 65);
      } else {
        ctx.fillText(`Score: ${finalScore}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10);
        ctx.fillText('Click to Restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 45);
      }
      ctx.textAlign = 'start';
    }

    // Pause message
    if (paused.current && gameState === 'playing') {
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(CANVAS_WIDTH / 2 - 60, CANVAS_HEIGHT / 2 - 32, 120, 44);
      ctx.fillStyle = '#fff';
      ctx.font = '22px "Pixelify Sans", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      ctx.textAlign = 'start';
    }

    const vis = canvasRef.current.getContext('2d');
    vis.drawImage(buf, 0, 0);

    frameRef.current = requestAnimationFrame(loop);
  }, [gameState, finalScore]);

  // Game Start and Reset
  const resetGame = () => {
    obsts.current = [];
    lasers.current = [];
    score.current = 0;
    frame.current = 0;
    paused.current = false;
    laserCooldown.current = 0; // Reset laser cooldown
    ship.current.y = CANVAS_HEIGHT / 2 - SHIP_HEIGHT / 2;
    setGameState('playing');
    setFinalScore(0);
    forceRerender((v) => v + 1);
    frameRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    const buf = document.createElement('canvas');
    buf.width = CANVAS_WIDTH;
    buf.height = CANVAS_HEIGHT;
    bufferCanvasRef.current = buf;

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp, loop, gameState]);

  return (
    <div
      style={{
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        margin: '0 auto',
        position: 'relative',
        background: '#000',
        userSelect: 'none',
        touchAction: 'none',
        cursor: gameState === 'start' || gameState === 'gameover' ? 'pointer' : 'default',
      }}
      onClick={() => {
        if (gameState === 'start' || gameState === 'gameover') resetGame();
      }}
    >
      <canvas ref={canvasRef} />
      {gameState === 'playing' && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              paused.current = !paused.current;
              forceRerender((v) => v + 1);
            }}
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              zIndex: 2,
              fontSize: '13px',
              padding: '4px 14px',
              background: paused.current ? '#222' : '#060',
              color: '#fff',
              borderRadius: 3,
              opacity: 0.85,
              cursor: 'pointer',
              
            }}
          >
            {paused.current ? 'Resume' : 'Pause'}
          </button>
          <div
            style={{
              position: 'absolute',
              bottom: 4,
              left: 6,
              color: '#0f0',
              font: '10px "Pixelify Sans", monospace',
              userSelect: 'none',
            }}
          >
            {displayScore}
          </div>
        </>
      )}
    </div>
  );
}
