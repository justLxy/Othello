document.addEventListener('DOMContentLoaded', () => {
    // Language switching
    const htmlElement = document.documentElement;
    const enButton = document.getElementById('en-button');
    const zhButton = document.getElementById('zh-button');

    // Set default language
    htmlElement.lang = 'en';

    // Language switching event listeners
    enButton.addEventListener('click', () => {
        htmlElement.lang = 'en';
        enButton.classList.add('active');
        zhButton.classList.remove('active');
    });

    zhButton.addEventListener('click', () => {
        htmlElement.lang = 'zh';
        zhButton.classList.add('active');
        enButton.classList.remove('active');
    });
    // Game constants
    const EMPTY = 0;
    const DARK = 1;
    const LIGHT = 2;
    const BOARD_SIZE = 8;
    const DIRECTIONS = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    // DOM elements
    const gameBoard = document.getElementById('game-board');
    const darkScoreElement = document.getElementById('dark-score');
    const lightScoreElement = document.getElementById('light-score');
    const statusMessage = document.getElementById('status-message');
    const difficultySlider = document.getElementById('ai-difficulty');
    const difficultyValue = document.getElementById('difficulty-value');
    const startGameButton = document.getElementById('start-game');
    const hintButton = document.getElementById('hint-btn');
    const endGameModal = document.getElementById('end-game-modal');
    const winnerMessage = document.getElementById('winner-message');
    const finalDarkScore = document.getElementById('final-dark-score');
    const finalLightScore = document.getElementById('final-light-score');
    const playAgainButton = document.getElementById('play-again');
    const aiThinkingIndicator = document.getElementById('ai-thinking');

    // Game state
    let board = [];
    let currentPlayer = DARK; // Dark goes first
    let playerColor = DARK;
    let aiColor = LIGHT;
    let gameInProgress = false;
    let aiThinking = false;
    let validMoves = [];
    let hintShown = false;

    // Initialize the game
    initializeGame();

    // Event listeners
    difficultySlider.addEventListener('input', () => {
        difficultyValue.textContent = difficultySlider.value;
    });

    startGameButton.addEventListener('click', () => {
        const playerSelection = document.querySelector('input[name="player-color"]:checked').value;
        playerColor = playerSelection === 'dark' ? DARK : LIGHT;
        aiColor = playerColor === DARK ? LIGHT : DARK;
        startNewGame();
    });

    hintButton.addEventListener('click', showHint);
    playAgainButton.addEventListener('click', () => {
        endGameModal.style.display = 'none';
        startNewGame();
    });

    document.querySelectorAll('input[name="player-color"]').forEach(radio => {
        radio.addEventListener('change', () => {
            if (gameInProgress) {
                if (confirm('Changing player color will restart the game. Continue?')) {
                    const newPlayerColor = radio.value === 'dark' ? DARK : LIGHT;
                    playerColor = newPlayerColor;
                    aiColor = playerColor === DARK ? LIGHT : DARK;
                    startNewGame();
                } else {
                    // Revert selection change
                    document.querySelector(`input[value="${playerColor === DARK ? 'dark' : 'light'}"]`).checked = true;
                }
            }
        });
    });

    // Game initialization function
    function initializeGame() {
        createBoard();
        resetBoard();
        updateBoardUI();
        updateScoreUI();
        updateGameStatus();
    }

    // Create the game board in the DOM
    function createBoard() {
        gameBoard.innerHTML = '';
        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener('click', () => handleCellClick(row, col));
                gameBoard.appendChild(cell);
            }
        }
    }

    // Reset the board to the initial state
    function resetBoard() {
        // Initialize empty board
        board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(EMPTY));

        // Set up initial pieces
        const mid = Math.floor(BOARD_SIZE / 2);
        board[mid-1][mid-1] = LIGHT;
        board[mid-1][mid] = DARK;
        board[mid][mid-1] = DARK;
        board[mid][mid] = LIGHT;

        currentPlayer = DARK; // Dark always starts
        gameInProgress = true;
        validMoves = findValidMoves(board, currentPlayer);
        hintShown = false;
    }

    // Start a new game
    function startNewGame() {
        resetBoard();
        updateBoardUI();
        updateScoreUI();
        updateGameStatus();

        // If AI goes first
        if (currentPlayer === aiColor) {
            makeAIMove();
        }
    }

    // Update the board UI based on the current state
    function updateBoardUI() {
        const cells = gameBoard.querySelectorAll('.cell');
        cells.forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);

            // Clear cell content
            cell.innerHTML = '';
            cell.classList.remove('valid-move');

            // Add disk if there's a piece
            if (board[row][col] !== EMPTY) {
                const disk = document.createElement('div');
                disk.classList.add('cell-disk');
                disk.classList.add(board[row][col] === DARK ? 'dark' : 'light');
                cell.appendChild(disk);
            }

            // Highlight valid moves for the current player
            if (currentPlayer === playerColor && isValidMove(row, col, board, currentPlayer)) {
                cell.classList.add('valid-move');
            }
        });
    }

    // Update the game score UI
    function updateScoreUI() {
        const { darkCount, lightCount } = countPieces();
        darkScoreElement.textContent = darkCount;
        lightScoreElement.textContent = lightCount;
    }

    // Update the game status message
    function updateGameStatus() {
        if (!gameInProgress) {
            const { darkCount, lightCount } = countPieces();
            if (darkCount > lightCount) {
                statusMessage.textContent = 'Dark wins!';
            } else if (lightCount > darkCount) {
                statusMessage.textContent = 'Light wins!';
            } else {
                statusMessage.textContent = 'Game ended in a draw!';
            }
            return;
        }

        if (currentPlayer === playerColor) {
            if (validMoves.length > 0) {
                if (htmlElement.lang === 'en') {
                    statusMessage.innerHTML = '<span class="en">Your turn</span><span class="zh">你的回合</span>';
                } else {
                    statusMessage.innerHTML = '<span class="en">Your turn</span><span class="zh">你的回合</span>';
                }
            } else {
                if (htmlElement.lang === 'en') {
                    statusMessage.innerHTML = '<span class="en">No valid moves. Turn skipped.</span><span class="zh">没有有效移动。跳过回合。</span>';
                } else {
                    statusMessage.innerHTML = '<span class="en">No valid moves. Turn skipped.</span><span class="zh">没有有效移动。跳过回合。</span>';
                }
                setTimeout(() => {
                    switchPlayer();
                    updateGameStatus();
                    if (currentPlayer === aiColor) {
                        makeAIMove();
                    }
                }, 1500);
            }
        } else {
            if (htmlElement.lang === 'en') {
                statusMessage.innerHTML = '<span class="en">AI is thinking...</span><span class="zh">AI正在思考...</span>';
            } else {
                statusMessage.innerHTML = '<span class="en">AI is thinking...</span><span class="zh">AI正在思考...</span>';
            }
        }
    }

    // Handle cell click
    function handleCellClick(row, col) {
        // Ignore clicks if not player's turn or game over
        if (!gameInProgress || currentPlayer !== playerColor || aiThinking) return;

        // Check if the move is valid
        if (isValidMove(row, col, board, currentPlayer)) {
            makeMove(row, col);

            // Clear any hint if shown
            if (hintShown) {
                hintShown = false;
                updateBoardUI();
            }

            // Switch to AI's turn
            switchPlayer();
            updateGameStatus();

            // Let AI make a move
            if (gameInProgress && currentPlayer === aiColor) {
                makeAIMove();
            }
        }
    }

    // Make a move on the board
    function makeMove(row, col) {
        // Place the piece
        board[row][col] = currentPlayer;

        // Flip opponent's pieces
        const flippedPieces = getFlippedPieces(row, col, board, currentPlayer);
        flippedPieces.forEach(([r, c]) => {
            board[r][c] = currentPlayer;
        });

        // Update UI with animations
        updateBoardWithAnimation(flippedPieces);

        // Update the score
        updateScoreUI();

        // Check if the game is over
        checkGameOver();
    }

    // Update board with flip animations
    function updateBoardWithAnimation(flippedPieces) {
        // First update all cells
        updateBoardUI();

        // Then add the flipping animation to flipped pieces
        flippedPieces.forEach(([row, col]) => {
            const cell = gameBoard.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
            const disk = cell.querySelector('.cell-disk');
            if (disk) {
                disk.classList.add('flipping');
                // Remove the animation class after it completes
                setTimeout(() => {
                    disk.classList.remove('flipping');
                }, 600);
            }
        });
    }

    // Switch to the next player
    function switchPlayer() {
        currentPlayer = currentPlayer === DARK ? LIGHT : DARK;
        validMoves = findValidMoves(board, currentPlayer);
    }

    // Count the pieces on the board
    function countPieces() {
        let darkCount = 0;
        let lightCount = 0;

        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                if (board[row][col] === DARK) {
                    darkCount++;
                } else if (board[row][col] === LIGHT) {
                    lightCount++;
                }
            }
        }

        return { darkCount, lightCount };
    }

    // Check if the game is over
    function checkGameOver() {
        // Check if the board is full
        const { darkCount, lightCount } = countPieces();
        if (darkCount + lightCount === BOARD_SIZE * BOARD_SIZE) {
            endGame();
            return true;
        }

        // Check if neither player can move
        const currentPlayerMoves = findValidMoves(board, currentPlayer);
        const otherPlayerMoves = findValidMoves(board, currentPlayer === DARK ? LIGHT : DARK);

        if (currentPlayerMoves.length === 0 && otherPlayerMoves.length === 0) {
            endGame();
            return true;
        }

        return false;
    }

    // End the game and show the result
    function endGame() {
        gameInProgress = false;
        const { darkCount, lightCount } = countPieces();

        // Set final scores
        finalDarkScore.textContent = darkCount;
        finalLightScore.textContent = lightCount;

        // Determine winner
        if (darkCount > lightCount) {
            winnerMessage.innerHTML = '<span class="en">Dark Wins!</span><span class="zh">黑棋获胜！</span>';
        } else if (lightCount > darkCount) {
            winnerMessage.innerHTML = '<span class="en">Light Wins!</span><span class="zh">白棋获胜！</span>';
        } else {
            winnerMessage.innerHTML = '<span class="en">It\'s a Tie!</span><span class="zh">平局！</span>';
        }

        // Show the modal
        endGameModal.style.display = 'flex';
    }

    // Find all valid moves for a player
    function findValidMoves(board, player) {
        const moves = [];

        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                if (isValidMove(row, col, board, player)) {
                    moves.push([row, col]);
                }
            }
        }

        return moves;
    }

    // Check if a move is valid
    function isValidMove(row, col, board, player) {
        // Position must be empty
        if (board[row][col] !== EMPTY) {
            return false;
        }

        const opponent = player === DARK ? LIGHT : DARK;

        // Check all directions for potential flips
        for (const [dRow, dCol] of DIRECTIONS) {
            let r = row + dRow;
            let c = col + dCol;
            let foundOpponent = false;

            // Look for opponent's pieces in this direction
            while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === opponent) {
                r += dRow;
                c += dCol;
                foundOpponent = true;
            }

            // If found opponent's pieces and ended with our piece, it's a valid move
            if (foundOpponent && r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
                return true;
            }
        }

        return false;
    }

    // Get pieces that would be flipped by a move
    function getFlippedPieces(row, col, board, player) {
        const flippedPieces = [];
        const opponent = player === DARK ? LIGHT : DARK;

        for (const [dRow, dCol] of DIRECTIONS) {
            let r = row + dRow;
            let c = col + dCol;
            const potentialFlips = [];

            // Look for opponent's pieces in this direction
            while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === opponent) {
                potentialFlips.push([r, c]);
                r += dRow;
                c += dCol;
            }

            // If ended with our piece, add the flips
            if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player && potentialFlips.length > 0) {
                flippedPieces.push(...potentialFlips);
            }
        }

        return flippedPieces;
    }

    // Show a hint for a valid move
    function showHint() {
        if (!gameInProgress || currentPlayer !== playerColor || validMoves.length === 0) return;

        // Clear previous hint if exists
        if (hintShown) {
            updateBoardUI();
        }

        // Find the best move using the AI's evaluation (simplified)
        let bestMove;
        let bestScore = -Infinity;

        for (const [row, col] of validMoves) {
            // Create a board copy
            const boardCopy = board.map(row => [...row]);
            boardCopy[row][col] = playerColor;

            // Get flipped pieces
            const flippedPieces = getFlippedPieces(row, col, board, playerColor);
            flippedPieces.forEach(([r, c]) => {
                boardCopy[r][c] = playerColor;
            });

            // Evaluate the position
            const score = computeHeuristic(boardCopy, playerColor);

            if (score > bestScore) {
                bestScore = score;
                bestMove = [row, col];
            }
        }

        // Show the hint
        if (bestMove) {
            const [row, col] = bestMove;
            const cell = gameBoard.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);

            const disk = document.createElement('div');
            disk.classList.add('cell-disk', playerColor === DARK ? 'dark' : 'light', 'hint');
            cell.appendChild(disk);

            hintShown = true;
        }
    }

    // Make an AI move
    function makeAIMove() {
        if (!gameInProgress || currentPlayer !== aiColor) return;

        // Show AI thinking indicator
        aiThinking = true;
        aiThinkingIndicator.style.display = 'block';

        // Use setTimeout to give the UI a chance to update and show the thinking indicator
        setTimeout(() => {
            // Check if there are any valid moves
            if (validMoves.length === 0) {
                if (htmlElement.lang === 'en') {
                    statusMessage.innerHTML = '<span class="en">AI has no valid moves. Turn skipped.</span><span class="zh">AI没有有效移动。跳过回合。</span>';
                } else {
                    statusMessage.innerHTML = '<span class="en">AI has no valid moves. Turn skipped.</span><span class="zh">AI没有有效移动。跳过回合。</span>';
                }
                aiThinking = false;
                aiThinkingIndicator.style.display = 'none';

                setTimeout(() => {
                    switchPlayer();
                    updateGameStatus();
                }, 1500);
                return;
            }

            // Find the best move using alpha-beta pruning
            const bestMove = findBestMove();

            if (bestMove) {
                const [row, col] = bestMove;
                makeMove(row, col);
                switchPlayer();
                updateGameStatus();
            }

            // Hide AI thinking indicator
            aiThinking = false;
            aiThinkingIndicator.style.display = 'none';
        }, 500); // Slight delay to show the thinking animation
    }

    // Find the best move using alpha-beta pruning
    function findBestMove() {
        const depth = parseInt(difficultySlider.value);
        const [bestMove, _] = alphabetaMaxNode(board, aiColor, -Infinity, Infinity, depth);
        return bestMove;
    }

    // Alpha-beta pruning max node
    function alphabetaMaxNode(board, color, alpha, beta, depth) {
        // Check if we've reached terminal state or depth limit
        const moves = findValidMoves(board, color);

        if (depth === 0 || moves.length === 0) {
            return [null, computeHeuristic(board, aiColor)];
        }

        let bestMove = null;
        let bestScore = -Infinity;

        // Sort moves for better pruning (node ordering)
        const sortedMoves = sortMovesByValue(board, moves, color);

        for (const [row, col] of sortedMoves) {
            // Create a board copy
            const boardCopy = board.map(row => [...row]);
            boardCopy[row][col] = color;

            // Get flipped pieces
            const flippedPieces = getFlippedPieces(row, col, board, color);
            flippedPieces.forEach(([r, c]) => {
                boardCopy[r][c] = color;
            });

            // Recursively find min value for this move
            const [_, score] = alphabetaMinNode(boardCopy, color === DARK ? LIGHT : DARK, alpha, beta, depth - 1);

            if (score > bestScore) {
                bestScore = score;
                bestMove = [row, col];
            }

            alpha = Math.max(alpha, bestScore);
            if (beta <= alpha) {
                break; // Beta cutoff
            }
        }

        return [bestMove, bestScore];
    }

    // Alpha-beta pruning min node
    function alphabetaMinNode(board, color, alpha, beta, depth) {
        // Check if we've reached terminal state or depth limit
        const moves = findValidMoves(board, color);

        if (depth === 0 || moves.length === 0) {
            return [null, computeHeuristic(board, aiColor)];
        }

        let bestMove = null;
        let bestScore = Infinity;

        // Sort moves for better pruning (node ordering)
        const sortedMoves = sortMovesByValue(board, moves, color);

        for (const [row, col] of sortedMoves) {
            // Create a board copy
            const boardCopy = board.map(row => [...row]);
            boardCopy[row][col] = color;

            // Get flipped pieces
            const flippedPieces = getFlippedPieces(row, col, board, color);
            flippedPieces.forEach(([r, c]) => {
                boardCopy[r][c] = color;
            });

            // Recursively find max value for this move
            const [_, score] = alphabetaMaxNode(boardCopy, color === DARK ? LIGHT : DARK, alpha, beta, depth - 1);

            if (score < bestScore) {
                bestScore = score;
                bestMove = [row, col];
            }

            beta = Math.min(beta, bestScore);
            if (beta <= alpha) {
                break; // Alpha cutoff
            }
        }

        return [bestMove, bestScore];
    }

    // Sort moves by their immediate value for better pruning
    function sortMovesByValue(board, moves, color) {
        const moveValues = [];

        for (const [row, col] of moves) {
            // Create a board copy
            const boardCopy = board.map(row => [...row]);
            boardCopy[row][col] = color;

            // Get flipped pieces
            const flippedPieces = getFlippedPieces(row, col, board, color);
            flippedPieces.forEach(([r, c]) => {
                boardCopy[r][c] = color;
            });

            // Calculate immediate utility
            const value = computeUtility(boardCopy, color);
            moveValues.push({ move: [row, col], value });
        }

        // Sort by value (descending)
        moveValues.sort((a, b) => b.value - a.value);

        return moveValues.map(item => item.move);
    }

    // Compute utility (piece difference)
    function computeUtility(board, color) {
        let playerCount = 0;
        let opponentCount = 0;
        const opponent = color === DARK ? LIGHT : DARK;

        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                if (board[row][col] === color) {
                    playerCount++;
                } else if (board[row][col] === opponent) {
                    opponentCount++;
                }
            }
        }

        return playerCount - opponentCount;
    }

    // Compute heuristic evaluation using your custom algorithm
    function computeHeuristic(board, color) {
        const opponent = color === DARK ? LIGHT : DARK;

        // Feature 1: Piece difference (basic score)
        let playerCount = 0;
        let opponentCount = 0;

        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                if (board[row][col] === color) {
                    playerCount++;
                } else if (board[row][col] === opponent) {
                    opponentCount++;
                }
            }
        }

        const pieceDiff = playerCount - opponentCount;

        // Feature 2: Corner control (extremely valuable)
        const corners = [
            [0, 0], [0, BOARD_SIZE - 1],
            [BOARD_SIZE - 1, 0], [BOARD_SIZE - 1, BOARD_SIZE - 1]
        ];

        let playerCorners = 0;
        let opponentCorners = 0;

        for (const [row, col] of corners) {
            if (board[row][col] === color) {
                playerCorners++;
            } else if (board[row][col] === opponent) {
                opponentCorners++;
            }
        }

        const cornerValue = 25 * (playerCorners - opponentCorners);

        // Feature 3: Corner adjacency (dangerous unless corner is already taken)
        const cornerAdj = [
            // Adjacent to top-left
            [[0, 1], [1, 0], [1, 1]],
            // Adjacent to top-right
            [[0, BOARD_SIZE - 2], [1, BOARD_SIZE - 1], [1, BOARD_SIZE - 2]],
            // Adjacent to bottom-left
            [[BOARD_SIZE - 1, 1], [BOARD_SIZE - 2, 0], [BOARD_SIZE - 2, 1]],
            // Adjacent to bottom-right
            [[BOARD_SIZE - 1, BOARD_SIZE - 2], [BOARD_SIZE - 2, BOARD_SIZE - 1], [BOARD_SIZE - 2, BOARD_SIZE - 2]]
        ];

        let cornerAdjValue = 0;

        for (let i = 0; i < corners.length; i++) {
            const [cornerRow, cornerCol] = corners[i];
            const cornerOwner = board[cornerRow][cornerCol];

            for (const [adjRow, adjCol] of cornerAdj[i]) {
                if (adjRow >= 0 && adjRow < BOARD_SIZE && adjCol >= 0 && adjCol < BOARD_SIZE) {
                    if (cornerOwner === EMPTY) {
                        // Corner is empty - bad to play adjacent
                        if (board[adjRow][adjCol] === color) {
                            cornerAdjValue -= 8;
                        } else if (board[adjRow][adjCol] === opponent) {
                            cornerAdjValue += 8;
                        }
                    } else if (cornerOwner === color) {
                        // We own corner - good to play adjacent
                        if (board[adjRow][adjCol] === color) {
                            cornerAdjValue += 2;
                        } else if (board[adjRow][adjCol] === opponent) {
                            cornerAdjValue -= 2;
                        }
                    } else {
                        // Opponent owns corner
                        if (board[adjRow][adjCol] === color) {
                            cornerAdjValue -= 2;
                        } else if (board[adjRow][adjCol] === opponent) {
                            cornerAdjValue += 2;
                        }
                    }
                }
            }
        }

        // Feature 4: Edge control (valuable but less than corners)
        const edges = [];

        // Add top and bottom edges (excluding corners)
        for (let col = 1; col < BOARD_SIZE - 1; col++) {
            edges.push([0, col]);
            edges.push([BOARD_SIZE - 1, col]);
        }

        // Add left and right edges (excluding corners)
        for (let row = 1; row < BOARD_SIZE - 1; row++) {
            edges.push([row, 0]);
            edges.push([row, BOARD_SIZE - 1]);
        }

        let playerEdges = 0;
        let opponentEdges = 0;

        for (const [row, col] of edges) {
            if (board[row][col] === color) {
                playerEdges++;
            } else if (board[row][col] === opponent) {
                opponentEdges++;
            }
        }

        const edgeValue = 8 * (playerEdges - opponentEdges);

        // Feature 5: Mobility (number of possible moves)
        const playerMoves = findValidMoves(board, color).length;
        const opponentMoves = findValidMoves(board, opponent).length;

        let mobility = 0;
        if (playerMoves + opponentMoves > 0) {
            mobility = 10 * (playerMoves - opponentMoves) / (playerMoves + opponentMoves);
        }

        // Feature 6: Stability (simplified version - true stability analysis is more complex)
        let stableValue = 0;

        // Count stable pieces from corners
        for (const [cornerRow, cornerCol] of corners) {
            if (board[cornerRow][cornerCol] === color) {
                // Check horizontally
                let col = cornerCol;
                const dCol = cornerCol === 0 ? 1 : -1;
                while (col + dCol >= 0 && col + dCol < BOARD_SIZE && board[cornerRow][col + dCol] === color) {
                    stableValue += 2;
                    col += dCol;
                }

                // Check vertically
                let row = cornerRow;
                const dRow = cornerRow === 0 ? 1 : -1;
                while (row + dRow >= 0 && row + dRow < BOARD_SIZE && board[row + dRow][cornerCol] === color) {
                    stableValue += 2;
                    row += dRow;
                }

                // Check diagonally
                row = cornerRow;
                col = cornerCol;
                while (row + dRow >= 0 && row + dRow < BOARD_SIZE &&
                col + dCol >= 0 && col + dCol < BOARD_SIZE &&
                board[row + dRow][col + dCol] === color) {
                    stableValue += 2;
                    row += dRow;
                    col += dCol;
                }
            }
        }

        // Determine game phase for weight adjustment
        const totalPieces = playerCount + opponentCount;
        const maxPieces = BOARD_SIZE * BOARD_SIZE;

        // Dynamic weighting based on game phase
        let pieceWeight, cornerWeight, cornerAdjWeight, edgeWeight, mobilityWeight, stabilityWeight;

        if (totalPieces < maxPieces * 0.2) {
            // Early game
            pieceWeight = 1;
            cornerWeight = 35;
            cornerAdjWeight = 15;
            edgeWeight = 10;
            mobilityWeight = 20;
            stabilityWeight = 5;
        } else if (totalPieces < maxPieces * 0.7) {
            // Mid game
            pieceWeight = 2;
            cornerWeight = 25;
            cornerAdjWeight = 10;
            edgeWeight = 8;
            mobilityWeight = 15;
            stabilityWeight = 10;
        } else {
            // Late game
            pieceWeight = 9;
            cornerWeight = 15;
            cornerAdjWeight = 5;
            edgeWeight = 5;
            mobilityWeight = 5;
            stabilityWeight = 15;
        }

        // Combine all features with their weights
        const heuristicValue = (
            pieceWeight * pieceDiff +
            cornerWeight * cornerValue +
            cornerAdjWeight * cornerAdjValue +
            edgeWeight * edgeValue +
            mobilityWeight * mobility +
            stabilityWeight * stableValue
        );

        return heuristicValue;
    }
});