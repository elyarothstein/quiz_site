"use strict";

const BARCELONA_START = 92;
const BARCELONA_LEVELS = 103;
const BARCELONA_END = BARCELONA_START + BARCELONA_LEVELS - 1;
const PROGRESS_KEY = "photoWorldProgress";

// Barcelona uses vertical street lanes: down, a rounded turn, up, then down
// again. Nine close lanes keep all 103 levels evenly spaced on a compact map.
const DESKTOP_COLUMN_COUNTS = [12, 12, 12, 12, 11, 11, 11, 11, 11];
const PHONE_COLUMN_COUNTS = [21, 21, 21, 20, 20];
function isPhoneLayout() {
    return window.innerWidth <= 600;
}

function createRoutePositions(columnCounts) {
    const routePositions = [];

    columnCounts.forEach((count, column) => {
        const x = 9 + column * (64 / (columnCounts.length - 1));

        for (let row = 0; row < count; row++) {
            const progress = row / (count - 1);
            const y = column % 2 === 0
                ? 4 + progress * 92
                : 96 - progress * 92;
            routePositions.push([x, y]);
        }
    });

    routePositions[routePositions.length - 1][1] = 98;
    return routePositions;
}

let usesPhoneLayout = isPhoneLayout();
let positions = createRoutePositions(usesPhoneLayout ? PHONE_COLUMN_COUNTS : DESKTOP_COLUMN_COUNTS);

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

function createRoad(color, width, dash = "") {
    const road = document.createElementNS("http://www.w3.org/2000/svg", "path");
    let pathData = "M " + positions[0][0] + " " + positions[0][1];

    for (let index = 1; index < positions.length; index++) {
        const previous = positions[index - 1];
        const current = positions[index];
        const isTurn = Math.abs(previous[1] - current[1]) < 0.1;

        if (isTurn) {
            const outsideY = previous[1] > 50 ? previous[1] + 3.8 : previous[1] - 3.8;
            pathData += " C " + previous[0] + " " + outsideY + ", " + current[0] + " " + outsideY + ", " + current[0] + " " + current[1];
        } else {
            pathData += " L " + current[0] + " " + current[1];
        }
    }

    road.setAttribute("d", pathData);
    road.setAttribute("fill", "none");
    road.setAttribute("stroke", color);
    road.setAttribute("stroke-width", width);
    road.setAttribute("stroke-linecap", "round");
    road.setAttribute("stroke-linejoin", "round");
    if (dash) road.setAttribute("stroke-dasharray", dash);
    pathSvg.appendChild(road);
}

function drawPath(progress) {
    pathSvg.innerHTML = "";
    createRoad("rgba(27,31,47,.94)", "2.35");
    createRoad("rgba(255,255,255,.82)", ".34", "1 1.55");
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
    // A level always receives its own word. Only after every vocabulary word
    // has appeared once does the sequence begin again from the first word.
    currentQuestion = vocabulary[(level - 1) % vocabulary.length];
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

window.addEventListener("resize", () => {
    if (isPhoneLayout() === usesPhoneLayout) return;

    usesPhoneLayout = isPhoneLayout();
    positions = createRoutePositions(usesPhoneLayout ? PHONE_COLUMN_COUNTS : DESKTOP_COLUMN_COUNTS);
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
