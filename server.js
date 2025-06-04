const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const io = new Server(server);
let counter = 10;
let isLocked = false;
const connectedClients = new Map();
app.use(cors());
const clientBuildPath = path.join(__dirname, './build');
app.use(express.static(clientBuildPath));
app.get('/', (_, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});
io.on('connection', (socket) => {
  connectedClients.set(socket.id, true);
  socket.emit('connected', { id: socket.id, counter, allUsers: Array.from(connectedClients.keys()) });
  io.emit('users', Array.from(connectedClients.keys()));
  socket.on('increment', (cb) => {
    if (isLocked) return cb({ success: false, msg: "Someone else is clicking!" });
    isLocked = true;
    counter++;
    io.emit('updateCounter', counter);
    cb({ success: true, counter });
    isLocked = false;
  });
  socket.on('decrement', (cb) => {
    if (isLocked) return cb({ success: false, msg: "Someone else is clicking!" });
    isLocked = true;
    counter--;
    io.emit('updateCounter', counter);
    cb({ success: true, counter });
    isLocked = false;
  });
  socket.on('disconnect', () => {
    connectedClients.delete(socket.id);
    io.emit('users', Array.from(connectedClients.keys()));
  });
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
