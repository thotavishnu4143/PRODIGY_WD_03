let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameActive = false;
let playerMode = 'friend'; // Default to play with friend
let userCharacter = 'X'; // Default user character
let aiCharacter = 'O'; // AI character should be opposite of user character

// Winning conditions
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const cells = document.querySelectorAll('.cell');
const restartButton = document.getElementById('restartButton');
const modal = document.getElementById('myModal');
const modalMessage = document.getElementById('modalMessage');
const closeButton = document.querySelector('.close-button');
const modalRestartButton = document.getElementById('modalRestartButton');
const charXButton = document.getElementById('charX');
const charOButton = document.getElementById('charO');
const playWithFriendButton = document.getElementById('playWithFriend');
const playWithAIButton = document.getElementById('playWithAI');
const startButton = document.getElementById('startButton');

// Function to select character (X or O) and ensure AI is opposite
function selectCharacter(selectedChar) {
    userCharacter = selectedChar; // Store user character
    aiCharacter = selectedChar === 'X' ? 'O' : 'X'; // Ensure AI selects the opposite character
    currentPlayer = selectedChar; // Set current player to user's character
}

// Function to set game mode (friend or AI)
function selectMode(mode) {
    playerMode = mode; // Set the game mode (friend or AI)
}

// Function to start the game (resets the board but keeps character choices)
function startGame() {
    if (userCharacter === '') {
        alert('Please select a character to start the game.');
        return;
    }
    isGameActive = true; // Enable the game when start is clicked
    board = ['', '', '', '', '', '', '', '', '']; // Clear the board
    cells.forEach(cell => {
        cell.innerHTML = ''; // Reset the board cells visually
    });
    currentPlayer = userCharacter; // Start with the user's character
}

// Handle cell clicks and player/AI turns
function handleCellClick(clickedCell, clickedCellIndex) {
    if (board[clickedCellIndex] !== '' || !isGameActive) {
        return;
    }

    board[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;

    checkResult();

    // If playing with AI, let AI make a move after player's move
    if (playerMode === 'AI' && isGameActive) {
        setTimeout(aiMove, 500); // Small delay for better UX
    }
}

// Check if there is a winner or a draw
function checkResult() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] === '' || board[b] === '' || board[c] === '') {
            continue;
        }
        if (board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        openModal(`Player ${currentPlayer} wins!`);
        isGameActive = false;
        return;
    }

    if (!board.includes('')) {
        openModal("It's a draw!");
    }

    // Switch player
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

// AI's move logic (make a move for AI, opposite to user)
function aiMove() {
    // AI Logic to make a move
    let availableCells = board.map((cell, index) => (cell === '' ? index : null)).filter(cell => cell !== null);

    // AI tries to win or block the player
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];

        // Check if AI can win
        if (board[a] === aiCharacter && board[b] === aiCharacter && board[c] === '') {
            board[c] = aiCharacter;
            document.getElementById(`cell-${c}`).innerHTML = aiCharacter;
            checkResult();
            return;
        }
        if (board[a] === aiCharacter && board[c] === aiCharacter && board[b] === '') {
            board[b] = aiCharacter;
            document.getElementById(`cell-${b}`).innerHTML = aiCharacter;
            checkResult();
            return;
        }
        if (board[b] === aiCharacter && board[c] === aiCharacter && board[a] === '') {
            board[a] = aiCharacter;
            document.getElementById(`cell-${a}`).innerHTML = aiCharacter;
            checkResult();
            return;
        }

        // Block the player from winning
        if (board[a] === userCharacter && board[b] === userCharacter && board[c] === '') {
            board[c] = aiCharacter;
            document.getElementById(`cell-${c}`).innerHTML = aiCharacter;
            checkResult();
            return;
        }
        if (board[a] === userCharacter && board[c] === userCharacter && board[b] === '') {
            board[b] = aiCharacter;
            document.getElementById(`cell-${b}`).innerHTML = aiCharacter;
            checkResult();
            return;
        }
        if (board[b] === userCharacter && board[c] === userCharacter && board[a] === '') {
            board[a] = aiCharacter;
            document.getElementById(`cell-${a}`).innerHTML = aiCharacter;
            checkResult();
            return;
        }
    }

    // If no immediate win or block, make a random move
    if (availableCells.length > 0) {
        const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
        board[randomCell] = aiCharacter; // AI plays the opposite character
        document.getElementById(`cell-${randomCell}`).innerHTML = board[randomCell];
        checkResult();
    }
}

// Display modal with the result message
function openModal(message) {
    modal.style.display = 'flex';
    modalMessage.innerText = message;
}

// Close modal
function closeModal() {
    modal.style.display = 'none';
}

// Restart game and keep character selection intact
function restartGame() {
    isGameActive = false;
    board = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => {
        cell.innerHTML = '';
    });
    closeModal();
    startGame(); // Start the game but keep player character selection
}

// Event Listeners
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => handleCellClick(cell, index));
});

restartButton.addEventListener('click', restartGame);
closeButton.addEventListener('click', closeModal);
modalRestartButton.addEventListener('click', restartGame);
charXButton.addEventListener('click', () => selectCharacter('X'));
charOButton.addEventListener('click', () => selectCharacter('O'));
playWithFriendButton.addEventListener('click', () => selectMode('friend'));
playWithAIButton.addEventListener('click', () => selectMode('AI'));
startButton.addEventListener('click', startGame);
