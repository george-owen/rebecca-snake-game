let snake;
let food;
let gridSize = 20;
let cols, rows;
let isGameOver = false;
let question, options, correctAnswer;
let userAnswer;

function setup() {
  createCanvas(400, 400);
  frameRate(10);

  cols = floor(width / gridSize);
  rows = floor(height / gridSize);

  snake = new Snake();
  placeFood();

  // Example quiz question and options
  question = "What is 2 + 2?";
  options = ["3", "4", "5", "6"];
  correctAnswer = "4";  // Correct answer
  userAnswer = "";
}

function draw() {
  background(220);

  if (isGameOver) {
    showQuiz();
  } else {
    if (snake.update()) {
      isGameOver = true;
      noLoop(); // Stop the game loop
    }

    snake.show();

    if (snake.eat(food)) {
      placeFood();
    }

    drawFood();
  }
}

function showQuiz() {
  textSize(24);
  fill(0);
  textAlign(CENTER, CENTER);
  text(question, width / 2, height / 4);

  // Display options
  for (let i = 0; i < options.length; i++) {
    textSize(18);
    text(options[i], width / 2, height / 2 + i * 30);
  }

  // Show user input and prompt for answer
  if (userAnswer !== "") {
    textSize(20);
    if (userAnswer === correctAnswer) {
      text("Correct! Press any key to revive!", width / 2, height / 2 + options.length * 30);
    } else {
      text("Incorrect. Game Over!", width / 2, height / 2 + options.length * 30);
    }
  }
}

function keyPressed() {
  if (isGameOver) {
    // Check if the answer is correct
    if (key === '1') {
      userAnswer = options[0];
    } else if (key === '2') {
      userAnswer = options[1];
    } else if (key === '3') {
      userAnswer = options[2];
    } else if (key === '4') {
      userAnswer = options[3];
    }

    // If the answer is correct, revive the snake
    if (userAnswer === correctAnswer) {
      reviveSnake();
    } else {
      // If incorrect, stay in the game over state
      userAnswer = "Incorrect. Game Over!";
    }
  } else {
    if (keyCode === UP_ARROW) snake.setDirection(0, -1);
    else if (keyCode === DOWN_ARROW) snake.setDirection(0, 1);
    else if (keyCode === LEFT_ARROW) snake.setDirection(-1, 0);
    else if (keyCode === RIGHT_ARROW) snake.setDirection(1, 0);
  }
}

function reviveSnake() {
  snake = new Snake(); // Reset the snake
  placeFood(); // Place new food
  isGameOver = false; // Continue the game
  userAnswer = ""; // Reset user answer
  loop(); // Restart the game loop
}

class Snake {
  constructor() {
    this.body = [createVector(floor(cols / 2), floor(rows / 2))];
    this.direction = createVector(0, 0);
    this.growing = false;
  }

  update() {
    if (this.direction.x === 0 && this.direction.y === 0) {
      return false; // Snake hasn't moved yet
    }

    let head = this.body[0].copy();
    head.add(this.direction);

    if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
      return true; // Game over (edges)
    }

    for (let part of this.body) {
      if (head.equals(part)) {
        return true; // Game over (self-collision)
      }
    }

    this.body.unshift(head);

    if (!this.growing) {
      this.body.pop();
    } else {
      this.growing = false;
    }

    return false; // No collision, game continues
  }

  show() {
    fill(0);
    for (let part of this.body) {
      rect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
    }
  }

  setDirection(x, y) {
    if (this.body.length > 1) {
      let nextPos = p5.Vector.add(this.body[0], createVector(x, y));
      if (nextPos.equals(this.body[1])) return;
    }
    this.direction = createVector(x, y);
  }

  eat(pos) {
    if (this.body[0].equals(pos)) {
      this.growing = true;
      return true;
    }
    return false;
  }
}

function placeFood() {
  food = createVector(floor(random(cols)), floor(random(rows)));

  for (let part of snake.body) {
    if (food.equals(part)) {
      placeFood();
      return;
    }
  }
}

function drawFood() {
  fill(255, 0, 0);
  rect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}
