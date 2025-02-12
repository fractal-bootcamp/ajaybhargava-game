
import express  from 'express';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import type { ServerGame, MovePayload, CreateGamePayload } from '../types/server';

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.get('/', (req, res) => { 
    res.send("Hello World.")
})
const server = createServer(app);

        