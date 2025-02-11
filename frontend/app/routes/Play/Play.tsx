import { useState, useEffect } from "react";
import { CardImage } from "@components/CardImage";
import { isMatch, type Position } from "../../types/types";
import { initializeGame } from "../../utils/utilities";
import type { GameState } from "../../types/types";

const initialPlayers = [
	{ name: "Ajay", score: 0 },
	{ name: "Koyal", score: 0 },
];
const defaultSize = 5;
const initialGame = initializeGame(defaultSize, initialPlayers);

function selectCard(position: Position, game: GameState): GameState {
	// Don't allow selecting the same card twice
	if (
		game.selections.some(
			(selected) => selected[0] === position[0] && selected[1] === position[1],
		)
	) {
		return game;
	}
	if (game.selections.length === 2) return game;
	return { ...game, selections: [...game.selections, position] };
}

function scoreMatch(gameState: GameState): GameState {
	const prevState = structuredClone(gameState);
	const players = prevState.players;
	players[prevState.currentPlayer].score += 1;
	return {
		...prevState,
		selections: [],
		matchedCards: [...prevState.matchedCards, ...prevState.selections],
		players,
		currentPlayer: (prevState.currentPlayer + 1) % players.length,
	};
}

function isGameOver(gameState: GameState): boolean {
	return (
		gameState.matchedCards.length ===
		gameState.board.grid.length * gameState.board.grid[0].length
	);
}

export default function Play() {
	const [gameState, setGameState] = useState<GameState>(initialGame);
	const columns = gameState.board.grid.length;

	// animation loop to check for matches and flip down cards:
	useEffect(() => {
		if (gameState.selections.length !== 2) {
			return;
		}

		if (isMatch(gameState)) {
			setGameState(scoreMatch(gameState));
		}

		if (gameState.selections.length === 2) {
			// Always clear selected cards after a delay
			const timer = setTimeout(() => {
				setGameState((prevState) => ({
					...prevState,
					selectedCards: [],
				}));
			}, 500);

			return () => clearTimeout(timer);
		}
	}, [gameState]);

	function handleCardClick(position: Position) {
		// Don't allow clicking already matched cards
		if (
			gameState.matchedCards.some(
				(match) => match[0] === position[0] && match[1] === position[1],
			)
		) {
			return;
		}
		setGameState((prevState) => selectCard(position, prevState));
	}

	return (
		<div className="flex flex-col items-center gap-4 p-4">
			{/* Player info */}
			<div className="flex gap-8 mb-4">
				{gameState.players.map((player, index) => (
					<div
						key={player.name}
						className={`text-lg ${index === gameState.currentPlayer ? "font-bold" : ""}`}
					>
						{player.name}: {player.score}
					</div>
				))}
			</div>

			{/* Card grid */}
			<div
				className="grid gap-4"
				style={{
					gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
				}}
			>
				{gameState.board.grid.map((row, rowIndex) =>
					row.map((card, colIndex) => {
						return (
							// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
							<div
								key={card}
								onClick={() => handleCardClick([rowIndex, colIndex])}
								className={`cursor-pointer transition-transform ${
									gameState.selections.some(
										(selected) =>
											selected[0] === rowIndex && selected[1] === colIndex,
									)
										? "scale-95"
										: ""
								}`}
							>
								{gameState.matchedCards.some(
									(match) => match[0] === rowIndex && match[1] === colIndex,
								) ? (
									<CardImage card={card} className="w-24 h-32" />
								) : (
									<div className="w-24 h-32 bg-blue-500 rounded" />
								)}
							</div>
						);
					}),
				)}
			</div>
		</div>
	);
}
