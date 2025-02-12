import express  from 'express';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import cors from 'cors';
import type { GameState, Card, GridPosition } from '../types/game';
import { handleCardSelection, initializeGame } from '~/utils/gameUtils';
import type { GameRoom, Lobby, Player } from '~/types/lobby';
import { v4 as uuidv4 } from 'uuid';

// Deployment Port
const PORT = process.env.PORT || 3001;

// Server Deployable Game State
let gameState: GameState = initializeGame(5, [
    {
        name: 'Player 1',
        score: 0,
    },
    {
        name: 'Player 2',
        score: 0,
    },
]);

const GameLobby: Lobby = {
    rooms: new Map<string, GameRoom>()
};

// Initialize Express Server
const app = express();
// Initial Server
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.get('/', (req, res) => { 
    res.send("Hello World.")
})
const HttpServer = createServer(app);

const io = new Server(HttpServer, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true, 
    },
})

// Add reset timer function on server
function resetSelectedCards() {
    gameState = {
        ...gameState,
        selectedCards: []
    };
    io.emit('gameUpdate', gameState);
}

io.on('connection', (socket) => {
    // New GameRoom with UUID
    socket.on('newGame', (newGame, Size) => {
        const identifier = uuidv4()
        const matchGame: GameRoom = {
            roomId: identifier,
            players: [],
            gameState: null,
            status: 'waiting',
            maxPlayers: 2,
            gamesize: Size,
        }
        if (newGame) {
            GameLobby.rooms.set(
                identifier,
                matchGame,
            )
            socket.emit("newGameCreated", identifier)
        }
    });

    // Add GamePlayer to GameRoom. 
    socket.on('gamePlayer', (roomId: string , playerName: string) => {
        const room = GameLobby.rooms.get(roomId)
        
        if (!room) {
            socket.emit("Error! Room Not Found.")
        };
        
        if (room) { 
            const newPlayer: Player = {
                socketId: socket.id,
                name: playerName,
                isReady: true,
                spectator: room ? room.players.length >= room.maxPlayers : false
            }
            room.players.push(newPlayer);
        }

        if (room && room.players.length <= room.maxPlayers) {
            room.status = "waiting"
            socket.emit(`Game Room with ${roomId} is ${room.status} for more players.`)
        }

        if (room && room.players.length >= room.maxPlayers) {
            const playerNames = room.players.map(player => ({
                name: player.name,
                score: 0
            }));
            room.status = "ready"
            socket.emit(`Game Room with ${roomId} is ${room.status} to play.`)
            room.gameState = initializeGame(room.gamesize, playerNames)
        }
    });
    // Game Handling
    socket.emit('gameUpdate', gameState);
    socket.on('playerMove', (card: Card, position: GridPosition) => {
        gameState = handleCardSelection(gameState, card, position);
        io.emit('gameUpdate', gameState);
        // If two cards are selected, start the reset timer
        if (gameState.selectedCards.length === 2) {
            setTimeout(() => {
                resetSelectedCards();
            }, 500);
        }
    });

    // Disconnect Game
    socket.on('disconnect', () => {
        console.log("Player Disconnected", socket.id);
    })
})

HttpServer.listen(PORT, () => {
    console.log(`🚀 Backend is listening on http://localhost:${PORT}`)
})