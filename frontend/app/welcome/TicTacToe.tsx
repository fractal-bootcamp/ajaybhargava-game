// Tic Tac Toe
import { useState } from "react";

// Board Properties
type Cell = "X" | "O" | " ";
type Board = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell];

// Game State
type GameState = {
	board: Board;
	cell: number;
	turn: "X" | "O";
};

// Game Conclusions
type GameConclusions = {
	win: "X" | "O" | null;
	draw: boolean;
};

// Game Actions
function MakeMove({ board, cell, turn }: GameState): GameState {
	const newBoard = structuredClone(board);
	newBoard[cell] = turn;
	return { board: newBoard, cell, turn: turn === "X" ? "O" : "X" };
}

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

export function TicTacToe() {
	const [game, setGame] = useState(
		MakeMove({
			board: [" ", " ", " ", " ", " ", " ", " ", " ", " "],
			cell: -1,
			turn: "O",
		}),
	);

	return (
		<main className="flex items-center justify-center pt-16 pb-4">
			<div className="flex flex-col items-center gap-10 min-h-0">
				<header className="flex flex-col items-center">
					<h1 className="text-4xl font-bold">Tic Tac Toe</h1>
				</header>
				<div className="grid grid-cols-3 gap-4">
					{game.board.map((cell, index) => (
						<button
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							key={index}
							onClick={() => setGame(MakeMove({ ...game, cell: index }))}
							className="w-24 h-24 bg-gray-100 text-4xl font-bold flex items-center justify-center"
							disabled={cell !== " "}
							type="button"
						>
							{cell}
						</button>
					))}
				</div>
				<p className="mt-8 text-xl">
					{CheckWin(game.board).win
						? `Winner: ${CheckWin(game.board).win}`
						: CheckWin(game.board).draw
							? "Game is a draw!"
							: "No winner yet"}
				</p>
			</div>
		</main>
	);
}
