const { sequelize } = require('./models/index');
const mountRoutes = require('./Routes');
const http = require('http')
const jwt = require('jsonwebtoken');

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { Server } = require('socket.io');
dotenv.config();


const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
},
));

let io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET','POST'],
    credentials: true
  }
})

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error: No token provided'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new Error('Authentication error: Invalid or expired token'));
    }
    socket.user = decoded;
    next();
  });
});

io.on('connection', (socket) => {
  // Connected

  socket.on('join', ({ userId, socketId }) => {
    // Joined socket
  });

  // Listen for messages and broadcast them to all clients
  socket.on('message', (message) => {
    // Broadcast to all clients including the sender
    io.emit('message', message);
  });

  socket.on('typing', (data) => {
    io.emit('typing', data)
  })

  socket.on('disconnect', () => {
    // Disconnected
  });
});

mountRoutes(app);

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
