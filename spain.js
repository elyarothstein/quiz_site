"use strict";

const PROGRESS_KEY = "photoWorldProgress";

const WORLDS = {
    barcelona: {
        name: "Barcelona",
        start: 92,
        levels: 103,
        mapId: "barcelonaMap",
        pathId: "barcelonaPath",
        desktopColumns: [12, 12, 12, 12, 11, 11, 11, 11, 11],
        phoneColumns: [21, 21, 21, 20, 20],
        completeMessage: "Barcelona complete • Take the train to Madrid level 195.",
        lockedMessage: "Finish Eilat level 91 to unlock Barcelona level 92.",
        activeMessage: "Barcelona",
        previousMessage: "Complete the previous Barcelona level first."
    },
    madrid: {
        name: "Madrid",
        start: 195,
        levels: 68,
        mapId: "madridMap",
        pathId: "madridPath",
        desktopColumns: [10, 10, 10, 10, 10, 9, 9],
        phoneColumns: [14, 14, 14, 13, 13],
        completeMessage: "Madrid complete • Spain adventure finished for now.",
        lockedMessage: "Finish Barcelona level 194, then take the train to Madrid.",
        activeMessage: "Madrid",
        previousMessage: "Complete the previous Madrid level first."
    }
};

WORLDS.barcelona.end = WORLDS.barcelona.start + WORLDS.barcelona.levels - 1;
WORLDS.madrid.end = WORLDS.madrid.start + WORLDS.madrid.levels - 1;

let vocabulary = [];
let currentLevel = null;
let currentQuestion = null;
let currentWorld = null;
let correctAnswer = "";
let usesPhoneLayout = isPhoneLayout();

const worldState = {};
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
const trainConnector = document.querySelector(".spainTrainConnector");
const rideToMadridButton = document.getElementById("rideToMadrid");
const madridMapElement = document.getElementById("madridMap");

Object.entries(WORLDS).forEach(([key, world]) => {
    worldState[key] = {
        map: document.getElementById(world.mapId),
        pathSvg: document.getElementById(world.pathId),
        positions: createRoutePositions(usesPhoneLayout ? world.phoneColumns : world.desktopColumns)
    };
});

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

function getProgress() {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{"highestUnlocked":1}');
}

function saveProgress(progress) {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

function shuffle(items) {
    return [...items].sort(() => Math.random() - 0.5);
}

function createRoad(pathSvg, positions, color, width, dash = "") {
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

function drawPath(worldKey) {
    const state = worldState[worldKey];
    state.pathSvg.innerHTML = "";
    createRoad(state.pathSvg, state.positions, "rgba(27,31,47,.94)", "2.35");
    createRoad(state.pathSvg, state.positions, "rgba(255,255,255,.82)", ".34", "1 1.55");
}

function buildWorld(worldKey) {
    const world = WORLDS[worldKey];
    const state = worldState[worldKey];
    const progress = getProgress();

    state.map.querySelectorAll(".levelButton").forEach(button => button.remove());
    drawPath(worldKey);

    state.positions.forEach((position, index) => {
        const level = world.start + index;
        const button = document.createElement("button");
        button.type = "button";
        button.className = "levelButton";
        button.textContent = level;
        button.setAttribute("aria-label", world.name + " level " + level);
        button.style.left = position[0] + "%";
        button.style.top = position[1] + "%";

        if (level < progress.highestUnlocked) button.classList.add("completed");
        if (level === progress.highestUnlocked) button.classList.add("current");

        button.addEventListener("click", () => openLevel(worldKey, level));
        state.map.appendChild(button);
    });
}

function buildSpain() {
    buildWorld("barcelona");
    buildWorld("madrid");
    updateMessage();
}

function updateMessage() {
    const progress = getProgress();

    if (progress.highestUnlocked < WORLDS.barcelona.start) {
        message.textContent = WORLDS.barcelona.lockedMessage;
        return;
    }

    if (progress.highestUnlocked <= WORLDS.barcelona.end) {
        const complete = Math.max(0, Math.min(progress.highestUnlocked - WORLDS.barcelona.start, WORLDS.barcelona.levels));
        message.textContent = "Barcelona: " + complete + " / " + WORLDS.barcelona.levels + " memories unlocked.";
        return;
    }

    if (progress.highestUnlocked <= WORLDS.madrid.end) {
        const complete = Math.max(0, Math.min(progress.highestUnlocked - WORLDS.madrid.start, WORLDS.madrid.levels));
        message.textContent = "Madrid: " + complete + " / " + WORLDS.madrid.levels + " memories unlocked.";
        return;
    }

    message.textContent = WORLDS.madrid.completeMessage;
}

function rideTrainToMadrid() {
    const progress = getProgress();

    if (!trainConnector || !madridMapElement) return;

    trainConnector.classList.remove("is-riding");
    void trainConnector.offsetWidth;
    trainConnector.classList.add("is-riding");

    const madridUnlocked = progress.highestUnlocked >= WORLDS.madrid.start;
    message.textContent = madridUnlocked
        ? "Riding the train from Barcelona Sants to Madrid Atocha…"
        : "Train preview — finish Barcelona level 194 first to ride into Madrid.";

    window.setTimeout(() => {
        if (madridUnlocked) madridMapElement.scrollIntoView({ behavior: "smooth", block: "start" });
        updateMessage();
    }, 1200);

    window.setTimeout(() => {
        trainConnector.classList.remove("is-riding");
    }, 1550);
}

function openLevel(worldKey, level) {
    const world = WORLDS[worldKey];
    const progress = getProgress();

    if (level < progress.highestUnlocked) {
        showPhoto(worldKey, level);
    } else if (level > progress.highestUnlocked) {
        message.textContent = progress.highestUnlocked < world.start
            ? world.lockedMessage
            : world.previousMessage;
    } else {
        startQuestion(worldKey, level);
    }
}

function startQuestion(worldKey, level) {
    if (vocabulary.length < 4) {
        message.textContent = "The vocabulary file needs at least four words.";
        return;
    }

    currentWorld = worldKey;
    currentLevel = level;
    currentQuestion = vocabulary[(level - 1) % vocabulary.length];
    correctAnswer = currentQuestion.explanation;
    questionTitle.textContent = WORLDS[worldKey].name + " Level " + level;
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

function showPhoto(worldKey, level) {
    photoTitle.textContent = WORLDS[worldKey].name + " Level " + level;
    photoImage.src = "game_photos/g" + level + ".jpg";
    photoImage.alt = "Unlocked " + WORLDS[worldKey].name + " memory";
    photoPanel.style.display = "flex";
}

closeQuestionButton.addEventListener("click", () => {
    const showUnlockedPhoto = closeQuestionButton.textContent === "See Photo";
    questionPanel.style.display = "none";
    buildSpain();
    if (showUnlockedPhoto && currentLevel && currentWorld) showPhoto(currentWorld, currentLevel);
});

closePhotoButton.addEventListener("click", () => {
    photoPanel.style.display = "none";
    buildSpain();
});

if (rideToMadridButton) rideToMadridButton.addEventListener("click", rideTrainToMadrid);

window.addEventListener("resize", () => {
    if (isPhoneLayout() === usesPhoneLayout) return;

    usesPhoneLayout = isPhoneLayout();
    Object.entries(WORLDS).forEach(([key, world]) => {
        worldState[key].positions = createRoutePositions(usesPhoneLayout ? world.phoneColumns : world.desktopColumns);
    });
    buildSpain();
});

fetch("vocabulary_template.json")
    .then(response => response.json())
    .then(words => {
        vocabulary = words;
        buildSpain();
    })
    .catch(() => {
        message.textContent = "Could not load vocabulary_template.json";
        buildSpain();
    });
