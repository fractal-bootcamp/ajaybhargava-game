import type { Card, Grid, Suit, Value, Player, GameState } from "../types/game";

// Create a 2D Grid of Cards and shuffle their positions
export function create2DGrid(size: Grid, cards: Card[]): Card[][] {
	// Create all possible cards
	const suits: Suit[] = ["C", "D", "H", "S"];
	const values: Value[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
	const FiftyTwoCards: Card[] = [];

	for (const suit of suits) {
		for (const value of values) {
			FiftyTwoCards.push(`${value}${suit}` as Card);
		}
	}

	// Shuffle Cards
	const shuffledCards = [...cards];
	for (let i = shuffledCards.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
	}
	const grid: Card[][] = [];
	for (let i = 0; i < 4; i++) {
		grid[i] = [];
		for (let j = 0; j < size; j++) {
			const index = i * size + j;
			grid[i][j] = shuffledCards[index];
		}
	}

	// Find 'undefined' values and replace them with a random card from FiftyTwoCards that aren't already in the grid
	for (let i = 0; i < grid.length; i++) {
		for (let j = 0; j < grid[i].length; j++) {
			if (grid[i][j] === undefined) {
				// console.log("Undefined Found");
				const randomCard =
					FiftyTwoCards[Math.floor(Math.random() * FiftyTwoCards.length)];
				if (!grid.some((row) => row.includes(randomCard))) {
					grid[i][j] = randomCard;
				}
				// console.log(`Replacing with ${randomCard}`);
			}
		}
	}
	return grid;
}

// Game Actions
export function handleMatch(gameState: GameState): GameState {
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

function selectAndRemoveCard(availableCards: Card[], cardPool: Card[]): Card {
	const selectedCard =
		availableCards[Math.floor(Math.random() * availableCards.length)];
	return selectedCard;
}

export function initializeGame(size: Grid, players: Player[]): GameState {
	// Create all possible cards
	const suits: Suit[] = ["C", "D", "H", "S"];
	const values: Value[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
	let FiftyTwoCards: Card[] = [];
	for (const suit of suits) {
		for (const value of values) {
			FiftyTwoCards.push(`${value}${suit}` as Card);
		}
	}

	// Generate pairs of cards needed for the grid
	const cards: Card[] = [];

	for (let i = 0; i <= 13; i++) {
		const randomValue = values[Math.floor(Math.random() * values.length)];
		const availablePair = FiftyTwoCards.filter(
			(card) => card[0] === randomValue.toString(),
		);

		// Select first card and remove remaining pairs.
		const firstCard = selectAndRemoveCard(availablePair, FiftyTwoCards);
		FiftyTwoCards = FiftyTwoCards.filter((card) => card !== firstCard);

		// Select second card from remaining pairs.
		const remainingPair = availablePair.filter((card) => card !== firstCard);
		const secondCard = selectAndRemoveCard(remainingPair, FiftyTwoCards);
		FiftyTwoCards = FiftyTwoCards.filter((card) => card !== secondCard);

		cards.push(firstCard, secondCard);
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
