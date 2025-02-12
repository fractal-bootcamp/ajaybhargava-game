import express  from 'express';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import cors from 'cors';
import type { GameState, Card, GridPosition } from '../types/game';
import { handleCardSelection, initializeGame } from '~/utils/gameUtils';


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
    socket.emit('gameUpdate', gameState);

    socket.on('playerMove', (card: Card, position: GridPosition) => {
        gameState = handleCardSelection(gameState, card, position);
        io.emit('gameUpdate', gameState);
        // If two cards are selected, start the reset timer
        if (gameState.selectedCards.length === 2) {
            console.log('here.')
            setTimeout(() => {
                resetSelectedCards();
            }, 500);
        }

    });

    socket.on('disconnect', () => {
        console.log("Player Disconnected", socket.id);
    })
})

HttpServer.listen(PORT, () => {
    console.log(`🚀 Backend is listening on http://localhost:${PORT}`)
})