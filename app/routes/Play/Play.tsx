import { useEffect, useState } from "react";
import type { Card, GridPosition } from "../../types/game";
import { initializeGame, handleCardSelection } from "../../utils/gameUtils";
import { useCardResetTimer } from "../../hooks/useCardResetTimer";
import { CardGrid } from "../../components/CardGrid";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

export default function Play() {
	const [gameState, setGameState] = useState(() =>
		initializeGame(5, [
			{ name: "P1", score: 0 },
			{ name: "P2", score: 0 },
		]),
	);

	// Side Effect to Receive Game State
	useEffect(() => {
		socket.on("gameUpdate", (serverState) => {
			setGameState(
				initializeGame(5, [
					{ name: "P1", score: 0 },
					{ name: "P2", score: 0 },
				]),
			);
			setGameState(serverState);
		});
		return () => {
			socket.off("gameUpdate");
		};
	}, []);

	// Action that resets the SelectedCards
	useCardResetTimer(gameState, setGameState);

	// Action that handles the CardClick
	const handleCardClick = (card: Card, position: GridPosition) => {
		// Local Mode
		// setGameState((prevState) => handleCardSelection(prevState, card, position));
		// Server Mode
		socket.emit("playerMove", card, position);
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
