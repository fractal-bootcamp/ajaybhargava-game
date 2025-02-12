import type { Card, Player, GameState } from "./game";

export interface ServerGame {
    id: string;
    state: GameState;
    lastUpdated: Date;
}

export interface MovePayload {
    playerId: string;
    card: Card;
    position: [number, number];
}

export interface CreateGamePayload {
    playerName: string;
    gridSize?: number;
}
