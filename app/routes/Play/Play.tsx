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
	const [roomId, setRoomId] = useState<string | null>(null);

	// Setup socket connection and game room
	useEffect(() => {
		console.log("Connecting to socket server...");

		// Create new game room
		socket.emit("newGame", true, 5);
		console.log("Emitted newGame event");

		// Listen for room creation
		const handleNewGame = (identifier: string) => {
			console.log("Received newGameCreated event:", identifier);
			setRoomId(identifier);

			// Add players only after room is created
			console.log("Adding players to room:", identifier);
			socket.emit("gamePlayer", identifier, "P1");
			socket.emit("gamePlayer", identifier, "P2");
		};

		// Listen for game updates
		const handleGameUpdate = (serverState: typeof gameState) => {
			console.log("Received game update:", serverState);
			setGameState(serverState);
		};

		// Listen for errors
		const handleError = (error: string) => {
			console.error("Socket error:", error);
		};

		// Set up listeners
		socket.on("newGameCreated", handleNewGame);
		socket.on("gameUpdate", handleGameUpdate);
		socket.on("error", handleError);

		// Connection status listeners
		socket.on("connect", () => {
			console.log("Connected to socket server");
		});

		socket.on("disconnect", () => {
			console.log("Disconnected from socket server");
		});

		// Cleanup listeners when component unmounts
		return () => {
			socket.off("newGameCreated", handleNewGame);
			socket.off("gameUpdate", handleGameUpdate);
			socket.off("error", handleError);
		};
	}, []); // Empty dependency array since we only want this to run once

	// Action That Handles the CardClick
	const handleCardClick = (card: Card, position: GridPosition) => {
		if (roomId) {
			console.log("Emitting playerMove:", { roomId, card, position });
			socket.emit("playerMove", roomId, card, position);
		} else {
			console.warn("Card clicked but no room ID available");
		}
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
