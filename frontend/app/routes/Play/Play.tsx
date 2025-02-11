import { useState, useEffect } from "react";
import { CardImage } from "@components/CardImage";

// Grid Size
type Grid = 3 | 4 | 5 | 6 | 7;

// Card Suit
type Suit = "C" | "D" | "H" | "S";

// Card Value
type Value = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | "J" | "Q" | "K" | "A";

// Card
type Card = `${Value}${Suit}`;

// Players
type Player = {
	name: string;
	score: number;
};

// Initial Grid
type InitialGrid = {
	size: Grid;
	grid: Card[][];
	cards: Card[];
};

// Selected Cards
type SelectedCards = {
	card: Card;
	position: [number, number];
};

// Matched Cards
type MatchedCards = {
	card: Card;
};

// Game State
type GameState = {
	grid: InitialGrid;
	selectedCards: SelectedCards[];
	matchedCards: MatchedCards[];
	players: Player[];
	currentPlayer: number;
};

// Create a 2D Grid of Cards
function create2DGrid(size: Grid, cards: Card[]): Card[][] {
	// Create a copy of cards array to avoid mutating the original
	const shuffledCards = [...cards];

	// Fisher-Yates shuffle algorithm
	for (let i = shuffledCards.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
	}

	const grid: Card[][] = [];
	for (let i = 0; i < size; i++) {
		grid[i] = [];
		for (let j = 0; j < size; j++) {
			const index = i * size + j;
			grid[i][j] = shuffledCards[index];
		}
	}
	return grid;
}

// Game Actions
function handleMatch(gameState: GameState): GameState {
	const { selectedCards, players, currentPlayer } = gameState;
	const newState = { ...gameState };

	// Need exactly 2 selected cards to validate a match
	if (selectedCards.length !== 2) {
		return newState;
	}

	// If there's a match, increase the current player's score
	if (selectedCards[0].card[0] === selectedCards[1].card[0]) {
		players[currentPlayer].score += 1;
		newState.matchedCards.push(selectedCards[0], selectedCards[1]);
		return newState;
	}
	// Only switch to next player if there's no match
	newState.currentPlayer = (currentPlayer + 1) % players.length;

	return newState;
}

// Initialize game grid
function initializeGame(size: Grid, players: Player[]): GameState {
	// Create all possible cards
	const suits: Suit[] = ["C", "D", "H", "S"];
	const values: Value[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];

	// Generate pairs of cards needed for the grid
	const gridSize = size * size;
	const neededPairs = Math.floor(gridSize / 2);
	const cards: Card[] = [];

	for (let i = 0; i < neededPairs; i++) {
		const randomSuit = suits[Math.floor(Math.random() * suits.length)];
		const randomValue = values[Math.floor(Math.random() * values.length)];
		const card = `${randomValue}${randomSuit}` as Card;
		// Add each card twice to create pairs
		cards.push(card, card);
	}

	return {
		grid: {
			size,
			cards,
			grid: create2DGrid(size, cards),
		},
		selectedCards: [],
		matchedCards: [],
		players,
		currentPlayer: 0,
	};
}

export default function Play() {
	const [gameState, setGameState] = useState<GameState>(() =>
		initializeGame(3, [
			{ name: "Player 1", score: 0 },
			{ name: "Player 2", score: 0 },
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
			}, 1000); // 1 second delay

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
		console.log(gameState);
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
				className="grid gap-1"
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
							<div
								key={card}
								onClick={() => handleCardClick(card, [rowIndex, colIndex])}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										handleCardClick(card, [rowIndex, colIndex]);
									}
								}}
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
