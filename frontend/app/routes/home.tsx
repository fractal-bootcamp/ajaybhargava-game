import type { Route } from "./+types/Home";
import { useLoaderData } from "react-router";
import { CardImage } from "~/components/CardImage";
import type { GameState, ValidCards } from "~/components/GameState";
import {
	createInitialGameState,
	placeCardAndUpdateGame,
} from "~/components/GameState";
import { useState } from "react";
export async function loader() {
	return {
		message: "Hello, world!",
	};
}

// biome-ignore lint/correctness/noEmptyPattern: <explanation>
export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Ajay's Games" },
		{ name: "description", content: "Just a simple Games V7 Router App!" },
	];
}

export default function GameBoard({ actionData }: Route.ComponentProps) {
	const data = useLoaderData<typeof loader>();
	const [gameState, setGameState] = useState<GameState>(
		createInitialGameState(),
	);
	const [selectedCell, setSelectedCell] = useState<[number, number] | null>(
		null,
	);

	const handleCardPlacement = (card: ValidCards, row: number, col: number) => {
		setGameState((prevState) =>
			placeCardAndUpdateGame(prevState, card, [row, col]),
		);
		setSelectedCell(null);
	};

	const resetGame = () => {
		setGameState(createInitialGameState());
		setSelectedCell(null);
	};

	return (
		<div className="p-4">
			<div className="mb-4">
				<h2>Current Player: {gameState.currentPlayer}</h2>
				<div>
					<span>Player 1 Score: {gameState.scores[1]}</span>
					<span className="ml-4">Player 2 Score: {gameState.scores[2]}</span>
				</div>
				<button
					type="button"
					onClick={resetGame}
					className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
				>
					Reset Game
				</button>
			</div>

			{/* Game Board */}
			<div className="grid grid-cols-5 gap-2 mb-4">
				{gameState.board.map((row, rowIndex) =>
					row.map((cell, colIndex) => (
						<div
							key={`${rowIndex}-${colIndex}-${cell?.card || "empty"}`}
							className={`border p-2 cursor-pointer ${
								selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex
									? "bg-blue-100"
									: ""
							}`}
							onClick={() => setSelectedCell([rowIndex, colIndex])}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									setSelectedCell([rowIndex, colIndex]);
								}
							}}
							role="button"
							tabIndex={0}
						>
							{cell?.card && (
								<CardImage card={cell.card} className="w-full h-auto" />
							)}
						</div>
					)),
				)}
			</div>

			{/* Current Player's Hand */}
			<div className="flex gap-2">
				{(gameState.currentPlayer === 1
					? gameState.player1Hand
					: gameState.player2Hand
				).map(
					(card, index) =>
						card && (
							<div
								key={`player-card-${card}`}
								onClick={() => {
									if (selectedCell) {
										handleCardPlacement(card, selectedCell[0], selectedCell[1]);
									}
								}}
								onKeyDown={(e) => {
									if ((e.key === "Enter" || e.key === " ") && selectedCell) {
										handleCardPlacement(card, selectedCell[0], selectedCell[1]);
									}
								}}
								role="button"
								tabIndex={0}
								className="cursor-pointer hover:scale-105 transition-transform"
							>
								<CardImage card={card} className="w-20 h-auto" />
							</div>
						),
				)}
			</div>
		</div>
	);
}
