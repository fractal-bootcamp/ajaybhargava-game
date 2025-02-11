type Grid = 3 | 4 | 5 | 6;
type Suit = "C" | "D" | "H" | "S";
type Value = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | "J" | "Q" | "K" | "A";

type Card = `${Value}${Suit}`;

function create2DGrid(gridSize: Grid, cards: Card[]): Card[][] {
	const grid: Card[][] = [];
	for (let i = 0; i < gridSize; i++) {
		grid[i] = [];
		for (let j = 0; j < gridSize; j++) {
			const index = i * gridSize + j;
			grid[i][j] = cards[index];
		}
	}
	return grid;
}

type InitialGrid = {
	gridSize: Grid;
	cards: Card[];
};

export default function Play() {
	return <div>Play</div>;
}
