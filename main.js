let snake; // Snake object
let food;  // Food position
let gridSize = 20; // Size of each grid cell
let cols, rows; // Number of columns and rows

function setup() {
  createCanvas(400, 400);
  frameRate(10);

  // Calculate the number of columns and rows based on grid size
  cols = floor(width / gridSize);
  rows = floor(height / gridSize);

  snake = new Snake();
  placeFood();
}

function draw() {
  background(220);

  // Update snake and check game over
  if (snake.update()) {
    textSize(32);
    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    text('Game Over', width / 2, height / 2);
    noLoop();
  }

  snake.show();

  if (snake.eat(food)) {
    placeFood();
  }

  drawFood();
}

// Snake class
class Snake {
  constructor() {
    this.body = [createVector(floor(cols / 2), floor(rows / 2))]; // Start in the middle
    this.direction = createVector(0, 0); // Start stationary
    this.growing = false;
  }

  update() {
    if (this.direction.x === 0 && this.direction.y === 0) {
      return false; // No movement yet
    }

    let head = this.body[0].copy(); // Get the current head position
    head.add(this.direction); // Move the head in the direction

    // Check for collisions with edges
    if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
      return true; // Game over
    }

    // Check for collisions with itself
    for (let part of this.body) {
      if (head.equals(part)) {
        return true; // Game over
      }
    }

    // Add new head
    this.body.unshift(head);

    // Remove tail unless growing
    if (!this.growing) {
      this.body.pop();
    } else {
      this.growing = false;
    }

    return false; // Not game over
  }

  show() {
    fill(0);
    for (let part of this.body) {
      rect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
    }
  }

  setDirection(x, y) {
    // Prevent reversing direction
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

  // Make sure the food doesn't spawn on the snake
  for (let part of snake.body) {
    if (food.equals(part)) {
      placeFood(); // Re-roll food position
      return;
    }
  }
}

function drawFood() {
  fill(255, 0, 0);
  rect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function keyPressed() {
  if (keyCode === UP_ARROW) snake.setDirection(0, -1);
  else if (keyCode === DOWN_ARROW) snake.setDirection(0, 1);
  else if (keyCode === LEFT_ARROW) snake.setDirection(-1, 0);
  else if (keyCode === RIGHT_ARROW) snake.setDirection(1, 0);
}
