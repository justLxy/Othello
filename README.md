# Othello (Reversi) AI

## Game Rules
**Othello (Reversi)** is a strategic board game played on an **8×8 board** with **64 disks** that are dark on one side and light on the other.

### **Starting Position**
- The game begins with **4 disks** placed in the center, with **2 dark and 2 light disks arranged diagonally**.

### **Gameplay**
1. Players take turns placing disks on the board with their assigned color facing up.
2. A move is valid **only if it brackets at least one opponent's disk** between the newly placed disk and another disk of the player's color.
3. When a player makes a valid move, all bracketed opponent disks are **flipped** to the player's color.
4. If a player has no valid moves, their turn is skipped.
5. The game ends when **neither player can make a valid move** or when the **board is full**.
6. The player with the **most disks of their color** on the board at the end **wins** the game.

---

## About This AI
This **Othello/Reversi AI** was developed by **Xuanyi Lyu** as a project for **CSC384 - Introduction to AI** at the **University of Toronto**.

### **Algorithm & Optimization**
The AI utilizes the **Alpha-Beta Pruning** algorithm for efficient game tree search, along with the following enhancements:
- **State Caching**: Stores previously evaluated positions to avoid redundant calculations.
- **Node Ordering**: Prioritizes promising moves first, improving pruning efficiency.

---

## Advanced Heuristic Evaluation
The AI employs a **custom heuristic function** that evaluates board positions using multiple weighted factors. These weights dynamically adjust based on the game phase:

### **Heuristic Factors**
1. **Corner Control** - Corners are extremely valuable as they **can never be flipped**.
2. **Edge Stability** - Edge pieces are **more stable** than center pieces.
3. **Mobility** - Having **more possible moves** provides strategic flexibility.
4. **Piece Difference** - The raw count of pieces becomes more important **in the endgame**.
5. **Corner Adjacency** - Avoids dangerous positions **near corners** unless already controlled.

### **Dynamic Adjustments**
- Early Game: Prioritizes **mobility** and **positional play**.
- Mid Game: Focuses on **edge stability** and **opponent restriction**.
- End Game: Maximizes **piece count** to secure victory.

---

## How to Play Against the AI
1. Clone the repository:
   ```sh
   git clone https://github.com/justLxy/othello-ai.git
   cd othello-ai

