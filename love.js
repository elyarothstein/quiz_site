/*
 * JavaScript controls everything the website does.
 * It loads vocabulary, changes screens, checks answers, runs games,
 * saves progress in localStorage, and responds to button clicks.
 */

// ---------- App state ----------
// These variables remember scores, question numbers, boards, and current answers.


       let vocabulary = [];

        // This will hold the shuffled words for the current quiz.
        let quizWords = [];

        // This tracks which question number the user is on.
        let currentQuestion = 0;

        // This tracks the user's score.
        let score = 0;

        // This stores the correct answer for the current question.
        let correctAnswer = "";

        // This stores the words for the current quick quiz.
        let quickWords = [];

        // This tracks which quick quiz question number the user is on.
        let quickQuestionNumber = 0;

        // This tracks the current quick quiz score.
        let quickScore = 0;

        // This tracks wrong answers in the current quick quiz.
        let quickWrongCount = 0;

        // This stores the correct answer for the current quick quiz question.
        let quickCorrectAnswer = "";

        // This stores whether quick quiz is normal mode or wrong words mode.
        let quickMode = "quick";

        // This stores the 100 random words for the test.
        let testWords = [];

        // This tracks which test question number the user is on.
        let testQuestionNumber = 0;

        // This tracks the test score.
        let testScore = 0;

        // This stores the correct answer for the current test question.
        let testCorrectAnswer = "";

        // This stores the current test word object.
        let currentTestWord = null;

        // This stores the 90 minute timer.
        let testTimer = null;

        // This stores how much test time is left in seconds.
        let testTimeLeft = 90 * 60;

        // This stores the shuffled words for the game mode.
        let gameWords = [];

        // This tracks which game question number the user is on.
        let gameQuestionNumber = 0;

        // This tracks the game quiz score.
        let gameScore = 0;

        // This tracks how many rows the player has cleared.
        let totalRowsCleared = 0;

        // This stores the correct answer for the current game question.
        let gameCorrectAnswer = "";

        // This stores the 10 by 10 block board.
        let gameBoard = [];

        // This stores the block shape the user earned.
        let currentShape = null;

        // This stores whether the user may place a block right now.
        let canPlaceShape = false;

        // This stores the previewed board spot before the user confirms.
        let pendingPlacement = null;

        // This stores the shuffled words for puzzle game mode.
        let puzzleWords = [];

        // This tracks which puzzle question number the user is on.
        let puzzleQuestionNumber = 0;

        // This tracks the puzzle quiz score.
        let puzzleScore = 0;

        // This stores the correct answer for the current puzzle question.
        let puzzleCorrectAnswer = "";

        // This stores the puzzle pieces that have not been earned yet.
        let remainingPuzzlePieces = [];

        // This stores the puzzle image being used.
        let currentPuzzleImage = "";

        // This controls how many rows and columns the puzzle has.
        const puzzleGridSize = 5;
        const puzzlePieceCount = puzzleGridSize * puzzleGridSize;

        // These are the puzzle photos the game can choose from.
        const puzzleImages = [
            "puzzle_photos/puzzle1.jpg",
            "puzzle_photos/puzzle2.jpg",
            "puzzle_photos/puzzle3.jpg",
            "puzzle_photos/puzzle4.jpg",
            "puzzle_photos/puzzle5.jpg",
            "puzzle_photos/puzzle6.jpg",
            "puzzle_photos/puzzle7.jpg",
            "puzzle_photos/puzzle8.jpg",
            "puzzle_photos/puzzle9.jpg",
            "puzzle_photos/puzzle10.jpg",
            "puzzle_photos/puzzle11.jpg",
            "puzzle_photos/puzzle12.jpg",
            "puzzle_photos/puzzle13.jpg",
            "puzzle_photos/puzzle14.jpg",
            "puzzle_photos/puzzle15.jpg",
            "puzzle_photos/puzzle16.jpg",
            "puzzle_photos/puzzle17.jpg",
            "puzzle_photos/puzzle18.jpg",
            "puzzle_photos/puzzle19.jpg",
            "puzzle_photos/puzzle20.jpg"
        ];

        // These are the countdown calendar photos, one for each day.
        const calendarPhotos = Array.from(
            { length: 48 },
            (_, index) => "calendar_photos/c" + (index + 1) + ".jpg"
        );

        // These dates control the countdown calendar.
        const calendarStartDate = "2026-06-18";
        const calendarEndDate = "2026-08-03";
        const revealedCalendarDaysKey = "revealedCountdownDays";
        const testRevealedCalendarDaysKey = "testRevealedCountdownDays";

        // This stores the first photo world.
        const photoWorlds = [
            {
                name: "Jerusalem",
                startLevel: 1,
                levels: 21,
                positions: [
                    [50, 5], [35, 10], [55, 15], [72, 20], [50, 25], [30, 30], [44, 35],
                    [64, 40], [76, 45], [58, 50], [38, 55], [24, 60], [42, 65], [62, 70],
                    [78, 75], [64, 80], [48, 84], [32, 88], [20, 91], [32, 94], [50, 97]
                ]
            }
        ];
        const photoWorldProgressKey = "photoWorldProgress";
        let currentWorldLevel = null;
        let currentWorldQuestion = null;
        let currentWorldCorrectAnswer = "";

        // These are the block shapes the game can give the user.
        const blockShapes = [
            [[0, 0]],
            [[0, 0], [0, 1]],
            [[0, 0], [0, 1], [1, 0]],
            [[0, 0], [0, 1], [1, 0], [1, 1]],
            [[0, 0], [0, 1], [0, 2]],
            [[0, 0], [1, 0], [2, 0]],
            [[0, 0], [0, 1], [0, 2], [1, 1]],
            [[0, 0], [1, 0], [2, 0], [2, 1]],
            [[0, 1], [1, 1], [2, 1], [2, 0]],
            [[0, 0], [0, 1], [1, 1], [2, 1]],
            [[0, 0], [1, 0], [2, 0], [0, 1]],
            [[0, 1], [0, 2], [1, 0], [1, 1]],
            [[0, 0], [0, 1], [1, 1], [1, 2]],
            [[0, 0], [1, 0], [1, 1], [2, 1]],
            [[0, 1], [1, 0], [1, 1], [2, 0]],
            [[0, 0], [0, 1], [0, 2], [0, 3]],
            [[0, 0], [1, 0], [2, 0], [3, 0]]
        ];

        // Get the home screen from the HTML.
        const homeScreen = document.getElementById("homeScreen");

        // Get the quiz screen from the HTML.
        const quizScreen = document.getElementById("quizScreen");

        // Get the quick quiz screen from the HTML.
        const quickScreen = document.getElementById("quickScreen");

        // Get the test screen from the HTML.
        const testScreen = document.getElementById("testScreen");

        // Get the game screen from the HTML.
        const gameScreen = document.getElementById("gameScreen");

        // Get the puzzle screen from the HTML.
        const puzzleScreen = document.getElementById("puzzleScreen");

        // Get the calendar screen from the HTML.
        const calendarScreen = document.getElementById("calendarScreen");

        // Get the world map screen from the HTML.
        const worldMapScreen = document.getElementById("worldMapScreen");

        // Get the title.
        const title = document.getElementById("title");

        // Get the Options button.
        const optionsButton = document.getElementById("optionsButton");

        // Get the options menu.
        const optionsMenu = document.getElementById("optionsMenu");

        // Get the Start Quiz button.
        const startButton = document.getElementById("startButton");

        // Get the Quick Quiz button.
        const quickQuizButton = document.getElementById("quickQuizButton");

        // Get the Practice Wrong Words button.
        const wrongWordsButton = document.getElementById("wrongWordsButton");

        // Get the Test button.
        const testButton = document.getElementById("testButton");

        // Get the Play Quiz Game button.
        const gameButton = document.getElementById("gameButton");

        // Get the Puzzle Game button.
        const puzzleGameButton = document.getElementById("puzzleGameButton");

        // Get the Countdown Calendar button.
        const calendarButton = document.getElementById("calendarButton");

        // Get the Jerusalem World button.
        const worldMapButton = document.getElementById("worldMapButton");

        // Get the Next Question button.
        const nextButton = document.getElementById("nextButton");

        // Get the question text element.
        const questionEl = document.getElementById("question");

        // Get the choices container.
        const choicesEl = document.getElementById("choices");

        // Get the result message element.
        const resultEl = document.getElementById("result");

        // Get the explanation element.
        const explanationEl = document.getElementById("explanation");

        // Get the score element.
        const scoreEl = document.getElementById("score");

        // Get the quick quiz title.
        const quickTitleEl = document.getElementById("quickTitle");

        // Get the quick quiz progress element.
        const quickProgressEl = document.getElementById("quickProgress");

        // Get the quick quiz question element.
        const quickQuestionEl = document.getElementById("quickQuestion");

        // Get the quick quiz choices container.
        const quickChoicesEl = document.getElementById("quickChoices");

        // Get the quick quiz result element.
        const quickResultEl = document.getElementById("quickResult");

        // Get the quick quiz stats element.
        const quickStatsEl = document.getElementById("quickStats");

        // Get the next quick quiz button.
        const nextQuickButton = document.getElementById("nextQuickButton");

        // Get the test timer element.
        const testTimerEl = document.getElementById("testTimer");

        // Get the test progress element.
        const testProgressEl = document.getElementById("testProgress");

        // Get the test question element.
        const testQuestionEl = document.getElementById("testQuestion");

        // Get the test choices container.
        const testChoicesEl = document.getElementById("testChoices");

        // Get the test result element.
        const testResultEl = document.getElementById("testResult");

        // Get the test stats element.
        const testStatsEl = document.getElementById("testStats");

        // Get the next test button.
        const nextTestButton = document.getElementById("nextTestButton");

        // Get the game question element.
        const gameQuestionEl = document.getElementById("gameQuestion");

        // Get the game choices container.
        const gameChoicesEl = document.getElementById("gameChoices");

        // Get the game result element.
        const gameResultEl = document.getElementById("gameResult");

        // Get the game score element.
        const gameScoreEl = document.getElementById("gameScore");

        // Get the rows cleared element.
        const rowsClearedEl = document.getElementById("rowsCleared");

        // Get the game message element.
        const gameMessageEl = document.getElementById("gameMessage");

        // Get the game board element.
        const gameBoardEl = document.getElementById("gameBoard");

        // Get the shape preview element.
        const shapePreviewEl = document.getElementById("shapePreview");

        // Get the rotate shape button.
        const rotateShapeButton = document.getElementById("rotateShapeButton");

        // Get the confirm shape button.
        const confirmShapeButton = document.getElementById("confirmShapeButton");

        // Get the next game question button.
        const nextGameQuestionButton = document.getElementById("nextGameQuestionButton");

        // Get the puzzle question element.
        const puzzleQuestionEl = document.getElementById("puzzleQuestion");

        // Get the puzzle choices container.
        const puzzleChoicesEl = document.getElementById("puzzleChoices");

        // Get the puzzle result element.
        const puzzleResultEl = document.getElementById("puzzleResult");

        // Get the puzzle score element.
        const puzzleScoreEl = document.getElementById("puzzleScore");

        // Get the puzzle message element.
        const puzzleMessageEl = document.getElementById("puzzleMessage");

        // Get the puzzle board element.
        const puzzleBoardEl = document.getElementById("puzzleBoard");

        // Get the puzzle tray element.
        const puzzleTrayEl = document.getElementById("puzzleTray");

        // Get the next puzzle question button.
        const nextPuzzleQuestionButton = document.getElementById("nextPuzzleQuestionButton");

        // Get the puzzle play again button.
        const puzzlePlayAgainButton = document.getElementById("puzzlePlayAgainButton");

        // Get the puzzle home button.
        const puzzleHomeButton = document.getElementById("puzzleHomeButton");

        // Get the calendar message element.
        const calendarMessageEl = document.getElementById("calendarMessage");

        // Get the calendar grid element.
        const calendarGridEl = document.getElementById("calendarGrid");

        // Get the world map elements.
        const worldMapEl = document.getElementById("worldMap");
        const worldPathSvgEl = document.getElementById("worldPathSvg");
        const worldMessageEl = document.getElementById("worldMessage");
        const worldQuestionPanel = document.getElementById("worldQuestionPanel");
        const worldQuestionTitleEl = document.getElementById("worldQuestionTitle");
        const worldQuestionEl = document.getElementById("worldQuestion");
        const worldChoicesEl = document.getElementById("worldChoices");
        const worldResultEl = document.getElementById("worldResult");
        const closeWorldQuestionButton = document.getElementById("closeWorldQuestionButton");
        const worldPhotoPanel = document.getElementById("worldPhotoPanel");
        const worldPhotoTitleEl = document.getElementById("worldPhotoTitle");
        const worldPhotoImageEl = document.getElementById("worldPhotoImage");
        const closeWorldPhotoButton = document.getElementById("closeWorldPhotoButton");


        // ---------- Vocabulary loading ----------
        // Fetches vocabulary_template.json before any quiz begins.
        async function loadVocabularyFromFile(){
            try {
                const response = await fetch("vocabulary_template.json");
                vocabulary = await response.json();

                console.log("Vocabulary loaded:", vocabulary.length);
            } catch (error) {
                console.error("Could not load vocabulary file:", error)
                alert("Could not load vocabulary_template.json");
            }
        }
        // This function shows the home screen.
        loadVocabularyFromFile().then(function() {
            showHome();
        });

        // This function stops the test timer.
        function stopTestTimer() {
            if (testTimer) {
                clearInterval(testTimer);
                testTimer = null;
            }
        }

        // ---------- Screen navigation ----------
        // Each show function displays one page and hides every other page.
        function showHome() {
            stopTestTimer();

            // Show home screen.
            homeScreen.style.display = "flex";

            // Hide the options menu.
            optionsMenu.style.display = "none";

            // Hide quiz screen.
            quizScreen.style.display = "none";

            // Hide quick quiz screen.
            quickScreen.style.display = "none";

            // Hide test screen.
            testScreen.style.display = "none";

            // Hide game screen.
            gameScreen.style.display = "none";

            // Hide puzzle screen.
            puzzleScreen.style.display = "none";

            // Hide calendar screen.
            calendarScreen.style.display = "none";

            // Hide world map screen.
            worldMapScreen.style.display = "none";

            // Clear result text.
            resultEl.textContent = "";

            // Clear explanation text.
            explanationEl.textContent = "";
        }

        // This function shows the quiz screen.
        function showQuiz() {
            stopTestTimer();

            // Hide home screen.
            homeScreen.style.display = "none";

            // Show quiz screen.
            quizScreen.style.display = "block";

            // Hide quick quiz screen.
            quickScreen.style.display = "none";

            // Hide test screen.
            testScreen.style.display = "none";

            // Hide game screen.
            gameScreen.style.display = "none";

            // Hide puzzle screen.
            puzzleScreen.style.display = "none";

            // Hide calendar screen.
            calendarScreen.style.display = "none";

            // Hide world map screen.
            worldMapScreen.style.display = "none";
        }

        // This function shows the quick quiz screen.
        function showQuickQuiz() {
            stopTestTimer();

            // Hide home screen.
            homeScreen.style.display = "none";

            // Hide quiz screen.
            quizScreen.style.display = "none";

            // Show quick quiz screen.
            quickScreen.style.display = "block";

            // Hide test screen.
            testScreen.style.display = "none";

            // Hide game screen.
            gameScreen.style.display = "none";

            // Hide puzzle screen.
            puzzleScreen.style.display = "none";

            // Hide calendar screen.
            calendarScreen.style.display = "none";

            // Hide world map screen.
            worldMapScreen.style.display = "none";
        }

        // This function shows the test screen.
        function showTest() {
            // Hide home screen.
            homeScreen.style.display = "none";

            // Hide quiz screen.
            quizScreen.style.display = "none";

            // Hide quick quiz screen.
            quickScreen.style.display = "none";

            // Show test screen.
            testScreen.style.display = "block";

            // Hide game screen.
            gameScreen.style.display = "none";

            // Hide puzzle screen.
            puzzleScreen.style.display = "none";

            // Hide calendar screen.
            calendarScreen.style.display = "none";

            // Hide world map screen.
            worldMapScreen.style.display = "none";
        }

        // This function shows the game screen.
        function showGame() {
            stopTestTimer();

            // Hide home screen.
            homeScreen.style.display = "none";

            // Hide quiz screen.
            quizScreen.style.display = "none";

            // Hide quick quiz screen.
            quickScreen.style.display = "none";

            // Hide test screen.
            testScreen.style.display = "none";

            // Show game screen.
            gameScreen.style.display = "block";

            // Hide puzzle screen.
            puzzleScreen.style.display = "none";

            // Hide calendar screen.
            calendarScreen.style.display = "none";

            // Hide world map screen.
            worldMapScreen.style.display = "none";
        }

        // This function shows the puzzle game screen.
        function showPuzzleGame() {
            stopTestTimer();

            // Hide home screen.
            homeScreen.style.display = "none";

            // Hide quiz screen.
            quizScreen.style.display = "none";

            // Hide quick quiz screen.
            quickScreen.style.display = "none";

            // Hide test screen.
            testScreen.style.display = "none";

            // Hide game screen.
            gameScreen.style.display = "none";

            // Show puzzle screen.
            puzzleScreen.style.display = "block";

            // Hide calendar screen.
            calendarScreen.style.display = "none";

            // Hide world map screen.
            worldMapScreen.style.display = "none";
        }

        // This function shows the countdown calendar screen.
        function showCalendar() {
            stopTestTimer();

            // Hide home screen.
            homeScreen.style.display = "none";

            // Hide quiz screen.
            quizScreen.style.display = "none";

            // Hide quick quiz screen.
            quickScreen.style.display = "none";

            // Hide test screen.
            testScreen.style.display = "none";

            // Hide game screen.
            gameScreen.style.display = "none";

            // Hide puzzle screen.
            puzzleScreen.style.display = "none";

            // Show calendar screen.
            calendarScreen.style.display = "block";

            // Hide world map screen.
            worldMapScreen.style.display = "none";

            buildCalendar();
        }

        // This function shows the Jerusalem world map screen.
        function showWorldMap() {
            stopTestTimer();

            homeScreen.style.display = "none";
            quizScreen.style.display = "none";
            quickScreen.style.display = "none";
            testScreen.style.display = "none";
            gameScreen.style.display = "none";
            puzzleScreen.style.display = "none";
            calendarScreen.style.display = "none";
            worldMapScreen.style.display = "block";

            buildWorldMap();
        }

        // This function turns a date into YYYY-MM-DD using the browser's local date.
        function formatCalendarDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");

            return year + "-" + month + "-" + day;
        }

        // This function creates a local date from YYYY-MM-DD text.
        function createCalendarDate(dateText) {
            const parts = dateText.split("-").map(Number);

            return new Date(parts[0], parts[1] - 1, parts[2]);
        }

        // This function adds days to a calendar date.
        function addCalendarDays(date, days) {
            const newDate = new Date(date);
            newDate.setDate(newDate.getDate() + days);

            return newDate;
        }

        // This function checks whether the calendar is being tested with a fake date.
        function getCalendarTestDate() {
            const params = new URLSearchParams(window.location.search);
            const testDate = params.get("testCalendar");

            if (testDate && /^\d{4}-\d{2}-\d{2}$/.test(testDate)) {
                return testDate;
            }

            return "";
        }

        // This function chooses the real save key or the separate test save key.
        function getCalendarStorageKey() {
            return getCalendarTestDate() ? testRevealedCalendarDaysKey : revealedCalendarDaysKey;
        }

        // This function gets the saved revealed calendar days.
        function getRevealedCalendarDays() {
            return JSON.parse(localStorage.getItem(getCalendarStorageKey()) || "[]");
        }

        // This function saves the revealed calendar days.
        function saveRevealedCalendarDays(days) {
            localStorage.setItem(getCalendarStorageKey(), JSON.stringify(days));
        }

        // This function counts how many days are left until America day.
        function getDaysUntilAmerica(date) {
            const endDate = createCalendarDate(calendarEndDate);
            const millisecondsPerDay = 24 * 60 * 60 * 1000;

            return Math.round((endDate - date) / millisecondsPerDay);
        }

        // This function gets the photo and countdown text for one calendar day.
        function getCalendarDayGift(dayIndex, date) {
            const daysLeft = getDaysUntilAmerica(date);
            const dayText = daysLeft === 1 ? "day left" : "days left";

            return {
                photo: calendarPhotos[dayIndex % calendarPhotos.length],
                word: daysLeft + " " + dayText
            };
        }

        // This function reveals one calendar day.
        function revealCalendarDay(dateText) {
            const revealedDays = getRevealedCalendarDays();

            if (!revealedDays.includes(dateText)) {
                revealedDays.push(dateText);
                saveRevealedCalendarDays(revealedDays);
            }

            buildCalendar();
        }

        // This function builds the countdown calendar.
        // ---------- Countdown calendar ----------
        // Builds every date square and decides whether it is locked or revealed.
        function buildCalendar() {
            const testDate = getCalendarTestDate();
            const todayText = testDate || formatCalendarDate(new Date());
            const startDate = createCalendarDate(calendarStartDate);
            const endDate = createCalendarDate(calendarEndDate);
            const revealedDays = getRevealedCalendarDays();

            calendarGridEl.innerHTML = "";
            calendarMessageEl.textContent = testDate
                ? "Testing calendar date: " + testDate + ". Remove ?testCalendar=" + testDate + " from the URL to go back to normal."
                : "Open one square each day until August 3, the day you fly to America and we will be together again.";

            let dayIndex = 0;

            for (let date = new Date(startDate); date <= endDate; date = addCalendarDays(date, 1)) {
                const dateText = formatCalendarDate(date);
                const isToday = dateText === todayText;
                const canOpen = dateText <= todayText;
                const isRevealed = revealedDays.includes(dateText);
                const gift = getCalendarDayGift(dayIndex, date);
                const button = document.createElement("button");
                const dateLabel = date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric"
                });

                button.className = "calendarDay";
                button.innerHTML = '<span class="calendarDate">' + dateLabel + "</span>";

                if (isRevealed) {
                    button.classList.add("revealed");
                    button.style.backgroundImage = 'url("' + gift.photo + '")';
                    button.innerHTML += '<span class="calendarWord">' + gift.word + "</span>";
                } else if (canOpen) {
                    button.classList.add("today");
                    button.innerHTML += '<span class="calendarLock">' +
                        (isToday ? "Open today" : "Open now") +
                        "</span>";

                    button.onclick = function() {
                        revealCalendarDay(dateText);
                    };
                } else {
                    button.classList.add("locked");
                    button.disabled = true;
                    button.innerHTML += '<span class="calendarLock">Locked</span>';
                }

                calendarGridEl.appendChild(button);
                dayIndex++;
            }
        }

        // This function gets saved photo world progress.
        function getPhotoWorldProgress() {
            return JSON.parse(localStorage.getItem(photoWorldProgressKey) || '{"highestUnlocked":1}');
        }

        // This function saves photo world progress.
        function savePhotoWorldProgress(progress) {
            localStorage.setItem(photoWorldProgressKey, JSON.stringify(progress));
        }

        // This function gets the Jerusalem world data.
        function getJerusalemWorld() {
            return photoWorlds[0];
        }

        // This function gets the photo file for a level.
        function getWorldPhoto(levelNumber) {
            return "game_photos/g" + levelNumber + ".jpg";
        }

        // This function draws the colored path between levels.
        function drawWorldPath(world, progress) {
            const colors = ["#6fc2e7", "#ffe25c", "#ff7ab6", "#80d28d", "#b89cff"];

            worldPathSvgEl.innerHTML = "";

            for (let index = 0; index < world.positions.length - 1; index++) {
                const start = world.positions[index];
                const end = world.positions[index + 1];
                const levelNumber = world.startLevel + index;
                const path = document.createElementNS("http://www.w3.org/2000/svg", "line");

                path.setAttribute("x1", start[0]);
                path.setAttribute("y1", start[1]);
                path.setAttribute("x2", end[0]);
                path.setAttribute("y2", end[1]);
                path.setAttribute("stroke", levelNumber < progress.highestUnlocked ? colors[index % colors.length] : "rgba(255,255,255,0.7)");
                path.setAttribute("stroke-width", "2.2");
                path.setAttribute("stroke-linecap", "round");
                path.setAttribute("stroke-dasharray", "2 2");

                worldPathSvgEl.appendChild(path);
            }
        }

        // This function builds the Jerusalem world map.
        // ---------- Jerusalem photo world ----------
        // Draws the path, level circles, progress colors, and unlocked photos.
        function buildWorldMap() {
            const world = getJerusalemWorld();
            const progress = getPhotoWorldProgress();

            worldMapEl.querySelectorAll(".worldLevel").forEach(level => level.remove());
            drawWorldPath(world, progress);

            world.positions.forEach((position, index) => {
                const levelNumber = world.startLevel + index;
                const button = document.createElement("button");

                button.className = "worldLevel";
                button.textContent = levelNumber;
                button.style.left = position[0] + "%";
                button.style.top = position[1] + "%";

                if (levelNumber < progress.highestUnlocked) {
                    button.classList.add("completed");
                } else if (levelNumber === progress.highestUnlocked) {
                    button.classList.add("unlocked", "current");
                }

                button.onclick = function() {
                    openWorldLevel(levelNumber);
                };

                worldMapEl.appendChild(button);
            });

            worldMessageEl.textContent =
                "Jerusalem levels unlocked: " +
                Math.min(progress.highestUnlocked - 1, world.levels) +
                " / " +
                world.levels;
        }

        // This function opens one level on the world map.
        function openWorldLevel(levelNumber) {
            const progress = getPhotoWorldProgress();

            if (levelNumber < progress.highestUnlocked) {
                showWorldPhoto(levelNumber);
                return;
            }

            if (levelNumber > progress.highestUnlocked) {
                worldMessageEl.textContent = "Complete the level before this one first.";
                return;
            }

            startWorldLevelQuestion(levelNumber);
        }

        // This function starts a definition question for one world level.
        function startWorldLevelQuestion(levelNumber) {
            if (vocabulary.length < 4) {
                alert("You need at least 4 vocabulary words to play this world.");
                return;
            }

            currentWorldLevel = levelNumber;
            currentWorldQuestion = shuffleArray(vocabulary)[0];
            currentWorldCorrectAnswer = currentWorldQuestion.explanation;

            worldQuestionTitleEl.textContent = "Jerusalem Level " + levelNumber;
            worldQuestionEl.textContent = `What does "${currentWorldQuestion.word}" mean?`;
            worldChoicesEl.innerHTML = "";
            worldResultEl.textContent = "";
            closeWorldQuestionButton.style.display = "none";
            closeWorldQuestionButton.textContent = "Close";

            const wrongChoices = shuffleArray(vocabulary)
                .filter(item => item.word !== currentWorldQuestion.word)
                .slice(0, 3);
            const allChoices = shuffleArray([
                {
                    label: currentWorldCorrectAnswer,
                    item: currentWorldQuestion,
                    correct: true
                },
                ...wrongChoices.map(item => ({
                    label: item.explanation,
                    item: item,
                    correct: false
                }))
            ]);

            allChoices.forEach(choice => {
                const button = document.createElement("button");
                button.textContent = choice.label;

                button.onclick = function() {
                    checkWorldLevelAnswer(choice);
                };

                worldChoicesEl.appendChild(button);
            });

            worldQuestionPanel.style.display = "flex";
        }

        // This function checks an answer in the world map game.
        function checkWorldLevelAnswer(choice) {
            const buttons = worldChoicesEl.querySelectorAll("button");

            buttons.forEach(button => {
                button.disabled = true;

                if (button.textContent === currentWorldCorrectAnswer) {
                    button.style.border = "3px solid green";
                }

                if (button.textContent === choice.label && !choice.correct) {
                    button.style.border = "3px solid red";
                }
            });

            if (choice.correct) {
                const progress = getPhotoWorldProgress();

                progress.highestUnlocked = Math.max(progress.highestUnlocked, currentWorldLevel + 1);
                savePhotoWorldProgress(progress);

                worldResultEl.innerHTML =
                    "Correct! Photo unlocked.<br><strong>Definition:</strong><br>" +
                    (currentWorldQuestion.explanation || "") +
                    "<br><br><strong>Example:</strong><br>" +
                    (currentWorldQuestion.example || "");
                closeWorldQuestionButton.textContent = "See Photo";
                closeWorldQuestionButton.style.display = "inline-block";
            } else {
                worldResultEl.innerHTML =
                    "Incorrect.<br><strong>Correct word:</strong> " +
                    currentWorldQuestion.word +
                    "<br><strong>Correct definition:</strong><br>" +
                    currentWorldCorrectAnswer +
                    "<br><strong>Example for the correct word:</strong><br>" +
                    (currentWorldQuestion.example || "") +
                    "<br><br><strong>The definition you chose belongs to:</strong> " +
                    choice.item.word +
                    "<br><strong>Example for the word you chose:</strong><br>" +
                    (choice.item.example || "");
                closeWorldQuestionButton.textContent = "Try Again Later";
                closeWorldQuestionButton.style.display = "inline-block";
            }
        }

        // This function shows an unlocked world photo.
        function showWorldPhoto(levelNumber) {
            worldPhotoTitleEl.textContent = "Jerusalem Level " + levelNumber;
            worldPhotoImageEl.src = getWorldPhoto(levelNumber);
            worldPhotoPanel.style.display = "flex";
        }

        // This function closes the question popup.
        function closeWorldQuestion() {
            const shouldShowPhoto = closeWorldQuestionButton.textContent === "See Photo";

            worldQuestionPanel.style.display = "none";
            buildWorldMap();

            if (shouldShowPhoto && currentWorldLevel) {
                showWorldPhoto(currentWorldLevel);
            }
        }

        // This function closes the photo popup.
        function closeWorldPhoto() {
            worldPhotoPanel.style.display = "none";
            buildWorldMap();
        }


        // This function shuffles an array randomly.
        function shuffleArray(array) {
            // Make a copy of the array and randomly sort it.
            return [...array].sort(() => Math.random() - 0.5);
        }

        // This function gets 3 wrong definitions.
        function getWrongDefinitions(correctWord) {
            // Start with all vocabulary words.
            return vocabulary

                // Remove the current correct word.
                .filter(item => item.word !== correctWord.word)

                // Keep only the definitions.
                .map(item => item.explanation)

                // Shuffle the definitions.
                .sort(() => Math.random() - 0.5)

                // Take only 3 wrong answers.
                .slice(0, 3);
        }

        // This function displays one question.
        // ---------- Full vocabulary quiz ----------
        function showQuestion() {
            // Get the current word object.
            const currentWord = quizWords[currentQuestion];

            // Save the correct answer.
            correctAnswer = currentWord.explanation;

            // Create the question text.
            questionEl.textContent = `What does "${currentWord.word}" mean?`;

            // Clear old answer buttons.
            choicesEl.innerHTML = "";

            // Clear old result.
            resultEl.textContent = "";

            explanationEl.textContent = "";

            // Hide the next button until user answers.
            nextButton.style.display = "none";

            // Get 3 wrong answers.
            let wrongAnswers = getWrongDefinitions(currentWord);

            // Put correct answer and wrong answers together, then shuffle them.
            let allChoices = shuffleArray([
                correctAnswer,
                ...wrongAnswers
            ]);

            // Create one button for every answer choice.
            allChoices.forEach(choiceText => {
                // Create a button element.
                const button = document.createElement("button");

                // Put the answer text inside the button.
                button.textContent = choiceText;

                // When the user clicks the button, check the answer.
                button.onclick = function() {
                    checkAnswer(choiceText, currentWord);
                };

                // Add the button to the choices area.
                choicesEl.appendChild(button);
            });

            // Show the current score.
            scoreEl.textContent = "Score: " + score + " / " + quizWords.length;
        }

        // This function checks if the selected answer is correct.
        function checkAnswer(userAnswer, currentWord) {
            // Get all answer buttons.
            const allButtons = choicesEl.querySelectorAll("button");

            // Loop through every answer button.
            allButtons.forEach(button => {
                // Disable the button so user cannot answer twice.
                button.disabled = true;

                // If this button is the correct answer, make it green.
                if (button.textContent === correctAnswer) {
                    button.style.border = "3px solid green";
                }

                // If this button is the wrong answer the user clicked, make it red.
                if (button.textContent === userAnswer && userAnswer !== correctAnswer) {
                    button.style.border = "3px solid red";
                }
            });

            if (userAnswer === correctAnswer) {
                resultEl.textContent = "Correct!";
                explanationEl.innerHTML =
                "<strong>Example:</strong><br>" +
                (currentWord.example || "");
            score++;
        } else {
            resultEl.textContent = "Incorrect.";
            explanationEl.innerHTML =
                "<strong>Meaning:</strong><br>" +
                (currentWord.explanation || "") +
                "<br><br>" +
                "<strong>Example:</strong><br>" +
                (currentWord.example || "");
        }

            // Show the next button.
            nextButton.style.display = "inline-block";

            // Update score.
            scoreEl.textContent = "Score: " + score + " / " + quizWords.length;
        }

        // This function gets saved quick quiz progress from the browser.
        function getQuickSeenWords() {
            return JSON.parse(localStorage.getItem("quickSeenWords") || "[]");
        }

        // This function saves quick quiz progress into the browser.
        function saveQuickSeenWords(words) {
            localStorage.setItem("quickSeenWords", JSON.stringify(words));
        }

        // This function gets the saved wrong words from the browser.
        function getQuickWrongWords() {
            return JSON.parse(localStorage.getItem("quickWrongWords") || "[]");
        }

        // This function saves the wrong words into the browser.
        function saveQuickWrongWords(words) {
            localStorage.setItem("quickWrongWords", JSON.stringify(words));
        }

        // This function adds a word to the wrong words list.
        function addQuickWrongWord(word) {
            const wrongWords = getQuickWrongWords();

            if (!wrongWords.includes(word)) {
                wrongWords.push(word);
                saveQuickWrongWords(wrongWords);
            }
        }

        // This function removes a word from the wrong words list.
        function removeQuickWrongWord(word) {
            const wrongWords = getQuickWrongWords().filter(savedWord => savedWord !== word);
            saveQuickWrongWords(wrongWords);
        }

        // This function chooses up to 10 new words for quick quiz.
        function getQuickQuizWords() {
            let seenWords = getQuickSeenWords();

            if (seenWords.length >= vocabulary.length) {
                seenWords = [];
                saveQuickSeenWords(seenWords);
            }

            let availableWords = vocabulary.filter(item => !seenWords.includes(item.word));

            if (availableWords.length === 0) {
                seenWords = [];
                saveQuickSeenWords(seenWords);
                availableWords = [...vocabulary];
            }

            const selectedWords = shuffleArray(availableWords).slice(0, 10);
            const newSeenWords = [...seenWords];

            selectedWords.forEach(item => {
                if (!newSeenWords.includes(item.word)) {
                    newSeenWords.push(item.word);
                }
            });

            saveQuickSeenWords(newSeenWords);
            return selectedWords;
        }

        // This function starts a normal quick quiz.
        // ---------- Quick Quiz and wrong-word practice ----------
        function startQuickQuiz() {
            if (vocabulary.length < 4) {
                alert("You need at least 4 vocabulary words to start the quick quiz.");
                return;
            }

            quickMode = "quick";
            quickWords = getQuickQuizWords();
            quickTitleEl.textContent = "Quick Quiz";
            quickScreen.style.backgroundImage = 'url("website_images/image3.jpg")';
            beginQuickQuiz();
        }

        // This function starts a quiz with only wrong words.
        function startWrongWordsQuiz() {
            const wrongWords = getQuickWrongWords();
            const wrongWordObjects = vocabulary.filter(item => wrongWords.includes(item.word));

            if (wrongWordObjects.length === 0) {
                alert("You do not have any wrong words to practice right now.");
                return;
            }

            if (vocabulary.length < 4) {
                alert("You need at least 4 vocabulary words to start this quiz.");
                return;
            }

            quickMode = "wrong";
            quickWords = shuffleArray(wrongWordObjects);
            quickTitleEl.textContent = "Wrong Words Quiz";
            quickScreen.style.backgroundImage = 'url("website_images/image6.jpg")';
            beginQuickQuiz();
        }

        // This function prepares the quick quiz screen.
        function beginQuickQuiz() {
            quickQuestionNumber = 0;
            quickScore = 0;
            quickWrongCount = 0;
            quickResultEl.textContent = "";
            nextQuickButton.style.display = "none";
            showQuickQuiz();
            showQuickQuestion();
        }

        // This function displays one quick quiz question.
        function showQuickQuestion() {
            const currentWord = quickWords[quickQuestionNumber];

            quickCorrectAnswer = currentWord.explanation;
            quickQuestionEl.textContent = `What does "${currentWord.word}" mean?`;
            quickChoicesEl.innerHTML = "";
            quickResultEl.textContent = "";
            nextQuickButton.style.display = "none";

            let wrongAnswers = getWrongDefinitions(currentWord);
            let allChoices = shuffleArray([
                quickCorrectAnswer,
                ...wrongAnswers
            ]);

            allChoices.forEach(choiceText => {
                const button = document.createElement("button");
                button.textContent = choiceText;

                button.onclick = function() {
                    checkQuickAnswer(choiceText, currentWord);
                };

                quickChoicesEl.appendChild(button);
            });

            updateQuickStats();
        }

        // This function checks a quick quiz answer.
        function checkQuickAnswer(userAnswer, currentWord) {
            const allButtons = quickChoicesEl.querySelectorAll("button");

            allButtons.forEach(button => {
                button.disabled = true;

                if (button.textContent === quickCorrectAnswer) {
                    button.style.border = "3px solid green";
                }

                if (button.textContent === userAnswer && userAnswer !== quickCorrectAnswer) {
                    button.style.border = "3px solid red";
                }
            });

            if (userAnswer === quickCorrectAnswer) {
                quickScore++;
                removeQuickWrongWord(currentWord.word);
                quickResultEl.innerHTML =
                    "Correct!<br><strong>Example:</strong><br>" +
                    (currentWord.example || "");
            } else {
                quickWrongCount++;
                addQuickWrongWord(currentWord.word);
                quickResultEl.innerHTML =
                    "Incorrect.<br><strong>Meaning:</strong><br>" +
                    (currentWord.explanation || "") +
                    "<br><br><strong>Example:</strong><br>" +
                    (currentWord.example || "");
            }

            nextQuickButton.style.display = "inline-block";
            updateQuickStats();
        }

        // This function updates the quick quiz score and progress.
        function updateQuickStats() {
            const questionNumber = Math.min(quickQuestionNumber + 1, quickWords.length);
            const wrongWordsRemaining = getQuickWrongWords().length;

            quickProgressEl.textContent = "Question " + questionNumber + " / " + quickWords.length;
            quickStatsEl.textContent =
                "Right: " + quickScore +
                " | Wrong: " + quickWrongCount +
                " | Saved wrong words: " + wrongWordsRemaining;
        }

        // This function moves to the next quick quiz question.
        function goToNextQuickQuestion() {
            quickQuestionNumber++;

            if (quickQuestionNumber < quickWords.length) {
                showQuickQuestion();
            } else {
                finishQuickQuiz();
            }
        }

        // This function finishes the quick quiz.
        function finishQuickQuiz() {
            quickQuestionEl.textContent = "Quick Quiz Finished!";
            quickChoicesEl.innerHTML = "";
            quickResultEl.textContent = "Final score: " + quickScore + " / " + quickWords.length;
            nextQuickButton.style.display = "none";

            if (quickMode === "wrong" && getQuickWrongWords().length === 0) {
                quickStatsEl.textContent = "You got every saved wrong word correct.";
            } else {
                updateQuickStats();
            }
        }

        // This function chooses one blank sentence for a word.
        // ---------- Fill-in-the-blank helpers and Test mode ----------
        function getRandomBlankExample(wordItem, answerType) {
            const examples = Array.isArray(wordItem.blankExamples)
                ? wordItem.blankExamples.filter(example => example.sentence && example.answer)
                : [];
            const matchingExamples = answerType
                ? examples.filter(example => getAnswerType(example.answer) === answerType)
                : examples;

            if (matchingExamples.length > 0) {
                return matchingExamples[Math.floor(Math.random() * matchingExamples.length)];
            }

            return {
                sentence: wordItem.blankExample,
                answer: wordItem.blankAnswer || wordItem.word,
                fullSentence: wordItem.example || ""
            };
        }

        // This function groups answers by grammar shape so choices do not give away the answer.
        function getAnswerType(answer) {
            const lowerAnswer = answer.toLowerCase();

            if (lowerAnswer.endsWith("ing")) {
                return "ing";
            }

            if (
                lowerAnswer.endsWith("ed") ||
                lowerAnswer.endsWith("ied") ||
                lowerAnswer === "bent" ||
                lowerAnswer === "fled" ||
                lowerAnswer === "undertook"
            ) {
                return "past";
            }

            if (answer.includes(" ")) {
                return "phrase";
            }

            return "base";
        }

        // This function prepares one word for the test with a chosen sentence.
        function prepareTestWord(wordItem, answerType) {
            const blankExample = getRandomBlankExample(wordItem, answerType);

            return {
                ...wordItem,
                testBlankExample: blankExample.sentence,
                testBlankAnswer: blankExample.answer,
                testFullSentence: blankExample.fullSentence || blankExample.sentence.replace("_____", blankExample.answer)
            };
        }

        // This function chooses wrong choices with the same grammar shape as the correct answer.
        function getMatchingWrongTestChoices(correctWord, answerType) {
            const matchingChoices = shuffleArray(vocabulary)
                .filter(item => item.word !== correctWord.word)
                .map(item => prepareTestWord(item, answerType))
                .filter(item => getAnswerType(item.testBlankAnswer || item.blankAnswer || item.word) === answerType);
            const fallbackChoices = shuffleArray(vocabulary)
                .filter(item => item.word !== correctWord.word)
                .map(item => prepareTestWord(item));
            const combinedChoices = [...matchingChoices, ...fallbackChoices];
            const uniqueChoices = [];

            combinedChoices.forEach(item => {
                const label = item.testBlankAnswer || item.blankAnswer || item.word;

                if (!uniqueChoices.some(choice => (choice.testBlankAnswer || choice.blankAnswer || choice.word) === label)) {
                    uniqueChoices.push(item);
                }
            });

            return uniqueChoices.slice(0, 3);
        }

        // This function starts the 90 minute test.
        function startTest() {
            const testReadyWords = vocabulary.filter(item =>
                (Array.isArray(item.blankExamples) && item.blankExamples.length > 0) ||
                (item.blankExample && item.blankAnswer)
            );

            if (testReadyWords.length < 4) {
                alert("You need at least 4 words with blank examples to start the test.");
                return;
            }

            testWords = shuffleArray(testReadyWords)
                .slice(0, Math.min(100, testReadyWords.length))
                .map(prepareTestWord);
            testQuestionNumber = 0;
            testScore = 0;
            testTimeLeft = 90 * 60;
            testResultEl.textContent = "";
            nextTestButton.style.display = "none";
            showTest();
            startTestTimer();
            showTestQuestion();
        }

        // This function starts the countdown timer.
        function startTestTimer() {
            stopTestTimer();
            updateTestTimerDisplay();

            testTimer = setInterval(function() {
                testTimeLeft--;
                updateTestTimerDisplay();

                if (testTimeLeft <= 0) {
                    finishTest("Time is up!");
                }
            }, 1000);
        }

        // This function updates the timer text.
        function updateTestTimerDisplay() {
            const minutes = Math.floor(testTimeLeft / 60);
            const seconds = testTimeLeft % 60;
            const secondsText = seconds < 10 ? "0" + seconds : seconds;

            testTimerEl.textContent = "Time: " + minutes + ":" + secondsText;
        }

        // This function displays one test question.
        function showTestQuestion() {
            currentTestWord = testWords[testQuestionNumber];
            testCorrectAnswer = currentTestWord.testBlankAnswer || currentTestWord.blankAnswer || currentTestWord.word;
            testQuestionEl.textContent = currentTestWord.testBlankExample || currentTestWord.blankExample;
            testChoicesEl.innerHTML = "";
            testResultEl.textContent = "";
            nextTestButton.style.display = "none";

            const answerType = getAnswerType(testCorrectAnswer);
            const wrongChoices = getMatchingWrongTestChoices(currentTestWord, answerType);
            const allChoices = shuffleArray([
                {
                    label: testCorrectAnswer,
                    item: currentTestWord,
                    correct: true
                },
                ...wrongChoices.map(item => ({
                    label: item.testBlankAnswer || item.blankAnswer || item.word,
                    item: item,
                    correct: false
                }))
            ]);

            allChoices.forEach(choice => {
                const button = document.createElement("button");
                button.textContent = choice.label;

                button.onclick = function() {
                    checkTestAnswer(choice);
                };

                testChoicesEl.appendChild(button);
            });

            updateTestStats();
        }

        // This function checks the chosen test answer.
        function checkTestAnswer(choice) {
            const allButtons = testChoicesEl.querySelectorAll("button");

            allButtons.forEach(button => {
                button.disabled = true;

                if (button.textContent === testCorrectAnswer) {
                    button.style.border = "3px solid green";
                }

                if (button.textContent === choice.label && !choice.correct) {
                    button.style.border = "3px solid red";
                }
            });

            if (choice.correct) {
                testScore++;
                testResultEl.innerHTML =
                    "Correct!<br><strong>Full sentence:</strong><br>" +
                    (currentTestWord.testFullSentence || currentTestWord.example || "") +
                    "<br><br><strong>Definition of " +
                    choice.label +
                    ":</strong><br>" +
                    (choice.item.explanation || "");
            } else {
                testResultEl.innerHTML =
                    "Incorrect.<br><strong>Correct answer:</strong> " +
                    testCorrectAnswer +
                    "<br><strong>Definition of correct word:</strong><br>" +
                    (currentTestWord.explanation || "") +
                    "<br><strong>Correct sentence:</strong><br>" +
                    (currentTestWord.testFullSentence || currentTestWord.example || "") +
                    "<br><br><strong>The word you chose:</strong> " +
                    choice.label +
                    "<br><strong>Definition of the word you chose:</strong><br>" +
                    (choice.item.explanation || "") +
                    "<br><strong>Sentence for that word:</strong><br>" +
                    (choice.item.testFullSentence || choice.item.example || "");
            }

            nextTestButton.style.display = "inline-block";
            updateTestStats();
        }

        // This function updates test progress and score.
        function updateTestStats() {
            const questionNumber = Math.min(testQuestionNumber + 1, testWords.length);

            testProgressEl.textContent = "Question " + questionNumber + " / " + testWords.length;
            testStatsEl.textContent = "Score: " + testScore + " / " + testWords.length;
        }

        // This function moves to the next test question.
        function goToNextTestQuestion() {
            testQuestionNumber++;

            if (testQuestionNumber < testWords.length) {
                showTestQuestion();
            } else {
                finishTest("Test finished!");
            }
        }

        // This function finishes the test.
        function finishTest(message) {
            stopTestTimer();
            testQuestionEl.textContent = message;
            testChoicesEl.innerHTML = "";
            testResultEl.textContent = "Final score: " + testScore + " / " + testWords.length;
            testProgressEl.textContent = "Complete";
            testStatsEl.textContent = "Score: " + testScore + " / " + testWords.length;
            nextTestButton.style.display = "none";
        }

        // This function starts a new puzzle game.
        // ---------- Photo puzzle game ----------
        function startPuzzleGame() {
            const puzzleReadyWords = vocabulary.filter(item =>
                (Array.isArray(item.blankExamples) && item.blankExamples.length > 0) ||
                (item.blankExample && item.blankAnswer)
            );

            if (puzzleReadyWords.length < 4) {
                alert("You need at least 4 words with blank examples to start the puzzle game.");
                return;
            }

            puzzleWords = shuffleArray(puzzleReadyWords).map(prepareTestWord);
            puzzleQuestionNumber = 0;
            puzzleScore = 0;
            currentPuzzleImage = puzzleImages[Math.floor(Math.random() * puzzleImages.length)];
            remainingPuzzlePieces = shuffleArray(
                Array.from({ length: puzzlePieceCount }, (_, index) => index)
            );
            puzzleBoardEl.innerHTML = "";
            puzzleTrayEl.innerHTML = "";
            puzzleMessageEl.textContent = "Answer correctly to earn puzzle pieces.";
            nextPuzzleQuestionButton.style.display = "none";
            puzzlePlayAgainButton.style.display = "none";
            puzzleHomeButton.style.display = "none";
            showPuzzleGame();
            showPuzzleQuestion();
        }

        // This function displays one puzzle game question.
        function showPuzzleQuestion() {
            const currentWord = puzzleWords[puzzleQuestionNumber];

            puzzleCorrectAnswer = currentWord.testBlankAnswer || currentWord.blankAnswer || currentWord.word;
            puzzleQuestionEl.textContent = currentWord.testBlankExample || currentWord.blankExample;
            puzzleChoicesEl.innerHTML = "";
            puzzleResultEl.textContent = "";
            nextPuzzleQuestionButton.style.display = "none";

            const answerType = getAnswerType(puzzleCorrectAnswer);
            const wrongChoices = getMatchingWrongTestChoices(currentWord, answerType);
            let allChoices = shuffleArray([
                {
                    label: puzzleCorrectAnswer,
                    item: currentWord,
                    correct: true
                },
                ...wrongChoices.map(item => ({
                    label: item.testBlankAnswer || item.blankAnswer || item.word,
                    item: item,
                    correct: false
                }))
            ]);

            allChoices.forEach(choice => {
                const button = document.createElement("button");
                button.textContent = choice.label;

                button.onclick = function() {
                    checkPuzzleAnswer(choice);
                };

                puzzleChoicesEl.appendChild(button);
            });

            updatePuzzleScore();
        }

        // This function checks the answer in puzzle mode.
        function checkPuzzleAnswer(choice) {
            const allButtons = puzzleChoicesEl.querySelectorAll("button");

            allButtons.forEach(button => {
                button.disabled = true;

                if (button.textContent === puzzleCorrectAnswer) {
                    button.style.border = "3px solid green";
                }

                if (button.textContent === choice.label && !choice.correct) {
                    button.style.border = "3px solid red";
                }
            });

            if (choice.correct) {
                puzzleScore++;
                unlockPuzzlePiece();
                puzzleResultEl.innerHTML =
                    "Correct! You earned a puzzle piece.<br><strong>Full sentence:</strong><br>" +
                    (choice.item.testFullSentence || choice.item.example || "") +
                    "<br><br><strong>Definition of " +
                    choice.label +
                    ":</strong><br>" +
                    (choice.item.explanation || "");
            } else {
                puzzleResultEl.innerHTML =
                    "Incorrect.<br><strong>Correct answer:</strong> " +
                    puzzleCorrectAnswer +
                    "<br><strong>Definition of correct word:</strong><br>" +
                    (puzzleWords[puzzleQuestionNumber].explanation || "") +
                    "<br><strong>Correct sentence:</strong><br>" +
                    (puzzleWords[puzzleQuestionNumber].testFullSentence || puzzleWords[puzzleQuestionNumber].example || "") +
                    "<br><br><strong>The word you chose:</strong> " +
                    choice.label +
                    "<br><strong>Definition of the word you chose:</strong><br>" +
                    (choice.item.explanation || "") +
                    "<br><strong>Sentence for that word:</strong><br>" +
                    (choice.item.testFullSentence || choice.item.example || "");
            }

            nextPuzzleQuestionButton.style.display = "inline-block";
            updatePuzzleScore();
        }

        // This function unlocks one new puzzle piece.
        function unlockPuzzlePiece() {
            if (remainingPuzzlePieces.length === 0) {
                puzzleMessageEl.textContent = "All pieces are unlocked. Finish placing them to complete the puzzle.";
                return;
            }

            const pieceNumber = remainingPuzzlePieces.shift();
            const piece = createPuzzlePiece(pieceNumber);

            puzzleTrayEl.appendChild(piece);
            puzzleMessageEl.textContent = "Drag your new piece onto the puzzle board. It will snap in when it is close.";
        }

        // This function creates a draggable puzzle piece.
        function createPuzzlePiece(pieceNumber) {
            const piece = document.createElement("div");
            const row = Math.floor(pieceNumber / puzzleGridSize);
            const col = pieceNumber % puzzleGridSize;

            piece.className = "puzzlePiece";
            piece.dataset.piece = pieceNumber;
            piece.dataset.row = row;
            piece.dataset.col = col;
            piece.style.backgroundImage = `url("${currentPuzzleImage}")`;
            setPuzzlePieceImage(piece);
            makePuzzlePieceDraggable(piece);

            return piece;
        }

        // This function lines up the image inside a puzzle piece.
        function setPuzzlePieceImage(piece) {
            const boardSize = puzzleBoardEl.clientWidth || 440;
            const pieceSize = boardSize / puzzleGridSize;
            const row = Number(piece.dataset.row);
            const col = Number(piece.dataset.col);

            piece.style.width = pieceSize + "px";
            piece.style.height = pieceSize + "px";
            piece.style.backgroundSize = boardSize + "px " + boardSize + "px";
            piece.style.backgroundPosition = (-col * pieceSize) + "px " + (-row * pieceSize) + "px";
        }

        // This function makes a puzzle piece draggable.
        function makePuzzlePieceDraggable(piece) {
            piece.onpointerdown = function(event) {
                if (piece.classList.contains("placed")) {
                    return;
                }

                event.preventDefault();
                piece.setPointerCapture(event.pointerId);
                piece.classList.add("dragging");
                document.body.appendChild(piece);

                piece.style.position = "fixed";
                piece.style.left = (event.clientX - piece.offsetWidth / 2) + "px";
                piece.style.top = (event.clientY - piece.offsetHeight / 2) + "px";

                piece.onpointermove = function(moveEvent) {
                    piece.style.left = (moveEvent.clientX - piece.offsetWidth / 2) + "px";
                    piece.style.top = (moveEvent.clientY - piece.offsetHeight / 2) + "px";
                };

                piece.onpointerup = function(upEvent) {
                    piece.releasePointerCapture(upEvent.pointerId);
                    piece.onpointermove = null;
                    piece.onpointerup = null;
                    piece.classList.remove("dragging");
                    dropPuzzlePiece(piece);
                };
            };
        }

        // This function drops a puzzle piece and snaps it into place if close enough.
        function dropPuzzlePiece(piece) {
            const boardRect = puzzleBoardEl.getBoundingClientRect();
            const pieceRect = piece.getBoundingClientRect();
            const boardSize = puzzleBoardEl.clientWidth;
            const pieceSize = boardSize / puzzleGridSize;
            const row = Number(piece.dataset.row);
            const col = Number(piece.dataset.col);
            const correctLeft = boardRect.left + col * pieceSize;
            const correctTop = boardRect.top + row * pieceSize;
            const distanceX = Math.abs(pieceRect.left - correctLeft);
            const distanceY = Math.abs(pieceRect.top - correctTop);

            if (distanceX < pieceSize / 2 && distanceY < pieceSize / 2) {
                puzzleBoardEl.appendChild(piece);
                piece.style.position = "absolute";
                piece.style.left = (col * pieceSize) + "px";
                piece.style.top = (row * pieceSize) + "px";
                piece.classList.add("placed");
                setPuzzlePieceImage(piece);
                puzzleMessageEl.textContent = "Piece connected!";
                checkPuzzleComplete();
            } else {
                puzzleTrayEl.appendChild(piece);
                piece.style.position = "static";
                piece.style.left = "";
                piece.style.top = "";
                setPuzzlePieceImage(piece);
                puzzleMessageEl.textContent = "Not quite. Drag the piece closer to where it belongs.";
            }
        }

        // This function checks whether the puzzle is finished.
        function checkPuzzleComplete() {
            const placedPieces = puzzleBoardEl.querySelectorAll(".puzzlePiece.placed").length;

            if (placedPieces === puzzlePieceCount) {
                puzzleMessageEl.textContent = "Congratulations! You completed the puzzle!";
                puzzleQuestionEl.textContent = "Puzzle Complete!";
                puzzleChoicesEl.innerHTML = "";
                puzzleResultEl.textContent = "";
                nextPuzzleQuestionButton.style.display = "none";
                puzzlePlayAgainButton.style.display = "inline-block";
                puzzleHomeButton.style.display = "inline-block";
            }
        }

        // This function updates the puzzle score.
        function updatePuzzleScore() {
            const placedPieces = puzzleBoardEl.querySelectorAll(".puzzlePiece.placed").length;
            const earnedPieces = document.querySelectorAll(".puzzlePiece").length;

            puzzleScoreEl.textContent =
                "Score: " + puzzleScore +
                " / " + puzzleWords.length +
                " | Pieces earned: " + earnedPieces +
                " | Pieces connected: " + placedPieces + " / " + puzzlePieceCount;
        }

        // This function moves to the next puzzle question.
        function goToNextPuzzleQuestion() {
            puzzleQuestionNumber++;

            if (puzzleQuestionNumber < puzzleWords.length) {
                showPuzzleQuestion();
            } else {
                puzzleQuestionEl.textContent = "Puzzle Game Finished!";
                puzzleChoicesEl.innerHTML = "";
                puzzleResultEl.textContent = "Final score: " + puzzleScore + " / " + puzzleWords.length;
                nextPuzzleQuestionButton.style.display = "none";
            }
        }

        // This function creates an empty 10 by 10 game board.
        // ---------- Tetris-style block game ----------
        function resetGameBoard() {
            gameBoard = [];

            for (let row = 0; row < 10; row++) {
                gameBoard[row] = [];

                for (let col = 0; col < 10; col++) {
                    gameBoard[row][col] = false;
                }
            }
        }

        // This function draws the game board on the page.
        function drawGameBoard() {
            gameBoardEl.innerHTML = "";

            for (let row = 0; row < 10; row++) {
                for (let col = 0; col < 10; col++) {
                    const cell = document.createElement("button");
                    cell.className = "gameCell";

                    if (gameBoard[row][col]) {
                        cell.classList.add("filled");
                    }

                    if (isPendingCell(row, col)) {
                        cell.classList.add("pending");
                    }

                    cell.onclick = function() {
                        placeShape(row, col);
                    };

                    gameBoardEl.appendChild(cell);
                }
            }
        }

        // This function updates the rows cleared display.
        function updateRowsClearedDisplay() {
            rowsClearedEl.textContent = "Rows Cleared: " + totalRowsCleared;
        }

        // This function checks whether a board cell is part of the previewed shape.
        function isPendingCell(row, col) {
            if (!pendingPlacement || !currentShape) {
                return false;
            }

            return currentShape.some(square => {
                return pendingPlacement.row + square[0] === row &&
                    pendingPlacement.col + square[1] === col;
            });
        }

        // This function chooses a random block shape.
        function getRandomShape() {
            const randomShape = blockShapes[Math.floor(Math.random() * blockShapes.length)];

            return randomShape.map(square => [square[0], square[1]]);
        }

        // This function draws the earned shape preview.
        function drawShapePreview() {
            shapePreviewEl.innerHTML = "";

            for (let row = 0; row < 4; row++) {
                for (let col = 0; col < 4; col++) {
                    const previewCell = document.createElement("div");
                    previewCell.className = "previewCell";

                    if (currentShape && currentShape.some(square => square[0] === row && square[1] === col)) {
                        previewCell.classList.add("filled");
                    }

                    shapePreviewEl.appendChild(previewCell);
                }
            }
        }

        // This function moves a shape back to the top-left of its preview box.
        function normalizeShape(shape) {
            const smallestRow = Math.min(...shape.map(square => square[0]));
            const smallestCol = Math.min(...shape.map(square => square[1]));

            return shape.map(square => [
                square[0] - smallestRow,
                square[1] - smallestCol
            ]);
        }

        // This function rotates the earned shape.
        function rotateShape() {
            if (!currentShape || !canPlaceShape) {
                return;
            }

            currentShape = currentShape.map(square => [square[1], -square[0]]);
            currentShape = normalizeShape(currentShape);
            pendingPlacement = null;
            confirmShapeButton.style.display = "none";
            gameMessageEl.textContent = "Shape rotated. Click the board again to preview its new position.";
            drawShapePreview();
            drawGameBoard();
        }

        // This function checks whether a shape fits on the board.
        function shapeFits(startRow, startCol) {
            return currentShape.every(square => {
                const row = startRow + square[0];
                const col = startCol + square[1];

                return row >= 0 &&
                    row < 10 &&
                    col >= 0 &&
                    col < 10 &&
                    !gameBoard[row][col];
            });
        }

        // This function previews the earned shape on the board.
        function placeShape(startRow, startCol) {
            if (!canPlaceShape || !currentShape) {
                gameMessageEl.textContent = "Answer correctly to earn a block shape.";
                return;
            }

            if (!shapeFits(startRow, startCol)) {
                gameMessageEl.textContent = "That shape does not fit there. Try another spot.";
                return;
            }

            pendingPlacement = {
                row: startRow,
                col: startCol
            };

            confirmShapeButton.style.display = "inline-block";
            gameMessageEl.textContent = "Preview placed. Press Confirm Placement to keep it, or click another spot to move it.";
            drawGameBoard();
        }

        // This function locks the previewed shape into the board.
        function confirmShapePlacement() {
            if (!pendingPlacement || !currentShape) {
                gameMessageEl.textContent = "Click the board first to preview where the shape should go.";
                return;
            }

            if (!shapeFits(pendingPlacement.row, pendingPlacement.col)) {
                pendingPlacement = null;
                confirmShapeButton.style.display = "none";
                gameMessageEl.textContent = "That spot no longer works. Choose another spot.";
                drawGameBoard();
                return;
            }

            currentShape.forEach(square => {
                const row = pendingPlacement.row + square[0];
                const col = pendingPlacement.col + square[1];

                gameBoard[row][col] = true;
            });

            const clearedRows = clearFullRows();
            totalRowsCleared += clearedRows;
            updateRowsClearedDisplay();

            canPlaceShape = false;
            currentShape = null;
            pendingPlacement = null;
            rotateShapeButton.style.display = "none";
            confirmShapeButton.style.display = "none";
            nextGameQuestionButton.style.display = "none";
            drawShapePreview();
            drawGameBoard();

            if (clearedRows > 0) {
                const rowWord = clearedRows === 1 ? " row." : " rows.";
                gameMessageEl.textContent = "Nice! You cleared " + clearedRows + rowWord + " Next question coming up.";
            } else {
                gameMessageEl.textContent = "Block placed. Next question coming up.";
            }

            setTimeout(goToNextGameQuestion, 700);
        }

        // This function removes full rows from the board.
        function clearFullRows() {
            let clearedRows = 0;

            for (let row = 0; row < 10; row++) {
                const isFullRow = gameBoard[row].every(cell => cell === true);

                if (isFullRow) {
                    clearedRows++;

                    for (let col = 0; col < 10; col++) {
                        gameBoard[row][col] = false;
                    }
                }
            }

            return clearedRows;
        }

        // This function displays one game question.
        function showGameQuestion() {
            const currentWord = gameWords[gameQuestionNumber];

            gameCorrectAnswer = currentWord.explanation;
            gameQuestionEl.textContent = `What does "${currentWord.word}" mean?`;
            gameChoicesEl.innerHTML = "";
            gameResultEl.textContent = "";
            pendingPlacement = null;
            confirmShapeButton.style.display = "none";
            nextGameQuestionButton.style.display = "none";
            drawGameBoard();

            let wrongAnswers = getWrongDefinitions(currentWord);
            let allChoices = shuffleArray([
                gameCorrectAnswer,
                ...wrongAnswers
            ]);

            allChoices.forEach(choiceText => {
                const button = document.createElement("button");
                button.textContent = choiceText;

                button.onclick = function() {
                    checkGameAnswer(choiceText, currentWord);
                };

                gameChoicesEl.appendChild(button);
            });

            gameScoreEl.textContent = "Score: " + gameScore + " / " + gameWords.length;
            updateRowsClearedDisplay();
        }

        // This function checks the answer in game mode.
        function checkGameAnswer(userAnswer, currentWord) {
            const allButtons = gameChoicesEl.querySelectorAll("button");

            allButtons.forEach(button => {
                button.disabled = true;

                if (button.textContent === gameCorrectAnswer) {
                    button.style.border = "3px solid green";
                }

                if (button.textContent === userAnswer && userAnswer !== gameCorrectAnswer) {
                    button.style.border = "3px solid red";
                }
            });

            if (userAnswer === gameCorrectAnswer) {
                gameScore++;
                currentShape = getRandomShape();
                canPlaceShape = true;
                pendingPlacement = null;
                gameResultEl.textContent = "Correct! Place your block on the board.";
                gameMessageEl.textContent = "Click a board square to preview the shape. Use Rotate if you want to turn it.";
                rotateShapeButton.style.display = "inline-block";
                confirmShapeButton.style.display = "none";
                drawShapePreview();
            } else {
                canPlaceShape = false;
                currentShape = null;
                pendingPlacement = null;
                gameResultEl.textContent = "Incorrect. The answer was: " + gameCorrectAnswer;
                gameMessageEl.textContent = currentWord.example || "Try the next question.";
                rotateShapeButton.style.display = "none";
                confirmShapeButton.style.display = "none";
                nextGameQuestionButton.style.display = "inline-block";
                drawShapePreview();
                drawGameBoard();
            }

            gameScoreEl.textContent = "Score: " + gameScore + " / " + gameWords.length;
        }

        // This function starts a new quiz game.
        function startGame() {
            if (vocabulary.length < 4) {
                alert("You need at least 4 vocabulary words to start the game.");
                return;
            }

            gameWords = shuffleArray(vocabulary);
            gameQuestionNumber = 0;
            gameScore = 0;
            totalRowsCleared = 0;
            currentShape = null;
            canPlaceShape = false;
            pendingPlacement = null;
            resetGameBoard();
            drawGameBoard();
            drawShapePreview();
            rotateShapeButton.style.display = "none";
            confirmShapeButton.style.display = "none";
            nextGameQuestionButton.style.display = "none";
            updateRowsClearedDisplay();
            gameMessageEl.textContent = "Answer correctly to earn a block shape.";
            showGame();
            showGameQuestion();
        }

        // This function moves to the next game question.
        function goToNextGameQuestion() {
            gameQuestionNumber++;

            if (gameQuestionNumber < gameWords.length) {
                showGameQuestion();
            } else {
                gameQuestionEl.textContent = "Game Finished!";
                gameChoicesEl.innerHTML = "";
                gameResultEl.textContent = "";
                gameMessageEl.textContent = "Final score: " + gameScore + " / " + gameWords.length;
                rotateShapeButton.style.display = "none";
                confirmShapeButton.style.display = "none";
                nextGameQuestionButton.style.display = "none";
            }
        }

        // ---------- Button event handlers ----------
        // This final section connects HTML buttons to the functions above.

        // When user clicks the title, go home.
        title.onclick = function() {
            showHome();
        };

        // When user clicks Options...
        optionsButton.onclick = function() {
            if (optionsMenu.style.display === "flex") {
                optionsMenu.style.display = "none";
            } else {
                optionsMenu.style.display = "flex";
            }
        };

        // When user clicks Start Quiz...
        startButton.onclick = function() {
            // Make sure there are at least 4 words.
            // One correct answer plus 3 wrong answers.
            if (vocabulary.length < 4) {
                alert("You need at least 4 vocabulary words to start the quiz.");
                return;
            }

            // Start from first question.
            currentQuestion = 0;

            // Reset score.
            score = 0;

            // Shuffle vocabulary for this quiz.
            quizWords = shuffleArray(vocabulary);

            // Show quiz screen.
            showQuiz();

            // Show first question.
            showQuestion();
        };

        // When user clicks Quick Quiz...
        quickQuizButton.onclick = function() {
            startQuickQuiz();
        };

        // When user clicks Practice Wrong Words...
        wrongWordsButton.onclick = function() {
            startWrongWordsQuiz();
        };

        // When user clicks Test...
        testButton.onclick = function() {
            startTest();
        };

        // When user clicks Play Quiz Game...
        gameButton.onclick = function() {
            startGame();
        };

        // When user clicks Puzzle Game...
        puzzleGameButton.onclick = function() {
            startPuzzleGame();
        };

        // When user clicks Countdown Calendar...
        calendarButton.onclick = function() {
            showCalendar();
        };

        // When user clicks Jerusalem World...
        worldMapButton.onclick = function() {
            showWorldMap();
        };

        // When user closes the Jerusalem question...
        closeWorldQuestionButton.onclick = function() {
            closeWorldQuestion();
        };

        // When user closes a Jerusalem photo...
        closeWorldPhotoButton.onclick = function() {
            closeWorldPhoto();
        };

        // When user clicks Rotate Shape...
        rotateShapeButton.onclick = function() {
            rotateShape();
        };

        // When user clicks Confirm Placement...
        confirmShapeButton.onclick = function() {
            confirmShapePlacement();
        };

        // When user clicks Next Question in game mode...
        nextGameQuestionButton.onclick = function() {
            goToNextGameQuestion();
        };

        // When user clicks Next Question in puzzle mode...
        nextPuzzleQuestionButton.onclick = function() {
            goToNextPuzzleQuestion();
        };

        // When user clicks Play Again after completing a puzzle...
        puzzlePlayAgainButton.onclick = function() {
            startPuzzleGame();
        };

        // When user clicks Home after completing a puzzle...
        puzzleHomeButton.onclick = function() {
            showHome();
        };



        // When user clicks Next Question in quick quiz...
        nextQuickButton.onclick = function() {
            goToNextQuickQuestion();
        };



        // When user clicks Next Question in test mode...
        nextTestButton.onclick = function() {
            goToNextTestQuestion();
        };



        // When user clicks Next Question...
        nextButton.onclick = function() {
            // Move to next question number.
            currentQuestion++;

            // If there are still questions left...
            if (currentQuestion < quizWords.length) {
                // Show next question.
                showQuestion();
            } else {
                // Quiz is finished.
                questionEl.textContent = "Quiz Finished!";

                // Remove answer buttons.
                choicesEl.innerHTML = "";

                // Clear result.
                resultEl.textContent = "";

                // Show final score.
                explanationEl.textContent = "Final score: " + score + " / " + quizWords.length;

                // Hide next button.
                nextButton.style.display = "none";
            }
        };

        // JavaScript ends here
