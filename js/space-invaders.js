(() => {
  const canvas = document.querySelector("#game");
  const ctx = canvas.getContext("2d");
  const overlay = document.querySelector("#overlay");
  const overlayTitle = document.querySelector("#overlay-title");
  const overlayCopy = document.querySelector("#overlay-copy");
  const playButton = document.querySelector("#play-button");
  const scoreEl = document.querySelector("#score");
  const livesEl = document.querySelector("#lives");
  const progressEl = document.querySelector("#progress");
  const winCard = document.querySelector("#win-card");
  const image = new Image();
  image.src = "./assets/game/player.png";
  let audioContext;
  const state = {
    score: 0,
    lives: 3,
    running: false,
    player: { x: 0.5, y: 0.89, w: 0.2, h: 0.12 },
    bullets: [],
    enemies: [],
    powerUps: [],
    sparks: [],
    last: 0,
    spawn: 0,
    shot: 0,
    rapidFire: 0,
    invulnerable: 0,
  };
  let width = 360,
    height = 480,
    dpr = 1;
  const enemySvg = {
    owl: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 90"><path fill="#c4b5fd" stroke="#f5f1e8" stroke-width="5" d="M8 37 15 8l20 12q15-8 30 0L85 8l7 29v24q-14 22-42 22T8 61Z"/><circle cx="34" cy="42" r="14" fill="#111827"/><circle cx="66" cy="42" r="14" fill="#111827"/><circle cx="34" cy="42" r="5" fill="#63e6e2"/><circle cx="66" cy="42" r="5" fill="#63e6e2"/><path fill="#ffb86b" d="m43 53 7 9 7-9Z"/></svg>',
    cat: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 90"><path fill="#fb7185" stroke="#f5f1e8" stroke-width="5" d="m10 27 5-21 23 15q12-5 24 0L85 6l5 21v38q-11 18-40 18T10 65Z"/><path fill="#111827" d="M25 42h14v8H25zm36 0h14v8H61z"/><path stroke="#111827" stroke-width="4" d="M46 61q4 6 8 0M14 58l22 3m50-3-22 3"/></svg>',
  };
  const sprites = {};
  Object.entries(enemySvg).forEach(([key, svg]) => {
    sprites[key] = new Image();
    sprites[key].src =
      `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  });
  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function getAudioContext() {
    if (!audioContext)
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === "suspended") audioContext.resume();
    return audioContext;
  }
  function playSound(type) {
    const audio = getAudioContext();
    const now = audio.currentTime;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.connect(gain);
    gain.connect(audio.destination);
    const sounds = {
      shot: {
        start: 620,
        end: 180,
        duration: 0.08,
        volume: 0.035,
        wave: "square",
      },
      enemy: {
        start: 180,
        end: 720,
        duration: 0.16,
        volume: 0.07,
        wave: "sawtooth",
      },
      life: {
        start: 150,
        end: 55,
        duration: 0.36,
        volume: 0.11,
        wave: "triangle",
      },
      heart: {
        start: 320,
        end: 680,
        duration: 0.18,
        volume: 0.08,
        wave: "sine",
      },
      star: {
        start: 520,
        end: 1040,
        duration: 0.24,
        volume: 0.07,
        wave: "triangle",
      },
    };
    const sound = sounds[type];
    oscillator.type = sound.wave;
    oscillator.frequency.setValueAtTime(sound.start, now);
    oscillator.frequency.exponentialRampToValueAtTime(
      sound.end,
      now + sound.duration,
    );
    gain.gain.setValueAtTime(sound.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + sound.duration);
    oscillator.start(now);
    oscillator.stop(now + sound.duration);
  }
  function reset() {
    state.score = 0;
    state.lives = 3;
    state.bullets = [];
    state.enemies = [];
    state.powerUps = [];
    state.sparks = [];
    state.player.x = 0.5;
    state.spawn = 0;
    state.shot = 0;
    state.rapidFire = 0;
    state.invulnerable = 0;
    updateHud();
  }
  function updateHud() {
    scoreEl.textContent = state.score;
    livesEl.textContent =
      "♥".repeat(state.lives) + "♡".repeat(3 - state.lives);
    progressEl.style.width = `${state.score}%`;
  }
  function start() {
    reset();
    state.running = true;
    overlay.hidden = true;
    winCard.hidden = true;
    state.last = performance.now();
    requestAnimationFrame(loop);
  }
  function end(win = false) {
    state.running = false;
    overlay.hidden = false;
    overlayTitle.textContent = win ? "¡Misión cumplida!" : "Fin de la partida";
    overlayCopy.textContent = win
      ? "Has desbloqueado tu regalo."
      : "Los bichos han ganado esta ronda. ¡Inténtalo otra vez!";
    playButton.textContent = win ? "Jugar de nuevo" : "Reintentar";
    if (win) {
      winCard.hidden = false;
      document.querySelector(".game-card").hidden = true;
      document.querySelector(".fine-print").hidden = true;
    }
  }
  function move(amount) {
    state.player.x = Math.max(0.1, Math.min(0.9, state.player.x + amount));
  }
  function spawnEnemy() {
    const difficulty = 1 + (state.score / 100) * 5;
    state.enemies.push({
      x: 0.08 + Math.random() * 0.84,
      y: -0.08,
      size: 0.085 + Math.random() * 0.025,
      speed: (0.16 + Math.random() * 0.08) * difficulty,
      type: Math.random() < 0.5 ? "owl" : "cat",
      phase: Math.random() * 6,
    });
  }
  function shoot() {
    state.bullets.push({
      x: state.player.x,
      y: state.player.y - 0.06,
      hits: 0,
    });
    playSound("shot");
  }
  function burst(x, y, color) {
    for (let i = 0; i < 8; i++)
      state.sparks.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        t: 0.5,
        color,
      });
  }
  function dropPowerUp(x, y) {
    if (Math.random() > 0.11) return;
    state.powerUps.push({
      x,
      y,
      type: Math.random() < 0.5 ? "heart" : "star",
      speed: 0.11,
    });
  }
  function collectPowerUp(p) {
    if (p.type === "heart") state.lives = Math.min(3, state.lives + 1);
    else state.rapidFire = Math.min(6, state.rapidFire + 3);
    playSound(p.type);
    burst(p.x, p.y, p.type === "heart" ? "#ff5e9c" : "#ffd166");
    updateHud();
  }
  function loop(now) {
    if (!state.running) return;
    const dt = Math.min((now - state.last) / 1000, 0.04);
    state.last = now;
    state.spawn -= dt;
    state.shot -= dt;
    state.rapidFire = Math.max(0, state.rapidFire - dt);
    state.invulnerable = Math.max(0, state.invulnerable - dt);
    if (state.spawn <= 0) {
      spawnEnemy();
      state.spawn = Math.max(0.12, 0.68 - state.score / 170);
    }
    const fireDelay = state.rapidFire > 0 ? 0.3 : 0.62;
    if (state.shot <= 0) {
      shoot();
      state.shot = fireDelay;
    }
    state.bullets.forEach((b) => (b.y -= dt * 0.8));
    state.bullets = state.bullets.filter((b) => b.y > -0.1);
    state.enemies.forEach((e) => {
      e.y += dt * e.speed;
      e.x += Math.sin(now / 900 + e.phase) * dt * 0.035;
    });
    state.powerUps.forEach((p) => (p.y += dt * p.speed));
    for (const p of state.powerUps) {
      if (p.y > 0.82 && Math.abs(p.x - state.player.x) < 0.16) {
        p.hit = true;
        collectPowerUp(p);
      }
    }
    for (const e of state.enemies) {
      if (
        state.invulnerable <= 0 &&
        e.y > 0.84 &&
        Math.abs(e.x - state.player.x) < 0.14
      ) {
        e.hit = true;
        state.lives--;
        state.invulnerable = 2;
        playSound("life");
        burst(e.x, e.y, "#ff5e9c");
        updateHud();
        if (!state.lives) {
          end(false);
          return;
        }
      }
    }
    for (const b of state.bullets) {
      for (const e of state.enemies) {
        if (
          !b.hit &&
          !e.hit &&
          b.hits < 2 &&
          Math.hypot(b.x - e.x, (b.y - e.y) * 0.75) < e.size * 0.9
        ) {
          e.hit = true;
          b.hits += 1;
          if (b.hits >= 2) b.hit = true;
          state.score += 2;
          playSound("enemy");
          dropPowerUp(e.x, e.y);
          burst(e.x, e.y, e.type === "owl" ? "#c4b5fd" : "#fb7185");
          updateHud();
          if (state.score >= 100) {
            state.score = 100;
            updateHud();
            end(true);
            return;
          }
        }
      }
    }
    state.enemies = state.enemies.filter((e) => !e.hit && e.y < 1.1);
    state.powerUps = state.powerUps.filter((p) => !p.hit && p.y < 1.1);
    state.sparks.forEach((s) => {
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.t -= dt;
    });
    state.sparks = state.sparks.filter((s) => s.t > 0);
    draw(now);
    requestAnimationFrame(loop);
  }
  function draw(now) {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#070b16";
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = "rgba(99,230,226,.07)";
    ctx.lineWidth = 1;
    for (let y = 0; y < height; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    for (let x = 0; x < width; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(99,230,226,.45)";
    for (let i = 0; i < 24; i++) {
      const x = (i * 71) % width,
        y = (i * 113 + now * 0.01) % height;
      ctx.fillRect(x, y, 1, 1);
    }
    state.enemies.forEach((e) => {
      const s = e.size * width;
      ctx.drawImage(
        sprites[e.type],
        e.x * width - s / 2,
        e.y * height - s * 0.45,
        s,
        s * 0.9,
      );
    });
    state.powerUps.forEach((p) => {
      ctx.font = `${Math.max(20, width * 0.065)}px serif`;
      ctx.textAlign = "center";
      ctx.shadowBlur = 14;
      ctx.shadowColor = p.type === "heart" ? "#ff5e9c" : "#ffd166";
      ctx.fillStyle = p.type === "heart" ? "#ff5e9c" : "#ffd166";
      ctx.fillText(p.type === "heart" ? "♥" : "★", p.x * width, p.y * height);
    });
    ctx.fillStyle = "#63e6e2";
    state.bullets.forEach((b) => {
      ctx.shadowBlur = 12;
      ctx.shadowColor = "#63e6e2";
      ctx.fillRect(b.x * width - 2, b.y * height, 4, 13);
    });
    ctx.shadowBlur = 0;
    if (
      image.complete &&
      (state.invulnerable <= 0 || Math.floor(state.invulnerable * 8) % 2 === 0)
    )
      ctx.drawImage(
        image,
        state.player.x * width - (state.player.w * width) / 2,
        state.player.y * height - (state.player.h * height) / 2,
        state.player.w * width,
        state.player.h * height,
      );
    state.sparks.forEach((s) => {
      ctx.globalAlpha = Math.max(s.t * 2, 0);
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x * width, s.y * height, 4 + s.t * 5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }
  function pointerMove(e) {
    const rect = canvas.getBoundingClientRect();
    state.player.x = Math.max(
      0.1,
      Math.min(0.9, (e.clientX - rect.left) / rect.width),
    );
  }
  canvas.addEventListener("pointerdown", (e) => {
    canvas.setPointerCapture(e.pointerId);
    pointerMove(e);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (e.buttons) pointerMove(e);
  });
  document
    .querySelector("#left-button")
    .addEventListener("pointerdown", () => move(-0.08));
  document
    .querySelector("#right-button")
    .addEventListener("pointerdown", () => move(0.08));
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") move(-0.06);
    if (e.key === "ArrowRight") move(0.06);
    if (e.key === " " && !state.running) start();
  });
  playButton.addEventListener("click", start);
  window.addEventListener("resize", resize);
  resize();
  draw(0);
  image.onload = () => draw(0);
})();
