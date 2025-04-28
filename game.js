let gameArea;
let player;
let playerFrames = [];
let currentPlayerFrame = 0;
let frameCount = 0;
let playerY = 300;
let velocityY = 0;
let gravity = 0.8;
let jumpForce = 15;
let isJumping = false;
let obstacles = [];
let gameLoopId;
let playerAnimationId;
let gameRunning = false;

function startGame() {
  if (gameRunning) return; // prevent multiple starts
  gameRunning = true;

  // Create game area
  gameArea = document.createElement('div');
  gameArea.id = 'game-area';
  gameArea.style.position = 'relative';
  gameArea.style.width = '100%';
  gameArea.style.height = '400px';
  gameArea.style.overflow = 'hidden';
  gameArea.style.background = '#eef';
  document.getElementById('game-container').appendChild(gameArea);

  // Load player frames
  for (let i = 1; i <= 7; i++) {
    playerFrames.push(`game-assets/Character/run/run_Animation 1_${i}.png`);
  }

  // Create player element
  player = document.createElement('img');
  player.src = playerFrames[0];
  player.style.position = 'absolute';
  player.style.left = '50px';
  player.style.bottom = '0px';
  player.style.width = '60px';
  player.style.height = '60px';
  gameArea.appendChild(player);

  // Event listeners
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('click', handleJump);

  // Start game loops
  gameLoopId = requestAnimationFrame(updateGame);
  playerAnimationId = setInterval(animatePlayer, 100); // change frame every 100ms
}

function animatePlayer() {
  currentPlayerFrame = (currentPlayerFrame + 1) % playerFrames.length;
  player.src = playerFrames[currentPlayerFrame];
}

function handleKeyDown(e) {
  if (e.code === 'Space') {
    handleJump();
  } else if (e.code === 'Escape') {
    stopGame();
  }
}

function handleJump() {
  if (!isJumping) {
    velocityY = -jumpForce;
    isJumping = true;
  }
}

function updateGame() {
    frameCount++;
  
    // Player jump physics
    velocityY += gravity;
    playerY -= velocityY;
    
    if (playerY < 0) {
      playerY = 0;
      velocityY = 0;
    }
  
    if (playerY > 0) {
      player.style.bottom = `${playerY}px`;
    } else {
      player.style.bottom = `0px`;
      isJumping = false;
    }
  
    // Spawn obstacles
    if (frameCount % 90 === 0) {
      createObstacle();
    }
  
    // Move obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
      const obs = obstacles[i];
      obs.style.left = `${parseInt(obs.style.left) - 5}px`;
  
      // Remove obstacles off-screen
      if (parseInt(obs.style.left) < -50) {
        // REMOVE from DOM and array
        if (obs.parentNode) {
          obs.parentNode.removeChild(obs);
        }
        obstacles.splice(i, 1);
      } 
      // Collision detection
      else if (isColliding(player, obs)) {
        stopGame();
        alert('Game Over! Press Launch again to retry.');
        return;
      }
    }
  
    gameLoopId = requestAnimationFrame(updateGame);
  }
  

  function createObstacle() {
    let obs = document.createElement('img');
    obs.src = 'game-assets/spikes.png';
    obs.style.position = 'absolute';
    obs.style.bottom = '0px';
    obs.style.width = '50px';
    obs.style.height = '30px';
  
    // Start just outside the visible game area on the right
    obs.style.left = `${gameArea.clientWidth}px`;
    
    gameArea.appendChild(obs);
    obstacles.push(obs);
  }
  

function isColliding(a, b) {
  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();

  return (
    aRect.left < bRect.right - 30 &&
    aRect.right > bRect.left + 30 &&
    aRect.top < bRect.bottom &&
    aRect.bottom > bRect.top
  );
}

function stopGame() {
    if (!gameRunning) return;
    gameRunning = false;
  
    cancelAnimationFrame(gameLoopId);
    clearInterval(playerAnimationId);
  
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('click', handleJump);
  
    // Remove all obstacles
    for (let obs of obstacles) {
      if (obs.parentNode) {
        obs.parentNode.removeChild(obs);
      }
    }
    obstacles = [];
  
    // Remove player
    if (player && player.parentNode) {
      player.parentNode.removeChild(player);
    }
    player = null;
  
    // Remove game area completely
    if (gameArea && gameArea.parentNode) {
      gameArea.parentNode.removeChild(gameArea);
    }
    gameArea = null;
  
    // Clear arrays
    playerFrames = [];
  }
  
