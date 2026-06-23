"use strict";

const BARCELONA_START = 92;
const BARCELONA_LEVELS = 103;
const BARCELONA_END = BARCELONA_START + BARCELONA_LEVELS - 1;
const PROGRESS_KEY = "photoWorldProgress";

// Fold the route across Barcelona in wide boulevards instead of one long descent.
// Eight levels fill each row, then the road drops and reverses direction. The
// final memory sits lower than the rest so Madrid can connect beneath it later.
const LEVELS_PER_ROW = 8;
const ROUTE_ROWS = Math.ceil(BARCELONA_LEVELS / LEVELS_PER_ROW);
const positions = Array.from({ length: BARCELONA_LEVELS }, (_, index) => {
    const row = Math.floor(index / LEVELS_PER_ROW);
    const column = index % LEVELS_PER_ROW;
    const directionColumn = row % 2 === 0 ? column : LEVELS_PER_ROW - 1 - column;
    const position = [8 + directionColumn * 9, 4 + row * (91 / (ROUTE_ROWS - 1))];

    if (index === BARCELONA_LEVELS - 1) position[1] = 98;
    return position;
});

let vocabulary = [];
let currentLevel = null;
let currentQuestion = null;
let correctAnswer = "";

const map = document.getElementById("barcelonaMap");
const pathSvg = document.getElementById("barcelonaPath");
const message = document.getElementById("spainMessage");
const questionPanel = document.getElementById("questionPanel");
const questionTitle = document.getElementById("questionTitle");
const questionText = document.getElementById("questionText");
const questionChoices = document.getElementById("questionChoices");
const questionResult = document.getElementById("questionResult");
const closeQuestionButton = document.getElementById("closeQuestion");
const photoPanel = document.getElementById("photoPanel");
const photoTitle = document.getElementById("photoTitle");
const photoImage = document.getElementById("photoImage");
const closePhotoButton = document.getElementById("closePhoto");

function getProgress() {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{"highestUnlocked":1}');
}

function saveProgress(progress) {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

function shuffle(items) {
    return [...items].sort(() => Math.random() - 0.5);
}

function addRoad(start, end, color, width, dash = "") {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", start[0]);
    line.setAttribute("y1", start[1]);
    line.setAttribute("x2", end[0]);
    line.setAttribute("y2", end[1]);
    line.setAttribute("stroke", color);
    line.setAttribute("stroke-width", width);
    line.setAttribute("stroke-linecap", "round");
    if (dash) line.setAttribute("stroke-dasharray", dash);
    pathSvg.appendChild(line);
}

function drawPath(progress) {
    pathSvg.innerHTML = "";
    for (let index = 0; index < positions.length - 1; index++) {
        const level = BARCELONA_START + index;
        const color = level < progress.highestUnlocked ? "#ffd65f" : "rgba(255,255,255,.78)";
        addRoad(positions[index], positions[index + 1], "rgba(45,20,58,.88)", "1.55");
        addRoad(positions[index], positions[index + 1], color, ".38", "1 1.6");
    }
}

function buildBarcelona() {
    const progress = getProgress();
    map.querySelectorAll(".levelButton").forEach(button => button.remove());
    drawPath(progress);

    positions.forEach((position, index) => {
        const level = BARCELONA_START + index;
        const button = document.createElement("button");
        button.type = "button";
        button.className = "levelButton";
        button.textContent = level;
        button.setAttribute("aria-label", "Barcelona level " + level);
        button.style.left = position[0] + "%";
        button.style.top = position[1] + "%";

        if (level < progress.highestUnlocked) button.classList.add("completed");
        if (level === progress.highestUnlocked) button.classList.add("current");

        button.addEventListener("click", () => openLevel(level));
        map.appendChild(button);
    });

    const complete = Math.max(0, Math.min(progress.highestUnlocked - BARCELONA_START, BARCELONA_LEVELS));
    if (progress.highestUnlocked < BARCELONA_START) {
        message.textContent = "Finish Eilat level 91 to unlock Barcelona level 92.";
    } else if (progress.highestUnlocked <= BARCELONA_END) {
        message.textContent = "Barcelona: " + complete + " / " + BARCELONA_LEVELS + " memories unlocked.";
    } else {
        message.textContent = "Barcelona complete • Madrid will begin at level 195.";
    }
}

function openLevel(level) {
    const progress = getProgress();
    if (level < progress.highestUnlocked) {
        showPhoto(level);
    } else if (level > progress.highestUnlocked) {
        message.textContent = progress.highestUnlocked < BARCELONA_START
            ? "Finish Eilat level 91 before beginning Spain."
            : "Complete the previous Barcelona level first.";
    } else {
        startQuestion(level);
    }
}

function startQuestion(level) {
    if (vocabulary.length < 4) {
        message.textContent = "The vocabulary file needs at least four words.";
        return;
    }

    currentLevel = level;
    currentQuestion = shuffle(vocabulary)[0];
    correctAnswer = currentQuestion.explanation;
    questionTitle.textContent = "Barcelona Level " + level;
    questionText.textContent = 'What does "' + currentQuestion.word + '" mean?';
    questionChoices.innerHTML = "";
    questionResult.textContent = "";
    closeQuestionButton.hidden = true;

    const wrong = shuffle(vocabulary.filter(item => item.word !== currentQuestion.word)).slice(0, 3);
    const choices = shuffle([
        { item: currentQuestion, label: correctAnswer, correct: true },
        ...wrong.map(item => ({ item, label: item.explanation, correct: false }))
    ]);

    choices.forEach(choice => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = choice.label;
        button.addEventListener("click", () => checkAnswer(choice));
        questionChoices.appendChild(button);
    });
    questionPanel.style.display = "flex";
}

function checkAnswer(choice) {
    questionChoices.querySelectorAll("button").forEach(button => {
        button.disabled = true;
        if (button.textContent === correctAnswer) button.style.borderColor = "#259d55";
        if (!choice.correct && button.textContent === choice.label) button.style.borderColor = "#d94848";
    });

    if (choice.correct) {
        const progress = getProgress();
        progress.highestUnlocked = Math.max(progress.highestUnlocked, currentLevel + 1);
        saveProgress(progress);
        questionResult.innerHTML = "Correct! Photo unlocked.<br><strong>Definition:</strong> " +
            (currentQuestion.explanation || "") + "<br><strong>Example:</strong> " + (currentQuestion.example || "");
        closeQuestionButton.textContent = "See Photo";
    } else {
        questionResult.innerHTML = "Incorrect.<br><strong>Correct definition:</strong> " + correctAnswer +
            "<br><strong>Your choice belongs to:</strong> " + choice.item.word;
        closeQuestionButton.textContent = "Try Again Later";
    }
    closeQuestionButton.hidden = false;
}

function showPhoto(level) {
    photoTitle.textContent = "Barcelona Level " + level;
    photoImage.src = "game_photos/g" + level + ".jpg";
    photoPanel.style.display = "flex";
}

closeQuestionButton.addEventListener("click", () => {
    const showUnlockedPhoto = closeQuestionButton.textContent === "See Photo";
    questionPanel.style.display = "none";
    buildBarcelona();
    if (showUnlockedPhoto && currentLevel) showPhoto(currentLevel);
});

closePhotoButton.addEventListener("click", () => {
    photoPanel.style.display = "none";
    buildBarcelona();
});

fetch("vocabulary_template.json")
    .then(response => response.json())
    .then(words => {
        vocabulary = words;
        buildBarcelona();
    })
    .catch(() => {
        message.textContent = "Could not load vocabulary_template.json";
        buildBarcelona();
    });
