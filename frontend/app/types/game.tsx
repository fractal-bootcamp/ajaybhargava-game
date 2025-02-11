// Grid Size
export type Grid = 3 | 4 | 5;

// Card Suit
export type Suit = "C" | "D" | "H" | "S";

// Card Value
export type Value = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | "J" | "Q" | "K" | "A";

// Card
export type Card = `${Value}${Suit}`;

// Players
export type Player = {
	name: string;
	score: number;
};

// Initial Grid
export type InitialGrid = {
	size: Grid;
	grid: Card[][];
	cards: Card[];
};

// Selected Cards
export type SelectedCards = {
	card: Card;
	position: [number, number];
};

// Matched Cards
export type MatchedCards = {
	card: Card;
};

// Game State
export type GameState = {
	grid: InitialGrid;
	selectedCards: SelectedCards[];
	matchedCards: MatchedCards[];
	players: Player[];
	currentPlayer: number;
}; 