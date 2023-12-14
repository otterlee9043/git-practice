const step = 20;
const failLimit = 5;
const windowWidth = 850;
const windowHeight = 700;
const wordList = [
  "물", "나무", "책", "학교", "사랑", "친구", "꽃", "하늘", "감사", "음악",
  "도시", "기쁨", "가족", "컴퓨터", "고양이", "개", "별", "바다", "산", "사진",
  "추억", "미소", "눈물", "꿈", "햇볕", "비", "눈", "손", "문화", "삶",
  "모자", "휴가", "열쇠", "옷", "하루", "선물",
];

// 주석 추가
let gameLoopId = null;

// new3 주석 추가

const container = document.querySelector("#window");
const score = document.querySelector("#score");
const input = document.querySelector("#word-input");
const fail = document.querySelector("#fail");

const startButton = document.querySelector("#start-button");
const restartButton = document.querySelector("#restart-button");
const stopButton = document.querySelector("#stop-button");

const scoreContainer = document.querySelector(".score-container");
const startBtnWrapper = document.querySelector(".start-btn-wrapper");
const playingBtnWrapper = document.querySelector(".playing-btn-wrapper");
const pauseWindow = document.querySelector(".pause");

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", restartGame);
stopButton.addEventListener("click", stopGame);
input.addEventListener("keydown", matchWord);

async function startGame() {
  await dropRain();
  startButton.removeEventListener("click", startGame);
  startBtnWrapper.classList.add("hidden");
  playingBtnWrapper.classList.remove("hidden");
}

async function dropRain() {
  let index = 0;
  gameLoopId = setInterval(() => {
    dropWord(wordList[index++], getRandomSpeed());
    if (index >= wordList.length) {
      clearInterval(gameLoopId);
      gameLoopId = null;
    }
  }, 1000);
}

// remote에서 주석 추가
async function dropWord(word, speed) {
  const wordElement = createWord(word, speed);

  const intervalId = setInterval(() => {
    const newTopPos = wordElement.offsetTop + step;
    if (newTopPos > windowHeight - 120) {
      const newFailCount = parseInt(fail.textContent) + 1;
      if (newFailCount > failLimit) {
        stopGame();
      }
      fail.textContent = newFailCount;
      wordElement.remove();
      clearInterval(intervalId);
    } else {
      wordElement.style.top = `${newTopPos}px`;
    }
  }, 2000 / speed);
  wordElement.setAttribute("intervalId", intervalId);
}

function createWord(word, speed) {
  const wordElement = document.createElement("span");
  wordElement.classList.add("word");
  wordElement.classList.add(`level-${speed}`);
  wordElement.setAttribute("word", word);
  wordElement.setAttribute("speed", speed);
  wordElement.style.left = `${getRandomXPos()}px`;
  wordElement.textContent = word;
  container.appendChild(wordElement);

  return wordElement;
}

function stopGame() {
  const floatingWords = document.querySelectorAll(".word");
  floatingWords.forEach((word) => {
    const intervalId = word.getAttribute("intervalId");
    clearInterval(intervalId);
  });
  clearInterval(gameLoopId);
  gameLoopId = null;
  pauseWindow.classList.remove("hidden");
  scoreContainer.classList.add("highlight");
}

function restartGame() {
  stopGame();
  scoreContainer.classList.remove("highlight");
  pauseWindow.classList.add("hidden");
  const floatingWords = document.querySelectorAll(".word");
  floatingWords.forEach((word) => {
    word.remove();
  });
  score.textContent = "0";
  fail.textContent = "0";
  input.value = "";
  startGame();
}

function matchWord(event) {
  if (event.code === "Enter") {
    const inputWord = event.target.value;
    const matchingWord = document.querySelector(`[word="${inputWord}"]`);
    if (matchingWord) {
      const wordLoopId = matchingWord.getAttribute("intervalId");
      const speed = matchingWord.getAttribute("speed");
      clearInterval(wordLoopId);
      score.textContent = parseInt(score.textContent) + 10 * speed;
      matchingWord.remove();
    }
    event.target.value = "";
  }
}

function getRandomSpeed() {
  return getRandomNumber(1, 5);
}

function getRandomXPos() {
  return getRandomNumber(0, windowWidth - 80);
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// 맨 마지막에 주석 추가
