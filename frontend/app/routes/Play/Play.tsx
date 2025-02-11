import { useState } from "react";
import type { Card } from "../../types/game";
import { initializeGame, handleCardSelection } from "../../utils/gameUtils";
import { useCardResetTimer } from "../../hooks/useCardResetTimer";
import { CardGrid } from "../../components/CardGrid";

export default function Play() {
	const [gameState, setGameState] = useState(() =>
		initializeGame(5, [
			{ name: "Ajay", score: 0 },
			{ name: "Koyal", score: 0 },
		]),
	);

	console.log(gameState.grid.grid);

	useCardResetTimer(gameState, setGameState);

	const handleCardClick = (card: Card, position: [number, number]) => {
		setGameState((prevState) => handleCardSelection(prevState, card, position));
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

			<CardGrid gameState={gameState} onCardClick={handleCardClick} />
		</div>
	);
}
