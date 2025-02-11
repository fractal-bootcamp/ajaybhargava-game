// CONSTS:
export const COL_SIZE = 4;

// Grid Size
export type NumCols = 3 | 4 | 5;


export const suits = ["C", "D", "H", "S"] as const;
export type Suit = typeof suits[number]


export const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"] as const;
export type Value = typeof values[number]

// Generate all 52 possible cards
export const allCards = suits.flatMap(suit => 
    values.map(value => `${value}${suit}` as const)
);
export type AllCards = typeof allCards[number];

// Card
export type Card = `${Value}${Suit}`;

// Players
export type Player = {
	name: string;
	score: number;
};

// Initial Grid
export type Board = {
	grid: Card[][];
};

export type Position = [number, number]

// Game State
export type GameState = {
	board: Board;
    selections: [] | [Position] | [Position, Position]
	matchedCards: Position[];
	players: Player[];
	currentPlayer: number;
};

function chooseNRandomCards(deck: Card[], n: number): Card[]{
    const indices = new Set<number>();
    while(indices.size < n) {
        const randomIndex = Math.floor(Math.random() * deck.length);
        indices.add(randomIndex);
    }
    const indicesArray = Array.from(indices);
    return indicesArray.map(index => deck[index]);
   }


function shuffleArray<T>(array: Array<T>): Array<T> {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function arrangeCardsIntoCols(numCols: NumCols, cards: Card[]): Card[][]{
    const shuffledCards = shuffleArray([...cards])
    const colSize = cards.length / numCols;
    const cols: Card[][] = [];
    for(let i = 0; i < numCols; i++) {
        cols.push(shuffledCards.slice(i * colSize, (i + 1) * colSize));
    }
    return cols;
}

export function randomBoard(numCols: NumCols): Board {
    const numCardsToChoose = numCols*COL_SIZE / 2
    const cards = chooseNRandomCards(allCards, numCardsToChoose)
    const doubleCards = [...cards, ...cards]
    const cardGrid = arrangeCardsIntoCols(numCols, doubleCards)
    return {
		grid: cardGrid,
	}
}

// Game Calculation
export function isMatch(gameState: GameState): boolean {
	const newState = { ...gameState };
	const { selections, board } = newState;

	// Need exactly 2 selected cards to validate a match
	if (selections.length !== 2) {
		return false;
	}
    const selection1 = board.grid[selections[0][0]][selections[0][1]];
    const selection2 = board.grid[selections[1][0]][selections[1][1]];
	return selection1 === selection2;
}

