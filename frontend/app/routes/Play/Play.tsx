import { useState, useEffect } from "react";
import { CardImage } from "@components/CardImage";
import type { Card, GameState } from "../../types/game";
import { initializeGame, handleMatch } from "../../utils/gameUtils";

export default function Play() {
	const [gameState, setGameState] = useState<GameState>(() =>
		initializeGame(5, [
			{ name: "Ajay", score: 0 },
			{ name: "Koyal", score: 0 },
		]),
	);

	useEffect(() => {
		if (gameState.selectedCards.length === 2) {
			const cardsMatch =
				gameState.selectedCards[0].card[0] ===
				gameState.selectedCards[1].card[0];

			// Always clear selected cards after a delay
			const timer = setTimeout(() => {
				setGameState((prevState) => ({
					...prevState,
					selectedCards: [],
				}));
			}, 500);

			return () => clearTimeout(timer);
		}
	}, [gameState.selectedCards]);

	const handleCardClick = (card: Card, position: [number, number]) => {
		setGameState((prevState) => {
			// Add card to selected cards
			const newState = {
				...prevState,
				selectedCards: [...prevState.selectedCards, { card, position }],
			};

			// If we have 2 cards selected, handle the match
			if (newState.selectedCards.length === 2) {
				return handleMatch(newState);
			}

			return newState;
		});
	};

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
					gridTemplateColumns: `repeat(${gameState.grid.size}, minmax(0, 1fr))`,
				}}
			>
				{gameState.grid.grid.map((row, rowIndex) =>
					row.map((card, colIndex) => {
						const isMatched = gameState.matchedCards.some(
							(match) => match.card === card,
						);
						const isSelected = gameState.selectedCards.some(
							(selected) =>
								selected.position[0] === rowIndex &&
								selected.position[1] === colIndex,
						);
						return (
							// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
							<div
								key={card}
								onClick={() => handleCardClick(card, [rowIndex, colIndex])}
								className={`cursor-pointer transition-transform ${
									isSelected ? "scale-95" : ""
								}`}
							>
								{isSelected || isMatched ? (
									<CardImage card={card} className="w-36 h-52" />
								) : (
									<div className="w-36 h-52 bg-blue-500 rounded" />
								)}
							</div>
						);
					}),
				)}
			</div>
		</div>
	);
}
