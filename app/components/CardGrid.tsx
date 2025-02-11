import type { Card, GameState } from "../types/game";
import { CardImage } from "./CardImage";

type CardGridProps = {
	gameState: GameState;
	onCardClick: (card: Card, position: [number, number]) => void;
};

export function CardGrid({ gameState, onCardClick }: CardGridProps) {
	return (
		<div
			className="grid gap-4"
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
						// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
						<div
							key={card}
							onClick={() => onCardClick(card, [rowIndex, colIndex])}
							className={`cursor-pointer transition-transform ${
								isSelected ? "scale-95" : ""
							}`}
						>
							{isSelected || isMatched ? (
								<CardImage card={card} className="w-24 h-32" />
							) : (
								<div className="w-24 h-32 bg-blue-500 rounded" />
							)}
						</div>
					);
				}),
			)}
		</div>
	);
}
