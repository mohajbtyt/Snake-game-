
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let snake = [{x: 10, y: 10}];
let direction = 'RIGHT';
let food = {x: 5, y: 5};
let score = 0;
let coins = 0;
let speed = 200;
let gameLoop;
let gameOver = false;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'green';
  snake.forEach(part => ctx.fillRect(part.x * 20, part.y * 20, 20, 20));
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * 20, food.y * 20, 20, 20);
  ctx.fillStyle = 'black';
  ctx.fillText(`النقاط: ${score} | نقود: ${coins}`, 10, canvas.height - 10);
}

function update() {
  if (gameOver) return;

  const head = { ...snake[0] };
  if (direction === 'UP') head.y--;
  else if (direction === 'DOWN') head.y++;
  else if (direction === 'LEFT') head.x--;
  else if (direction === 'RIGHT') head.x++;

  if (
    head.x < 0 || head.y < 0 ||
    head.x >= canvas.width / 20 || head.y >= canvas.height / 20 ||
    snake.some(part => part.x === head.x && part.y === head.y)
  ) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    coins += 4;
    placeFood();
  } else {
    snake.pop();
  }

  draw();
}

function placeFood() {
  food = {
    x: Math.floor(Math.random() * (canvas.width / 20)),
    y: Math.floor(Math.random() * (canvas.height / 20))
  };
}

function updateDirection(dir) {
  if (
    (dir === 'UP' && direction !== 'DOWN') ||
    (dir === 'DOWN' && direction !== 'UP') ||
    (dir === 'LEFT' && direction !== 'RIGHT') ||
    (dir === 'RIGHT' && direction !== 'LEFT')
  ) {
    direction = dir;
  }
}

function loop() {
  update();
}

function startGame() {
  snake = [{x: 10, y: 10}];
  direction = 'RIGHT';
  score = 0;
  coins = 0;
  speed = 200;
  gameOver = false;
  placeFood();
  draw();
  clearInterval(gameLoop);
  gameLoop = setInterval(loop, speed);
}

function restartGame() {
  document.getElementById('gameOverScreen').style.display = 'none';
  startGame();
}

function endGame() {
  clearInterval(gameLoop);
  gameOver = true;
  document.getElementById('gameOverScreen').style.display = 'block';
}

function buyUpgrade(type) {
  if (type === 'speed' && coins >= 10) {
    speed = Math.max(50, speed - 30);
    coins -= 10;
    restartLoop();
  } else if (type === 'slow' && coins >= 15) {
    speed += 50;
    coins -= 15;
    restartLoop();
  } else if (type === 'goldApple' && coins >= 20) {
    coins -= 20;
  } else if (type === 'skin' && coins >= 25) {
    coins -= 25;
  }
}

function restartLoop() {
  clearInterval(gameLoop);
  gameLoop = setInterval(loop, speed);
}

document.getElementById('storeBtn').onclick = () => {
  document.getElementById('store').style.display = 'block';
};

function closeStore() {
  document.getElementById('store').style.display = 'none';
}

startGame();
