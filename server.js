const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Configuración de Express
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Base de datos SQLite para persistencia de mensajes
const db = new Database('database.db');

// Crear tabla de mensajes si no existe
db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    message TEXT NOT NULL,
    room TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Insertar sala por defecto si no existe
const insertDefaultRoom = db.prepare('INSERT OR IGNORE INTO rooms (name) VALUES (?)');
insertDefaultRoom.run('general');

// Preparar statements para consultas
const insertMessage = db.prepare('INSERT INTO messages (username, message, room) VALUES (?, ?, ?)');
const getMessages = db.prepare('SELECT * FROM messages WHERE room = ? ORDER BY timestamp DESC LIMIT 50');

// Almacenar usuarios conectados por sala
const usersInRooms = new Map();

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API: Obtener mensajes de una sala
app.get('/api/messages/:room', (req, res) => {
  const room = req.params.room || 'general';
  const messages = getMessages.all(room).reverse();
  res.json(messages);
});

// API: Obtener todas las salas
app.get('/api/rooms', (req, res) => {
  const rooms = db.prepare('SELECT name FROM rooms').all();
  res.json(rooms.map(r => r.name));
});

// WebSocket: Manejo de conexiones
io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  // Cuando un usuario se une a una sala
  socket.on('join-room', ({ username, room }) => {
    // Guardar username y room en el socket
    socket.username = username;
    socket.currentRoom = room;
    
    socket.join(room);
    
    // Agregar usuario a la sala
    if (!usersInRooms.has(room)) {
      usersInRooms.set(room, new Set());
    }
    usersInRooms.get(room).add(username);
    
    // Notificar a otros usuarios
    socket.to(room).emit('user-joined', { username, users: Array.from(usersInRooms.get(room)) });
    
    // Enviar mensajes anteriores al usuario
    const messages = getMessages.all(room).reverse();
    socket.emit('previous-messages', messages);
    
    // Enviar lista de usuarios en la sala
    socket.emit('users-in-room', Array.from(usersInRooms.get(room)));
    
    console.log(`${username} se unió a la sala: ${room}`);
  });

  // Cuando un usuario envía un mensaje
  socket.on('send-message', ({ username, message, room }) => {
    if (!username || !message || !room) return;
    
    const timestamp = new Date().toISOString();
    
    // Guardar mensaje en la base de datos
    insertMessage.run(username, message, room);
    
    // Enviar mensaje a todos en la sala
    io.to(room).emit('receive-message', {
      username,
      message,
      room,
      timestamp
    });
    
    console.log(`[${room}] ${username}: ${message}`);
  });

  // Cuando un usuario se desconecta
  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
    
    // Remover usuario de todas las salas si tiene username
    if (socket.username) {
      usersInRooms.forEach((users, room) => {
        if (users.has(socket.username)) {
          users.delete(socket.username);
          socket.to(room).emit('user-left', {
            username: socket.username,
            users: Array.from(users)
          });
        }
      });
    }
  });

  // Cuando un usuario está escribiendo
  socket.on('typing', ({ username, room, isTyping }) => {
    socket.to(room).emit('user-typing', { username, isTyping });
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Listo para recibir conexiones de chat`);
});

