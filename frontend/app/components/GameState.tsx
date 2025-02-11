// Card List
// All possible card ranks
type Rank = "J" | "Q" | "K" | "A";

// All possible suits
type Suit = "H" | "S" | "D" | "C";

// All possible cards as a readonly array (to be used in the Board State)
export type ValidCards =
	| "JH"
	| "QH"
	| "KH"
	| "AH" // Hearts
	| "JS"
	| "QS"
	| "KS"
	| "AS" // Spades
	| "JD"
	| "QD"
	| "KD"
	| "AD" // Diamonds
	| "JC"
	| "QC"
	| "KC"
	| "AC" // Clubs
	| null;

// Add these new types and constants
export const FULL_DECK: ValidCards[] = [
	"JH",
	"QH",
	"KH",
	"AH",
	"JS",
	"QS",
	"KS",
	"AS",
	"JD",
	"QD",
	"KD",
	"AD",
	"JC",
	"QC",
	"KC",
	"AC",
];

// Combined card type (e.g., "JH", "QS", etc.)
type Card = ValidCards;

// Player Ownership State
type PlayerOwnership = 1 | 2;

// Card values mapping
const CardValues: Record<Rank, number> = {
	J: 11,
	Q: 12,
	K: 13,
	A: 14,
};

// Function to Map Card to Value (to be used in the Board State)
export function AssignCardValue(card: Card): number {
	return card && card.split("")[0] in CardValues
		? CardValues[card.split("")[0] as Rank]
		: 0;
}

// Function to Select 5 Cards from the Deck (to be used in the Player State)
export function Select5Cards(deck: Card[]): PlayerHand {
	const selectedCards = deck.sort(() => Math.random() - 0.5).slice(0, 5);
	return selectedCards as PlayerHand;
}

// Player Hand
type PlayerHand = [Card, Card, Card, Card, Card];

// Track who placed each card
type CardPlacement = {
	card: Card;
	player: PlayerOwnership;
};

// Board State
export type BoardState = [
	[
		CardPlacement | null,
		CardPlacement | null,
		CardPlacement | null,
		CardPlacement | null,
		CardPlacement | null,
	],
	[
		CardPlacement | null,
		CardPlacement | null,
		CardPlacement | null,
		CardPlacement | null,
		CardPlacement | null,
	],
	[
		CardPlacement | null,
		CardPlacement | null,
		CardPlacement | null,
		CardPlacement | null,
		CardPlacement | null,
	],
	[
		CardPlacement | null,
		CardPlacement | null,
		CardPlacement | null,
		CardPlacement | null,
		CardPlacement | null,
	],
	[
		CardPlacement | null,
		CardPlacement | null,
		CardPlacement | null,
		CardPlacement | null,
		CardPlacement | null,
	],
];

// Game Logic (had ChatGPT help me with this)
/**
 * Determines the winner of a line (row or column) based on card values and suits.
 * A line must be completely filled (no null values) to have a winner.
 *
 * Winning is determined by:
 * 1. Highest total card value (J=11, Q=12, K=13, A=14)
 * 2. If values are tied, most cards of a suit (checking H, S, D, C in order)
 * 3. If everything is tied, Player 1 wins
 *
 * @param line - Array of 5 card placements to evaluate
 * @returns The winning player (1 or 2), or null if line is incomplete
 */
export function determineLineWinner(
	line: (CardPlacement | null)[],
): PlayerOwnership | null {
	if (line.includes(null)) return null;

	// Calculate total value per player
	const playerScores = {
		1: { total: 0, suits: {} as Record<Suit, number> },
		2: { total: 0, suits: {} as Record<Suit, number> },
	};

	// Calculate total value per player
	for (const placement of line) {
		if (!placement || !placement.card) continue;
		const value = AssignCardValue(placement.card);
		const suit = placement.card[1] as Suit;

		playerScores[placement.player].total += value;
		playerScores[placement.player].suits[suit] =
			(playerScores[placement.player].suits[suit] || 0) + 1;
	}

	// If scores are different, higher score wins
	if (playerScores[1].total !== playerScores[2].total) {
		return playerScores[1].total > playerScores[2].total ? 1 : 2;
	}

	// If tied, check suit counts
	for (const suit of ["H", "S", "D", "C"] as Suit[]) {
		const p1SuitCount = playerScores[1].suits[suit] || 0;
		const p2SuitCount = playerScores[2].suits[suit] || 0;
		if (p1SuitCount !== p2SuitCount) {
			return p1SuitCount > p2SuitCount ? 1 : 2;
		}
	}

	// If everything is tied, return player 1 (or implement another tiebreaker)
	return 1;
}

/**
 * Calculates the total score for each player based on completed rows and columns.
 * For each completed line (row/column), the winner gets points equal to the sum
 * of all card values in that line.
 *
 * @param board - Current state of the 5x5 game board
 * @returns Object with scores for both players: {1: number, 2: number}
 */
export function CountScore(board: BoardState): Record<PlayerOwnership, number> {
	const scores = { 1: 0, 2: 0 };

	// Check rows
	for (let i = 0; i < 5; i++) {
		const row = board[i];
		const winner = determineLineWinner(row);
		if (winner) {
			const rowScore = row.reduce(
				(sum, placement) =>
					sum + (placement ? AssignCardValue(placement.card) : 0),
				0,
			);
			scores[winner] += rowScore;
		}
	}

	// Check columns
	for (let j = 0; j < 5; j++) {
		const column = board.map((row) => row[j]);
		const winner = determineLineWinner(column);
		if (winner) {
			const columnScore = column.reduce(
				(sum, placement) =>
					sum + (placement ? AssignCardValue(placement.card) : 0),
				0,
			);
			scores[winner] += columnScore;
		}
	}

	return scores;
}

// Game State
export interface GameState {
	board: BoardState;
	currentPlayer: PlayerOwnership;
	player1Hand: PlayerHand;
	player2Hand: PlayerHand;
	deck: ValidCards[];
	scores: Record<PlayerOwnership, number>;
}

// Initialize an empty game state
export function createInitialGameState(): GameState {
	const emptyBoard: BoardState = Array(5)
		.fill(null)
		.map(() => Array(5).fill(null)) as BoardState;

	const shuffledDeck = [...FULL_DECK].sort(() => Math.random() - 0.5);
	const player1Hand = shuffledDeck.slice(0, 5) as PlayerHand;
	const player2Hand = shuffledDeck.slice(5, 10) as PlayerHand;
	const remainingDeck = shuffledDeck.slice(10);

	return {
		board: emptyBoard,
		currentPlayer: 1,
		player1Hand,
		player2Hand,
		deck: remainingDeck,
		scores: { 1: 0, 2: 0 },
	};
}

// Handle card placement and return new game state
export function placeCardAndUpdateGame(
	gameState: GameState,
	card: ValidCards,
	position: [number, number],
): GameState {
	const [row, col] = position;

	// If cell is occupied, return unchanged state
	if (gameState.board[row][col] !== null) {
		return gameState;
	}

	// Create new board with placed card
	const newBoard = gameState.board.map((row) => [...row]) as BoardState;
	newBoard[row][col] = {
		card,
		player: gameState.currentPlayer,
	};

	// Draw new card and update hand
	const newDeck = [...gameState.deck];
	const newCard =
		newDeck.length > 0
			? newDeck.splice(Math.floor(Math.random() * newDeck.length), 1)[0]
			: null;

	const newPlayer1Hand = [...gameState.player1Hand];
	const newPlayer2Hand = [...gameState.player2Hand];

	if (gameState.currentPlayer === 1) {
		const cardIndex = newPlayer1Hand.indexOf(card);
		if (cardIndex !== -1 && newCard) {
			newPlayer1Hand[cardIndex] = newCard;
		}
	} else {
		const cardIndex = newPlayer2Hand.indexOf(card);
		if (cardIndex !== -1 && newCard) {
			newPlayer2Hand[cardIndex] = newCard;
		}
	}

	return {
		board: newBoard,
		currentPlayer: gameState.currentPlayer === 1 ? 2 : 1,
		player1Hand: newPlayer1Hand as PlayerHand,
		player2Hand: newPlayer2Hand as PlayerHand,
		deck: newDeck,
		scores: CountScore(newBoard),
	};
}

// Check if game is over (board is full)
export function isGameOver(board: BoardState): boolean {
	return board.every((row) => row.every((cell) => cell !== null));
}

// Get winner based on final scores
export function getWinner(
	scores: Record<PlayerOwnership, number>,
): PlayerOwnership | null {
	if (scores[1] === scores[2]) return null;
	return scores[1] > scores[2] ? 1 : 2;
}
