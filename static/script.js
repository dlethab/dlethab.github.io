let remainingAttempts = 3;
let guessProgress = [];
let gameOver = false;
let correctWordArray = [];
let currentIndex = 0; // Track the currently active cell

//pull date and game # from html
const gameInfoText = document.getElementById("game-info").innerText;
// Split the text to get the game number and current date
const parts = gameInfoText.split(" – ");
const gameNumber = parts[0].replace("Dial In #", "").trim();  // Extracts the game number
const currentDate = parts[1].trim();  // Extracts the current date
console.log('Game Number:', gameNumber);
console.log('Current Date:', currentDate);


document.addEventListener("DOMContentLoaded", function () {
    // ensures that the code word was loaded into the site correctly`
    let numberCodeElement = document.querySelector(".number-code");
    
    if (!numberCodeElement) {
        console.error("Error: .number-code element not found.");
        return;
    }

    let correctWord = numberCodeElement.dataset.word;
    
    if (!correctWord) {
        console.error("Error: No word found in dataset.");
        return;
    }

    correctWordArray = correctWord.toUpperCase().split("");
    
    console.log("Correct Word Loaded:", correctWordArray);
    
    displayNumberGrid(correctWordArray);
});

function displayNumberGrid(wordArray) {
    console.log(wordArray);
    const numberGrid = document.getElementById("number-grid");
    numberGrid.innerHTML = "";
    wordArray.forEach(char => {
        const cell = document.createElement("div");
        cell.classList.add("grid-cell");
        cell.textContent = convertLetterToNumber(char);
        numberGrid.appendChild(cell);
    });
}

function convertLetterToNumber(letter) {
    const keypad = {
        'A': '2', 'B': '2', 'C': '2',
        'D': '3', 'E': '3', 'F': '3',
        'G': '4', 'H': '4', 'I': '4',
        'J': '5', 'K': '5', 'L': '5',
        'M': '6', 'N': '6', 'O': '6',
        'P': '7', 'Q': '7', 'R': '7', 'S': '7',
        'T': '8', 'U': '8', 'V': '8',
        'W': '9', 'X': '9', 'Y': '9', 'Z': '9',
        ' ': '0'
    };
    return keypad[letter] || '-';
}

function submitGuess() {
    if (gameOver) return;

    const cells = document.querySelectorAll(".input-cell");

    // Collect user input from the grid
    let guess = Array.from(cells).map(cell => (cell.textContent.length === 0 ? " " : cell.textContent)).join("");

    console.log("User Guess:", guess);

    if (guess.length !== 10) {
        console.error("Error: Guess is not exactly 10 characters.");
        return;
    }

    // Store the current guess
    guessProgress.push(guess);

    // Display the latest guess first
    displayGuess(guess);

    console.log("Attempts Before Submission:", remainingAttempts);
    if (remainingAttempts > 0) {
        remainingAttempts--; // Only decrease if attempts are remaining
    }
    console.log("Attempts After Submission:", remainingAttempts);

    // Hide attempt dots
    let dotElement = document.getElementById("dot" + (remainingAttempts + 1));
    if (dotElement) {
        dotElement.style.visibility = "hidden";
    }



    // If the game is over, DO NOT create a new input grid
    if (guess === correctWordArray.join("") || remainingAttempts <= 0) {
        console.log("Game Over: No new grid should be created.");
        endGame(guess === correctWordArray.join(""));
        return; // Stop execution
    }

    // Delay clearing input grid slightly to let the previous guess display, but only if the game isn't over
    setTimeout(() => {
        if (!gameOver) clearInputGrid();
    }, 0);
}

function displayGuess(guessString) {
    const guessContainer = document.getElementById("guess-container");

    let guessArray = guessString.split("");

    let guessRow;

    // ✅ If the game is over, update the last row instead of appending a new one
    if (gameOver) {
        guessRow = guessContainer.lastElementChild; // Get the last guess row
        console.log("🏁 Game Over: Updating the final guess row.");
    } else {
        guessRow = document.createElement("div");
        guessRow.classList.add("guess-row");
    }

    // Ensure the row is cleared before adding new cells
    guessRow.innerHTML = "";

    guessArray.forEach((letter, index) => {
        const cell = document.createElement("div");
        cell.classList.add("grid-cell");
        cell.textContent = letter;

        // ✅ Highlight correct letters in green
        if (letter === correctWordArray[index]) {
            cell.classList.add("correct");
        }

        guessRow.appendChild(cell);
    });

    // ✅ Append the row before setting gameOver to ensure highlighting applies
    if (!gameOver) {
        guessContainer.appendChild(guessRow);
    }

    // ✅ Now set gameOver AFTER the final row has been highlighted
    if (guessString === correctWordArray.join("") || remainingAttempts <= 0) {
        console.log("🏁 Game Over: Setting gameOver to true AFTER final row update.");
        gameOver = true;
    }
    
    
    
}


function clearInputGrid() {
    if (gameOver) return; // Prevents clearing the grid if the game has ended

    const cells = document.querySelectorAll(".input-cell");
    cells.forEach(cell => (cell.textContent = ""));
    currentIndex = 0; // Reset input cursor to the first cell
    highlightCurrentCell(currentIndex);
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Backspace" }));
}

function removeInputGrid() {
    const inputGrid = document.getElementById("guess-input-grid");
    if (inputGrid) {
        inputGrid.remove(); // ✅ Completely removes the element
        console.log("🗑️ Input grid removed from HTML after game over.");
    }
}




function createInputGrid() {
    const inputGrid = document.getElementById("guess-input-grid");

    if (!inputGrid) {
        console.error("Error: #guess-input-grid element not found.");
        return;
    }

    inputGrid.innerHTML = ""; // Clear previous grid

    for (let i = 0; i < 10; i++) {
        const cell = document.createElement("div");
        cell.classList.add("grid-cell", "input-cell");
        cell.dataset.index = i; // Store index for reference
        cell.textContent = ""; // Initially empty
        inputGrid.appendChild(cell);
    }

    document.addEventListener("keydown", handleTyping); // Listen for typing events
    highlightCurrentCell(0); // Start with the first cell selected
}

document.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !gameOver) {
        let submitButton = document.getElementById("submit-btn");

        // Only trigger submitGuess() if the button is enabled
        if (!submitButton.disabled) {
            submitGuess();
        }
    }
});


function handleTyping(event) {
    const cells = document.querySelectorAll(".input-cell");

    // Allow letters A-Z and spaces
    if ((event.key.match(/^[a-zA-Z]$/) || event.key === " ") && currentIndex < 10) {
        cells[currentIndex].textContent = event.key === " " ? " " : event.key.toUpperCase();
        currentIndex++;
    } 
    // Handle Backspace to move backward
    else if (event.key === "Backspace" && currentIndex > 0) {
        currentIndex--;
        cells[currentIndex].textContent = "";
    }

    highlightCurrentCell(currentIndex);
    checkInput(); // Enable or disable the enter button
}


function highlightCurrentCell(index) {
    const cells = document.querySelectorAll(".input-cell");
    cells.forEach(cell => cell.classList.remove("active-cell")); // Remove previous highlight
    if (index < 10) {
        cells[index].classList.add("active-cell"); // Highlight current cell
    }
}

function checkInput() {
    const cells = document.querySelectorAll(".input-cell");
    
    // Get user input, preserving spaces, but avoiding empty cells being counted
    let guess = Array.from(cells).map(cell => (cell.textContent.length === 0 ? "_" : cell.textContent)).join("");
    
    // Ensure the submit button is only enabled when all 10 cells are filled with letters or spaces
    document.getElementById("submit-btn").disabled = guess.length !== 10 || guess.includes("_");
}

document.addEventListener("DOMContentLoaded", () => {
    createInputGrid();
});

document.getElementById("submit-btn").onclick = function () {
    if (!gameOver && !this.disabled) {
        submitGuess();
    }
};

function endGame(isWin) {
    gameOver = true;

    // Hide submit button and disable input grid
    document.getElementById("submit-btn").style.display = "none";
    removeInputGrid()

    console.log("Final guess locked in. No new input allowed.");
    
    showShareablePopup(isWin);
}

function showShareablePopup(isWin) {
    console.log("📢 in shareable function");

    let shareablePopup = document.getElementById("shareable-popup");
    console.log("Popup Element:", shareablePopup);

    if (!shareablePopup) {
        console.error("❌ Error: #shareable-popup element not found in DOM!");
        return;
    }

    // ✅ Determine the message based on the number of attempts
    let message;
    if (isWin) {
        if (remainingAttempts === 2) {
            message = "You're a star. Mom and Dad would be proud"; // ✅ First try
        } else if (remainingAttempts === 1) {
            message = "Super!"; // ✅ Two tries
        } else if (remainingAttempts === 0 ) {
            message = "Get it together man"; // ✅ Three tries
        }
    } else {
        message = "Better Luck Next Time!"; // ✅ User failed
    }

    // ✅ Generate emoji-based representation of guesses
    let emojiGrid = guessProgress
        .map(guess => guess
            .split("")
            .map((letter, index) => letter === correctWordArray[index] ? "🟩" : "⬛️") // ✅ Correct letters = green, incorrect = gray
            .join(""))
        .join("\n"); // ✅ Ensure guesses are displayed on new lines



    

    // ✅ Update the popup content
    document.getElementById("popup-message").innerText = message; // Set dynamic message
    document.getElementById("shareable-text").innerText = `DIAL IN #${gameNumber}\n${emojiGrid}`;
    document.getElementById("code-word").innerText = `\"${correctWordArray.join("").toUpperCase()}\"`;
    
    // ✅ Remove "hidden" and add "shareable-popup" class to make it visible
    shareablePopup.classList.remove("hidden");
    shareablePopup.classList.add("shareable-popup");


    // ✅ Show the Share button by removing `hidden-share`
    document.getElementById("share-btn").classList.remove("hidden-share");

    console.log("✅ Popup should be visible now.");
}

document.addEventListener("DOMContentLoaded", function () {
    let mobileInput = document.getElementById("hidden-mobile-input");

    // ✅ Use a delay to ensure the page loads fully before focusing
    setTimeout(() => {
        focusInput();
    }, 500); // Slight delay to avoid browser restrictions

    // ✅ Refocus when a user taps the input grid
    document.getElementById("guess-input-grid").addEventListener("click", function () {
        focusInput();
    });
});


// ✅ Move to the next cell after typing a letter
function moveToNextCell() {
    let cells = document.querySelectorAll(".input-cell");
    let currentIndex = Array.from(cells).findIndex(cell => cell.classList.contains("active-cell"));

    if (currentIndex !== -1 && currentIndex < cells.length - 1) {
        cells[currentIndex].classList.remove("active-cell");
        cells[currentIndex + 1].classList.add("active-cell");
    }
}



document.getElementById("copy-btn").addEventListener("click", function () {
    let shareableText = document.getElementById("shareable-text").innerText;
    
    navigator.clipboard.writeText(shareableText).then(() => {
        console.log("copied correctly")
    }).catch(err => {
        console.error("Error copying text: ", err);
    });
});

document.getElementById("close-popup").addEventListener("click", function () {
    let popup = document.getElementById("shareable-popup");
    popup.classList.remove("shareable-popup");
    popup.classList.add("hidden"); // ✅ Hide popup again
});


document.getElementById("share-btn").addEventListener("click", function () {
    document.getElementById("shareable-popup").style.display = "block"; // Show the popup
});

document.getElementById("play-btn").addEventListener("click", function () {
    document.getElementById("game-intro").style.display = "none"; // Hide the overlay
    document.getElementById("how-to-play-popup").classList.remove("popup-hidden");
});


// ✅ Open How to Play popup
document.getElementById("help-icon").addEventListener("click", function () {
    document.getElementById("how-to-play-popup").classList.remove("popup-hidden");
});

// ✅ Close How to Play popup
document.getElementById("close-how-to-play").addEventListener("click", function () {
    document.getElementById("how-to-play-popup").classList.add("popup-hidden");
    focusInput();
});

// ✅ Close popup when PLAY button is clicked
document.getElementById("play-button").addEventListener("click", function () {
    document.getElementById("how-to-play-popup").classList.add("popup-hidden");
    focusInput();
});


function focusInput() {
    let mobileInput = document.getElementById("hidden-mobile-input");
    let guessGrid = document.getElementById("guess-input-grid");
    let focusSpot = document.getElementById("toolbar");

    mobileInput.focus();
    
    // ✅ Scroll to keep the guess input grid in view
    setTimeout(() => {
        focusSpot.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 200);
}

// ✅ Refocus when the user taps the guess input grid
document.getElementById("guess-input-grid").addEventListener("click", function () {
    focusInput();
});

// ✅ Call `focusInput()` whenever a new grid is added after a guess
function createNewGuessInputGrid() {
    let newGrid = document.createElement("div");
    newGrid.classList.add("guess-row");
    document.getElementById("guess-container").appendChild(newGrid);
    
    focusInput(); // ✅ Ensures keyboard opens immediately
}
