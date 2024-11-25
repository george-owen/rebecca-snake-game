let snake;
let rez = 20;
let food;
let w;
let h;
let inQuiz = false; // Controls quiz state
let gameOver = false;
let questionsCorrect = 0; // Tracks correct answers
let totalScore = 0; // Tracks cumulative score
let currentGamePoints = 0; // Points in the current snake game
let currentQuestionIndex = null; // Prevent consecutive repetition
let questions = [
  { question: 'What is 6 * 7?', answer: '42' },
  { question: 'What is 12 / 4?', answer: '3' },
  { question: 'What is 5 + 8?', answer: '13' },
  { question: 'What is 9 - 3?', answer: '6' },
  { question: 'What is 10 * 2?', answer: '20' }
];

function setup() {
  createCanvas(400, 400);
  w = floor(width / rez);
  h = floor(height / rez);
  frameRate(10);
  snake = new Snake();
  foodLocation();
  updateScores();
}

function foodLocation() {
  let x = floor(random(w));
  let y = floor(random(h));
  food = createVector(x, y);
}

function keyPressed() {
  if (!inQuiz) {
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
}

function draw() {
  scale(rez);
  background(220);

  if (gameOver) {
    if (!inQuiz) triggerQuiz();
    return;
  }

  if (snake.eat(food)) {
    foodLocation();
    currentGamePoints++; // Increase current game points
    updateScores();
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

function triggerQuiz() {
  inQuiz = true;

  // Select a new random question
  let newQuestionIndex;
  do {
    newQuestionIndex = Math.floor(Math.random() * questions.length);
  } while (newQuestionIndex === currentQuestionIndex); // Prevent consecutive repetition
  currentQuestionIndex = newQuestionIndex;
  let currentQuestion = questions[currentQuestionIndex];

  // Show the quiz
  const questionElement = document.getElementById('question');
  const answerInput = document.getElementById('answer');
  const submitButton = document.getElementById('submit-answer');
  const feedbackElement = document.getElementById('feedback');

  questionElement.textContent = currentQuestion.question;
  answerInput.style.display = 'block';
  submitButton.style.display = 'block';
  feedbackElement.style.display = 'none';

  // Add event listeners for answer submission
  submitButton.onclick = () => handleAnswer(currentQuestion.answer);
  answerInput.onkeydown = (event) => {
    if (event.key === 'Enter') {
      handleAnswer(currentQuestion.answer);
    }
  };
}

function handleAnswer(correctAnswer) {
  const userAnswer = document.getElementById('answer').value.trim();
  const feedbackElement = document.getElementById('feedback');

  if (userAnswer === correctAnswer) {
    feedbackElement.textContent = 'Correct! You can continue the game!';
    feedbackElement.style.color = 'green';
    questionsCorrect++;
    totalScore += currentGamePoints * questionsCorrect; // Update total score
    resetGame();
  } else {
    feedbackElement.textContent = 'Wrong! Try again.';
    feedbackElement.style.color = 'red';
  }

  feedbackElement.style.display = 'block';
  updateScores();
}

function resetGame() {
  // Reset game state
  gameOver = false;
  inQuiz = false;
  snake = new Snake();
  foodLocation();
  currentGamePoints = 0; // Reset current game points
  updateScores();

  // Clear input and feedback
  document.getElementById('answer').value = '';
  document.getElementById('answer').style.display = 'none';
  document.getElementById('submit-answer').style.display = 'none';
  document.getElementById('feedback').style.display = 'none';

  loop(); // Resume the game loop
}

function updateScores() {
  document.getElementById('current-score').textContent = `Current Game Points: ${currentGamePoints}`;
  document.getElementById('questions-correct').textContent = `Questions Correct: ${questionsCorrect}`;
  document.getElementById('total-score').textContent = `Total Score: ${totalScore}`;
}

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
