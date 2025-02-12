import type { Card, NumCols, Player, GameState } from "../types/types";
import { randomBoard } from "../types/types";


function selectAndRemoveCard(availableCards: Card[], cardPool: Card[]): Card {
	const selectedCard =
		availableCards[Math.floor(Math.random() * availableCards.length)];
	return selectedCard;
}

export function initializeGame(size: NumCols, players: Player[]): GameState {

	return {
		board: randomBoard(size),
		selections: [],
		matchedCards: [],
		players,
		currentPlayer: 0,
	};
}
