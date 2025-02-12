import { useEffect, useState } from "react";
import type { Card, GridPosition } from "../../types/game";
import { initializeGame } from "../../utils/gameUtils";
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

	socket.emit("newGame", true, 5);
	const [roomId, setRoomId] = useState<string | null>(null);
	socket.on("newGameCreated", (identifier: string) => {
		setRoomId(identifier);
	});
	console.log(roomId);
	socket.emit("gamePlayer", roomId, "P1");
	socket.emit("gamePlayer", roomId, "P2");
	console.log(roomId);

	// Side Effect to Receive Game State
	useEffect(() => {
		socket.on("gameUpdate", (roomId: string, serverState) => {
			setGameState(serverState);
		});
	}, []);

	// Action That Handles the CardClick
	const handleCardClick = (card: Card, position: GridPosition) => {
		socket.emit("playerMove", roomId, card, position);
	};

	return (
		<div className="flex flex-col items-center gap-4 p-4">
			{/* Player info */}
			<div className="flex gap-8 mb-4">
				{gameState.players.map((player, index) => (
					<div
						key={player.name}
						className={`text-2xl ${index === gameState.currentPlayer ? "font-extrabold" : "font-extralight"}`}
					>
						{player.name}: {player.score}
					</div>
				))}
			</div>

			{/* Needs modifying when lobby concept is introduced. */}
			<CardGrid gameState={gameState} onCardClick={handleCardClick} />
		</div>
	);
}
