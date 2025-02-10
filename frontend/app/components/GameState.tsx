// Game State
import { useState } from "react";

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

// Combined card type (e.g., "JH", "QS", etc.)
type Card = ValidCards;

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

// Board State
type BoardCardsState = [
	[Card, Card, Card, Card, Card],
	[Card, Card, Card, Card, Card],
	[Card, Card, Card, Card, Card],
	[Card, Card, Card, Card, Card],
	[Card, Card, Card, Card, Card],
];

// Player State (to be initialized with 5 cards from the deck)
type Player = {
	board: BoardCardsState;
	hand: PlayerHand;
	score: number;
};
