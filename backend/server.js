const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const port = process.env.PORT || 5001;

app.use(cors({
  origin: 'http://localhost:5001',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// Check if the route files exist and import them
const routes = ['auth', 'projects', 'tasks', 'admin'];
routes.forEach(route => {
  const routePath = path.join(__dirname, 'routes', `${route}.js`);
  if (fs.existsSync(routePath)) {
    console.log(`${route} route file found`);
    const router = require(routePath);
    app.use(`/api/${route}`, router);
  } else {
    console.error(`${route} route file not found`);
  }
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

module.exports = { app, io };
