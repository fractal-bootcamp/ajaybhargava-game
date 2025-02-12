import express  from 'express';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import type { GameState, Card, GridPosition, Player } from '../types/game';
import type { ServerGame, MovePayload, CreateGamePayload } from '../types/server';
import { handleCardSelection, initializeGame } from '~/utils/gameUtils';


// Deployment Port
const PORT = process.env.PORT || 3001;

// Server Deployable Game State
const InitialGameState: GameState = initializeGame(5, [
    {
        name: 'Player 1',
        score: 0,
    },
    {
        name: 'Player 2',
        score: 0,
    },
]);

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

io.on('connection', (socket) => {
    // Create a new initialized game state for each new connection
    const newGameState = initializeGame(5, [
        {
            name: 'Player 1',
            score: 0,
        },
        {
            name: 'Player 2',
            score: 0,
        },
    ]);
    socket.emit('gameUpdate', newGameState)
    
    socket.on('playerMove', (card: Card, position: GridPosition) => {
        // Use the current game state instead of InitialGameState
        const gameUpdate = handleCardSelection(newGameState, card, position)
        io.emit('gameUpdate', gameUpdate)
    })

    socket.on('newGame', () => {
        const game = initializeGame(5, [
            {
                name: 'Player 1',
                score: 0,
            },
            {
                name: 'Player 2',
                score: 0,
            },
        ]);
        io.emit('gameUpdate', game);
    })

    socket.on('disconnect', () => {
        console.log("Player Disconnected", socket.id);
    })
})

HttpServer.listen(PORT, () => {
    console.log(`🚀 Backend is listening on http://localhost:${PORT}`)
})