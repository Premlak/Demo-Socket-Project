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
app.use(express.static('build'));
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, './build', 'index.html'));
});

io.on('connection', (socket) => {
  connectedClients.set(socket.id, true);
  socket.emit('connected', { id: socket.id, counter, allUsers: Array.from(connectedClients.keys()) });
  io.emit('users', Array.from(connectedClients.keys()));
  const handleCounterChange = (type, cb) => {
    if (isLocked) {
      return cb({ success: false, msg: "Please wait, another user is updating!" });
    }
    isLocked = true;
    type === 'increment' ? counter++ : counter--;
    io.emit('updateCounter', counter);
    cb({ success: true, counter });
    setTimeout(() => {
      isLocked = false;
    }, 100); 
  };
  socket.on('increment', (cb) => handleCounterChange('increment', cb));
  socket.on('decrement', (cb) => handleCounterChange('decrement', cb));
  socket.on('disconnect', () => {
    connectedClients.delete(socket.id);
    io.emit('users', Array.from(connectedClients.keys()));
  });
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));