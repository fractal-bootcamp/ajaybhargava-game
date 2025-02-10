# Tic Tac Toe Game 

## Application Logic

```typescript

// Game Logic
function CheckWin(board: Board): GameConclusions {
	const winConditions = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];

	for (const condition of winConditions) {
		const [a, b, c] = condition;
		if (board[a] === board[b] && board[b] === board[c] && board[a] !== " ") {
			return { win: board[a], draw: false };
		}
	}

	// Check for draw - if no empty spaces left
	const isDraw = !board.includes(" ");
	return { win: null, draw: isDraw };
}

```

Checks if there's a winner or a draw. An example of the logic iterated with an example of the board:

```typescript
const board = ["X", "O", "X", "O", "X", "O", "O", "X", "O"];
const result = CheckWin(board);
```

The result will be:

```typescript
{ win: "X", draw: false }
```

Why?

The board is an array of 9 elements, each element can be "X", "O" or " ". The function iterates through the win conditions and checks if any of them are met. If a win condition is met, the function returns the winner. If no win condition is met, the function returns a draw.


### Reporting Logic

```typescript
CheckWin(game.board).win
    ? `Winner: ${CheckWin(game.board).win}`    // if there's a winner
    : CheckWin(game.board).draw                // else, check if it's a draw
        ? "Game is a draw!"                    // if it's a draw
        : "No winner yet"                      // if neither win nor draw
```
