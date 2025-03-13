Game Rules
Othello (also known as Reversi) is a strategic board game played on an 8×8 board with 64 disks that are dark on one side and light on the other.

Starting Position: The game begins with 4 disks placed in the center, with 2 dark and 2 light disks arranged diagonally.
Gameplay: Players take turns placing disks on the board with their assigned color facing up.
Valid Moves: A move is valid only if it "brackets" at least one opponent's disk between the newly placed disk and another disk of the player's color.
Flipping: When a player makes a valid move, all opponent disks that are bracketed are flipped to the player's color.
No Valid Moves: If a player has no valid moves, their turn is skipped.
Game End: The game ends when neither player can make a valid move or the board is full.
Winner: The player with the most disks of their color on the board wins.
About This AI
This Othello/Reversi AI player was developed by Xuanyi Lyu as a project for CSC384 - Introduction to AI at the University of Toronto. The AI uses the Alpha-Beta pruning algorithm with state caching and node ordering optimizations to efficiently search the game tree.

Advanced Heuristic Evaluation
The custom heuristic evaluates board positions using multiple weighted factors that change according to the game phase:

Corner Control - Corners are extremely valuable as they can never be flipped
Edge Stability - Edge pieces are more stable than center pieces
Mobility - Having more possible moves provides strategic flexibility
Piece Difference - Raw count becomes more important in the endgame
Corner Adjacency - Avoiding dangerous positions near corners unless already controlled
The AI dynamically adjusts its evaluation weights based on the game phase, prioritizing mobility and positional play early, and transitioning to maximizing piece count in the endgame.
