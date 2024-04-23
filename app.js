// Define HTML elements
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');

// Define game variables
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

// Draw game map, snake, food
function draw() {
  board.innerHTML = ''; // Clear the board
  drawSnake(); // Draw the snake
  drawFood(); // Draw the food
  updateScore(); // Update the score
}

// Draw snake
function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement('div', 'snake'); // Create a snake element
    setPosition(snakeElement, segment); // Set its position
    board.appendChild(snakeElement); // Add it to the board
  });
}

// Create a snake or food cube/div
function createGameElement(tag, className) {
  const element = document.createElement(tag); // Create a new HTML element
  element.className = className; // Set its class name
  return element; // Return the element
}

// Set the position of snake or food
function setPosition(element, position) {
  element.style.gridColumn = position.x; // Set the grid column
  element.style.gridRow = position.y; // Set the grid row
}

// Draw food function
function drawFood() {
  if (gameStarted) { // Check if the game has started
    const foodElement = createGameElement('div', 'food'); // Create a food element
    setPosition(foodElement, food); // Set its position
    board.appendChild(foodElement); // Add it to the board
  }
}

// Generate food
function generateFood() {
  const x = Math.floor(Math.random() * gridSize) + 1; // Generate a random x position
  const y = Math.floor(Math.random() * gridSize) + 1; // Generate a random y position
  return { x, y }; // Return the food position
}

// Moving the snake
function move() {
  const head = { ...snake[0] }; // Copy the head of the snake
  switch (direction) { // Move the head in the specified direction
    case 'up':
      head.y--;
      break;
    case 'down':
      head.y++;
      break;
    case 'left':
      head.x--;
      break;
    case 'right':
      head.x++;
      break;
  }

  snake.unshift(head); // Add the new head to the snake

  if (head.x === food.x && head.y === food.y) { // Check if the snake eats the food
    food = generateFood(); // Generate a new food
    increaseSpeed(); // Increase the game speed
    clearInterval(gameInterval); // Clear the game interval
    gameInterval = setInterval(() => { // Set a new game interval
      move(); // Move the snake
      checkCollision(); // Check for collisions
      draw(); // Redraw the game
    }, gameSpeedDelay);
  } else {
    snake.pop(); // Remove the tail of the snake
  }
}

// Start game function
function startGame() {
  gameStarted = true; // Set the game as started
  instructionText.style.display = 'none'; // Hide the instruction text
  logo.style.display = 'none'; // Hide the logo
  gameInterval = setInterval(() => { // Set the game interval
    move(); // Move the snake
    checkCollision(); // Check for collisions
    draw(); // Redraw the game
  }, gameSpeedDelay);
}

// Keypress event listener
function handleKeyPress(event) {
  if (
    (!gameStarted && event.code === 'Space') || // Check if the game is not started and the space bar is pressed
    (!gameStarted && event.key === ' ')
  ) {
    startGame(); // Start the game
  } else { // Otherwise, change the direction of the snake
    switch (event.key) {
      case 'ArrowUp':
        direction = 'up';
        break;
      case 'ArrowDown':
        direction = 'down';
        break;
      case 'ArrowLeft':
        direction = 'left';
        break;
      case 'ArrowRight':
        direction = 'right';
        break;
    }
  }
}

document.addEventListener('keydown', handleKeyPress); // Add keydown event listener

// Increase game speed
function increaseSpeed() {
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }
}

// Check for collisions
function checkCollision() {
  const head = snake[0]; // Get the head of the snake

  // Check if the head is out of bounds or collides with itself
  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame(); // Reset the game
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame(); // Reset the game
    }
  }
}

// Reset game
function resetGame() {
  updateHighScore(); // Update the high score
  stopGame(); // Stop the game
  snake = [{ x: 10, y: 10 }]; // Reset the snake position
  food = generateFood(); // Generate new food
  direction = 'right'; // Reset the direction
  gameSpeedDelay = 200; // Reset the game speed
  updateScore(); // Update the score
}

// Update the score
function updateScore() {
  const currentScore = snake.length - 1; // Calculate the current score
  score.textContent = currentScore.toString().padStart(3, '0'); // Update the score text
}

// Stop the game
function stopGame() {
  clearInterval(gameInterval); // Clear the game interval
  gameStarted = false; // Set the game as not started
  instructionText.style.display = 'block'; // Show the instruction text
  logo.style.display = 'block'; // Show the logo
}

// Update the high score
function updateHighScore() {
  const currentScore = snake.length - 1; // Calculate the current score
  if (currentScore > highScore) { // Check if the current score is higher than the high score
    highScore = currentScore; // Update the high score
    highScoreText.textContent = highScore.toString().padStart(3, '0'); // Update the high score text
  }
  highScoreText.style.display = 'block'; // Show the high score text
}
