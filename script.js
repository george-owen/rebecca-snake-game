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
let wrongAnswers = 0; // Track wrong answers
let maxWrongAnswers = 3; // Maximum wrong answers before real game over
let questions = [
  { question: 'Who wrote "Rebecca" (Last name)?', answer: 'DuMaurier' },
  { question: 'What genre is "Rebecca"?', answer: 'Gothic' },
  { question: 'Where is the story of "Rebecca" set?', answer: 'Manderley' },
  { question: 'Who is the antagonist in "Rebecca" (Last name)?', answer: 'Danvers' },
  { question: 'What is the name of Maxim’s first wife?', answer: 'Rebecca' },
  { question: 'What literary period is "Rebecca" associated with?', answer: '1930s' },
  { question: 'What was Rebecca’s relationship with Jack Favell?', answer: 'Cousins' },
  { question: 'What was the name of the head servant at Manderley?', answer: 'Danvers' },
  { question: 'What ultimately happens to Manderley?', answer: 'Burns' },
  { question: 'Complete the quote: "Rebecca had ____, you see. A growth of the uterus."', answer: 'Cancer' },
  { question: 'Complete the quote: "Last night I dreamt I went to ____ again."', answer: 'Manderley' },
  { question: 'Complete the quote: "You are so different from ____."', answer: 'Rebecca' },
  { question: 'Complete the quote: "I hated her. I tell you, I hated her. I wanted to kill her. But I didn’t kill her. She wanted me to kill her. She lied to me about being ____."', answer: 'Pregnant' },
  { question: 'Complete the quote: "The white dress—it was the same one ____ wore."', answer: 'Rebecca' },
  { question: 'Who suggests the narrator’s costume for the ball?', answer: 'Danvers' },
  { question: 'What illness did Rebecca hide from everyone?', answer: 'Cancer' },
  { question: 'What is the name of the de Winter family dog?', answer: 'Jasper' },
  { question: 'Complete the quote: "The past cannot hurt you, unless you let it. ____ is dead."', answer: 'Rebecca' },
  { question: 'What object is used to symbolize Rebecca’s lingering presence?', answer: 'Boat' },
  { question: 'Who is the narrator’s closest ally at Manderley? (Last name)', answer: 'Crawley' },
  { question: 'What color is Rebecca’s monogram?', answer: 'Black' }
];

function setup() {
  const canvas = createCanvas(400, 400);
  canvas.parent('game'); // Attach the canvas to the game div
  w = floor(width / rez);
  h = floor(height / rez);
  frameRate(10);
  snake = new Snake();
  foodLocation();
  updateScores();

  // Add event listener for reset button
  document.getElementById('reset-btn').addEventListener('click', resetFullGame);

  // Add event listeners for quiz submission
  document.getElementById('submit-answer').addEventListener('click', submitQuizAnswer);
  document.getElementById('answer').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      submitQuizAnswer();
    }
  });
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
  const questionElement = document.getElementById('question');
  const answerInput = document.getElementById('answer');
  const feedbackElement = document.getElementById('feedback');

  const questionIndex = Math.floor(Math.random() * questions.length);
  questionElement.textContent = questions[questionIndex].question;
  answerInput.value = '';
  feedbackElement.textContent = '';
}

function submitQuizAnswer() {
  const answerInput = document.getElementById('answer');
  const feedbackElement = document.getElementById('feedback');
  const questionText = document.getElementById('question').textContent;

  const correctAnswer = questions.find((q) => q.question === questionText).answer;
  const userAnswer = answerInput.value.trim();

  if (userAnswer === correctAnswer) {
    feedbackElement.textContent = 'Correct! Resuming game.';
    feedbackElement.style.color = 'green';
    questionsCorrect++;
    
    // Add the current game points to total score when the answer is correct
    totalScore += currentGamePoints; 

    resetGame();
  } else {
    feedbackElement.textContent = 'Wrong answer!';
    feedbackElement.style.color = 'red';
    wrongAnswers++;
    if (wrongAnswers >= maxWrongAnswers) endGameFully();
  }
  updateScores();
}

function resetGame() {
  gameOver = false;
  inQuiz = false;
  snake = new Snake();
  foodLocation();
  currentGamePoints = 0;
  loop(); // Resume the game loop
}

function resetFullGame() {
  questionsCorrect = 0;
  totalScore = 0;
  currentGamePoints = 0;
  wrongAnswers = 0;
  resetGame();
}

function endGameFully() {
  noLoop();
  document.getElementById('question').textContent = 'Game Over! Please press: Reset Game';
}

function updateScores() {
  document.getElementById('current-score').textContent = `Current Game Points: ${currentGamePoints}`;
  document.getElementById('questions-correct').textContent = `Questions Correct: ${questionsCorrect}`;
  document.getElementById('total-score').textContent = `Total Score: ${totalScore}`;
  document.getElementById('wrong-answers').textContent = `Wrong Answers: ${wrongAnswers}/${maxWrongAnswers}`;
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
    head.add(createVector(this.xdir, this.ydir));
    this.body.push(head);
  }

  grow() {
    let head = this.body[this.body.length - 1].copy();
    this.body.push(head);
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
