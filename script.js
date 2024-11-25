let snake;
let rez = 20;
let food;
let w;
let h;
let questionAsked = false;
let gameOver = false;
let correctAnswer = '42';
let message = '';

// Setup Snake game canvas
function setup() {
  createCanvas(400, 400);
  w = floor(width / rez);
  h = floor(height / rez);
  frameRate(10);
  snake = new Snake();
  foodLocation();
}

// Function to set food's random position
function foodLocation() {
  let x = floor(random(w));
  let y = floor(random(h));
  food = createVector(x, y);
}

// Handle Snake's movement
function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    snake.setDir(-1, 0);
  } else if (keyCode === RIGHT_ARROW) {
    snake.setDir(1, 0);
  } else if (keyCode === DOWN_ARROW) {
    snake.setDir(0, 1);
  } else if (keyCode === UP_ARROW) {
    snake.setDir(0, -1);
  }
}

// Main draw function for Snake game
function draw() {
  scale(rez);
  background(220);

  if (gameOver) {
    triggerQuiz();
    return;
  }

  if (snake.eat(food)) {
    foodLocation();
  }

  snake.update();
  snake.show();

  noStroke();
  fill(255, 0, 0);
  rect(food.x, food.y, 1, 1);

  if (snake.endGame()) {
    gameOver = true;
  }
}

// Display end game and trigger quiz
function triggerQuiz() {
  // Show the quiz question
  const questionElement = document.getElementById('question');
  const answerInput = document.getElementById('answer');
  const submitButton = document.getElementById('submit-answer');
  const feedbackElement = document.getElementById('feedback');

  questionElement.textContent = 'What is 6 * 7?';
  answerInput.style.display = 'block';
  submitButton.style.display = 'block';
  feedbackElement.style.display = 'none';

  submitButton.addEventListener('click', () => checkAnswer(feedbackElement));
  answerInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      checkAnswer(feedbackElement);
    }
  });
}

// Check the answer and display result
function checkAnswer(feedbackElement) {
  const userAnswer = document.getElementById('answer').value.trim();

  if (userAnswer === correctAnswer) {
    feedbackElement.textContent = 'Correct! You can continue the game!';
    feedbackElement.style.color = 'green';
    resetGame();
  } else {
    feedbackElement.textContent = 'Wrong! The correct answer is 42.';
    feedbackElement.style.color = 'red';
  }

  // Hide the input and button after 2 seconds
  setTimeout(() => {
    document.getElementById('answer').value = '';
    feedbackElement.textContent = '';
    document.getElementById('answer').style.display = 'none';
    document.getElementById('submit-answer').style.display = 'none';
  }, 2000);
}

// Reset the game to continue after correct answer
function resetGame() {
  gameOver = false;
  snake = new Snake();
  foodLocation();
  loop();  // Resume the game loop
}

// Snake class for game functionality
class Snake {
  constructor() {
    this.body = [];
    this.body[0] = createVector(floor(w / 2), floor(h / 2));
    this.xdir = 0;
    this.ydir = 0;
    this.len = 0;
  }

  setDir(x, y) {
    this.xdir = x;
    this.ydir = y;
  }

  update() {
    let head = this.body[this.body.length - 1].copy();
    this.body.shift();

    head.x += this.xdir;
    head.y += this.ydir;
    this.body.push(head);
  }

  grow() {
    let head = this.body[this.body.length - 1].copy();
    this.body.push(head);
    this.len++;
  }

  endGame() {
    let x = this.body[this.body.length - 1].x;
    let y = this.body[this.body.length - 1].y;
    if (x > w - 1 || x < 0 || y > h - 1 || y < 0) {
      return true;
    }
    for (let i = 0; i < this.body.length - 1; i++) {
      let part = this.body[i];
      if (part.x === x && part.y === y) {
        return true;
      }
    }
    return false;
  }

  eat(pos) {
    let x = this.body[this.body.length - 1].x;
    let y = this.body[this.body.length - 1].y;
    if (x === pos.x && y === pos.y) {
      this.grow();
      return true;
    }
    return false;
  }

  show() {
    for (let i = 0; i < this.body.length; i++) {
      fill(0);
      noStroke();
      rect(this.body[i].x, this.body[i].y, 1, 1);
    }
  }
}
