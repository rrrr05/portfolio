(function() {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const loader = document.getElementById('gameLoader');
  const skipBtn = document.getElementById('gameSkip');
  const gameBar = document.getElementById('gameBar');
  const gamePct = document.getElementById('gamePct');

  const W = 600, H = 300;
  canvas.width = W;
  canvas.height = H;

  let progress = 0;
  let carX = 100;
  let carY = 220;
  let speed = 2;
  let roadOffset = 0;
  let trees = [];
  let checkpoints = [];
  let checkpointsPassed = 0;
  let particles = [];
  let stars = [];
  let gameRunning = true;
  let keys = {};

  for (let i = 0; i < 80; i++) {
    stars.push({ x: Math.random() * W, y: Math.random() * 180, size: Math.random() * 2 + 0.5, blink: Math.random() * Math.PI * 2 });
  }

  for (let i = 0; i < 8; i++) {
    trees.push({ x: 100 + i * 70 + Math.random() * 30, h: 30 + Math.random() * 40 });
  }

  for (let i = 0; i < 3; i++) {
    checkpoints.push({ x: 200 + i * 160, collected: false });
  }

  function drawPixelCar(x, y) {
    ctx.fillStyle = '#00ff9d';
    ctx.fillRect(x, y, 30, 14);
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(x + 4, y + 2, 10, 6);
    ctx.fillRect(x + 18, y + 2, 8, 6);
    ctx.fillStyle = '#e6ff00';
    ctx.fillRect(x + 28, y + 3, 4, 3);
    ctx.fillRect(x + 28, y + 8, 4, 3);
    ctx.fillStyle = '#ff2d7b';
    ctx.fillRect(x - 2, y + 3, 4, 3);
    ctx.fillRect(x - 2, y + 8, 4, 3);
    ctx.fillStyle = '#333';
    ctx.fillRect(x + 4, y + 14, 8, 3);
    ctx.fillRect(x + 18, y + 14, 8, 3);
  }

  function drawTree(x, h) {
    ctx.fillStyle = '#1a3a1a';
    ctx.fillRect(x, 230 - h, 6, h);
    ctx.fillStyle = '#006622';
    for (let i = 0; i < 3; i++) {
      const s = 16 - i * 4;
      ctx.fillRect(x - s / 2 + 3, 230 - h - 10 - i * 12, s, 14);
    }
  }

  function drawCheckpoint(cp) {
    if (cp.collected) return;
    const x = ((cp.x - roadOffset) % W + W) % W;
    ctx.fillStyle = '#e6ff00';
    ctx.fillRect(x, 200, 16, 30);
    ctx.fillStyle = '#0a0a0a';
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillText('★', x + 3, 220);
  }

  function updateBar() {
    const filled = Math.floor(progress / 10);
    const empty = 10 - filled;
    gameBar.textContent = '[' + '█'.repeat(filled) + '░'.repeat(empty) + ']';
    gamePct.textContent = Math.floor(progress) + '%';
  }

  function spawnParticle(x, y) {
    particles.push({ x, y, vx: -Math.random() * 2 - 1, vy: (Math.random() - 0.5) * 2, life: 20, color: ['#00ff9d','#e6ff00','#ff2d7b','#0066ff'][Math.floor(Math.random()*4)] });
  }

  function gameLoop() {
    if (!gameRunning) return;

    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, W, H);

    const time = Date.now() / 1000;
    stars.forEach(s => {
      const alpha = 0.3 + Math.sin(time + s.blink) * 0.3;
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fillRect(s.x, s.y, s.size, s.size);
    });

    ctx.strokeStyle = '#1a0a2e';
    ctx.lineWidth = 1;
    for (let y = 0; y < 180; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    ctx.fillStyle = '#0f0a1a';
    ctx.fillRect(0, 240, W, 60);

    roadOffset = (roadOffset + speed) % 40;

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 230, W, 2);

    ctx.fillStyle = '#333355';
    ctx.fillRect(0, 235, W, 50);

    ctx.fillStyle = '#444466';
    for (let x = -roadOffset; x < W; x += 40) {
      ctx.fillRect(x, 258, 20, 3);
    }

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 285, W, 2);

    trees.forEach(t => {
      const tx = ((t.x - roadOffset * 0.3) % (W + 40) + W + 40) % (W + 40) - 20;
      drawTree(tx, t.h);
    });

    checkpoints.forEach(cp => drawCheckpoint(cp));

    if (keys['ArrowLeft'] || keys['KeyA']) carX -= 3;
    if (keys['ArrowRight'] || keys['KeyD']) carX += 3;
    carX = Math.max(10, Math.min(W - 40, carX));

    if (keys['ArrowUp'] || keys['KeyW']) { speed = 4; carY = Math.max(200, carY - 1); }
    else if (keys['ArrowDown'] || keys['KeyS']) { speed = 1; carY = Math.min(250, carY + 1); }
    else { speed = 2; carY += (220 - carY) * 0.05; }

    if (Math.random() < 0.3) spawnParticle(carX - 2, carY + 10);

    particles.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy; p.life--;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life / 20;
      ctx.fillRect(p.x, p.y, 2, 2);
      ctx.globalAlpha = 1;
    });
    particles = particles.filter(p => p.life > 0);

    drawPixelCar(carX, carY);

    checkpoints.forEach(cp => {
      if (cp.collected) return;
      const cx = ((cp.x - roadOffset) % W + W) % W;
      if (Math.abs(carX - cx) < 30 && Math.abs(carY - 215) < 30) {
        cp.collected = true;
        checkpointsPassed++;
        progress += 33;
        for (let i = 0; i < 20; i++) spawnParticle(cx, 215);
      }
    });

    if (progress < 100) {
      progress += 0.15;
      if (progress > 100) progress = 100;
    }

    updateBar();

    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillStyle = '#555';
    ctx.fillText('ЧЕКПОИНТЫ: ' + checkpointsPassed + '/3', 10, 20);

    if (progress < 34) { ctx.fillStyle = '#555'; ctx.fillText('HERO...', 10, 35); }
    else if (progress < 67) { ctx.fillStyle = '#e6ff00'; ctx.fillText('ПРОЕКТЫ...', 10, 35); }
    else if (progress < 100) { ctx.fillStyle = '#0066ff'; ctx.fillText('КОНТАКТЫ...', 10, 35); }
    else { ctx.fillStyle = '#00ff9d'; ctx.fillText('ГОТОВО!', 10, 35); }

    if (progress >= 100) {
      setTimeout(() => {
        loader.classList.add('hidden');
        gameRunning = false;
      }, 800);
      return;
    }

    requestAnimationFrame(gameLoop);
  }

  document.addEventListener('keydown', e => {
    if (!gameRunning) return;
    if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','KeyA','KeyD','KeyW','KeyS'].includes(e.code)) {
      e.preventDefault();
      keys[e.code] = true;
    }
  });

  document.addEventListener('keyup', e => {
    keys[e.code] = false;
  });

  skipBtn.addEventListener('click', () => {
    progress = 100;
    updateBar();
    loader.classList.add('hidden');
    gameRunning = false;
  });

  gameLoop();
})();
