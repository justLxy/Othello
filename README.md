# Othello (Reversi) AI | 黑白棋 AI

## Game Rules | 游戏规则
**Othello (Reversi)** is a strategic board game played on an **8×8 board** with **64 disks** that are dark on one side and light on the other.

**黑白棋（Othello/Reversi）** 是一种在 **8×8 棋盘** 上进行的策略棋类游戏，棋盘上共有 **64 枚棋子**，一面为黑色，一面为白色。

### **Starting Position | 起始布局**
- The game begins with **4 disks** placed in the center, with **2 dark and 2 light disks arranged diagonally**.
- 游戏开始时，**4 枚棋子** 被放置在棋盘中央，其中 **2 枚黑色棋子与 2 枚白色棋子呈对角线排列**。

### **Gameplay | 游戏规则**
1. Players take turns placing disks on the board with their assigned color facing up.
2. A move is valid **only if it brackets at least one opponent's disk** between the newly placed disk and another disk of the player's color.
3. When a player makes a valid move, all bracketed opponent disks are **flipped** to the player's color.
4. If a player has no valid moves, their turn is skipped.
5. The game ends when **neither player can make a valid move** or when the **board is full**.
6. The player with the **most disks of their color** on the board at the end **wins** the game.

1. 玩家轮流在棋盘上放置棋子，棋子的朝向为玩家的颜色。
2. **只有能够夹住对方棋子**（即至少有一个对方棋子被新落下的棋子与已有己方棋子包围）的落子才是有效的。
3. 当玩家落下有效棋子时，所有被夹住的对方棋子都会被**翻转**成玩家的颜色。
4. 如果玩家在当前回合没有有效的走法，则该回合跳过。
5. 当**双方均无法进行有效走法**或**棋盘填满**时，游戏结束。
6. **棋盘上棋子数量最多的玩家获胜**。

---

## About This AI | 关于本 AI
This **Othello/Reversi AI** was developed by **Xuanyi Lyu** as a project for **CSC384 - Introduction to AI** at the **University of Toronto**.

本 **Othello/Reversi AI** 由 **吕玄奕（Xuanyi Lyu）** 开发，作为 **多伦多大学（University of Toronto）CSC384 - 人工智能导论** 课程的项目。

### **Algorithm & Optimization | 算法与优化**
The AI utilizes the **Alpha-Beta Pruning** algorithm for efficient game tree search, along with the following enhancements:

该 AI 采用 **Alpha-Beta 剪枝算法** 进行高效的博弈树搜索，并配备以下优化策略：

- **State Caching | 状态缓存**：存储已经评估过的棋盘状态，避免重复计算。
- **Node Ordering | 节点排序**：优先搜索可能性较高的走法，提高剪枝效率。

---

## Advanced Heuristic Evaluation | 高级启发式评估
The AI employs a **custom heuristic function** that evaluates board positions using multiple weighted factors. These weights dynamically adjust based on the game phase:

该 AI 采用 **自定义启发式评估函数** 来评估棋局，结合多个加权因素，并根据游戏阶段动态调整权重。

### **Heuristic Factors | 评估因素**
1. **Corner Control | 角落控制** - 角落位置极其重要，因为它们**无法被翻转**。
2. **Edge Stability | 边界稳定性** - 相较于中心棋子，边缘棋子**更稳定**。
3. **Mobility | 行动力** - 拥有**更多可行走法**可以提供更强的战略灵活性。
4. **Piece Difference | 棋子差值** - 在**残局阶段**，棋子数量变得更为重要。
5. **Corner Adjacency | 角落邻近性** - 避免在**未控制角落的情况下**落子于邻近位置。

### **Dynamic Adjustments | 动态调整**
- **Early Game | 开局**：优先考虑 **行动力** 和 **棋子布局**。
- **Mid Game | 中局**：侧重于 **边界稳定性** 和 **限制对手行动**。
- **End Game | 残局**：最大化 **己方棋子数量** 以确保胜利。

