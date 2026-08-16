import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"]
  }
});

const actionLogs = []; 
let masterBoardState = null; 

io.on('connection', (socket) => {
  console.log('🟢 Client connected:', socket.id);
  
  socket.emit('board:history', actionLogs);
  
  if (masterBoardState) {
    console.log('📦 Sending master board state to new client');
    socket.emit('board:stateSync', masterBoardState);
  }

  socket.on('board:action', (data) => {
    const { action, log, fullState } = data;
    
    if (log) {
      actionLogs.unshift(log); 
      if (actionLogs.length > 100) actionLogs.pop();
    }

    // Capture and save the entire board whenever ANY change happens
    if (fullState && fullState.boards) {
      masterBoardState = fullState;
      console.log(`💾 Master State Saved! Total Columns: ${masterBoardState.boards.length}`);
    }

    socket.broadcast.emit('board:sync', { action, log });
  });

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id);
  });
});

httpServer.listen(3001, () => {
  console.log('🚀 Socket server running on port 3001');
});