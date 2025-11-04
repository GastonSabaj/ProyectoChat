// Conectar al servidor Socket.IO
const socket = io();

// Variables globales
let currentUsername = '';
let currentRoom = 'general';
let typingTimeout = null;
let isTyping = false;

// Elementos del DOM
const loginPanel = document.getElementById('login-panel');
const chatPanel = document.getElementById('chat-panel');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username-input');
const roomSelect = document.getElementById('room-select');
const roomSwitch = document.getElementById('room-switch');
const logoutBtn = document.getElementById('logout-btn');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messagesContainer = document.getElementById('messages-container');
const typingIndicator = document.getElementById('typing-indicator');
const typingText = document.getElementById('typing-text');
const roomName = document.getElementById('room-name');
const userCount = document.getElementById('user-count');

// Cargar salas disponibles al iniciar
async function loadRooms() {
    try {
        const response = await fetch('/api/rooms');
        const rooms = await response.json();
        
        roomSelect.innerHTML = '';
        roomSwitch.innerHTML = '';
        
        rooms.forEach(room => {
            const option1 = document.createElement('option');
            option1.value = room;
            option1.textContent = room === 'general' ? 'Sala General' : room;
            roomSelect.appendChild(option1);
            
            const option2 = document.createElement('option');
            option2.value = room;
            option2.textContent = room === 'general' ? 'Sala General' : room;
            roomSwitch.appendChild(option2);
        });
    } catch (error) {
        console.error('Error cargando salas:', error);
    }
}

// Manejar login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const room = roomSelect.value || 'general';
    
    if (username) {
        currentUsername = username;
        currentRoom = room;
        
        // Conectar a la sala
        socket.emit('join-room', { username, room });
        
        // Cambiar a la vista de chat
        loginPanel.classList.add('hidden');
        chatPanel.classList.remove('hidden');
        
        // Actualizar nombre de sala
        roomName.textContent = room === 'general' ? 'Sala General' : room;
        roomSwitch.value = room;
        
        // Enfocar el input de mensajes
        messageInput.focus();
    }
});

// Manejar cambio de sala
roomSwitch.addEventListener('change', (e) => {
    const newRoom = e.target.value;
    if (newRoom !== currentRoom && currentUsername) {
        // Salir de la sala actual
        socket.emit('leave-room', { room: currentRoom });
        
        // Unirse a la nueva sala
        currentRoom = newRoom;
        socket.emit('join-room', { username: currentUsername, room: newRoom });
        
        // Limpiar mensajes
        messagesContainer.innerHTML = '';
        
        // Actualizar nombre de sala
        roomName.textContent = newRoom === 'general' ? 'Sala General' : newRoom;
    }
});

// Manejar logout
logoutBtn.addEventListener('click', () => {
    logout();
});

function logout() {
    currentUsername = '';
    currentRoom = 'general';
    messagesContainer.innerHTML = '';
    usernameInput.value = '';
    messageInput.value = '';
    
    chatPanel.classList.add('hidden');
    loginPanel.classList.remove('hidden');
    
    socket.disconnect();
    socket.connect();
}

// Enviar mensaje
messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    
    if (message && currentUsername) {
        socket.emit('send-message', {
            username: currentUsername,
            message: message,
            room: currentRoom
        });
        
        messageInput.value = '';
        stopTyping();
    }
});

// Detectar cuando el usuario está escribiendo
messageInput.addEventListener('input', () => {
    if (!isTyping && currentUsername) {
        isTyping = true;
        socket.emit('typing', {
            username: currentUsername,
            room: currentRoom,
            isTyping: true
        });
    }
    
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        stopTyping();
    }, 1000);
});

function stopTyping() {
    if (isTyping && currentUsername) {
        isTyping = false;
        socket.emit('typing', {
            username: currentUsername,
            room: currentRoom,
            isTyping: false
        });
    }
}

// Recibir mensajes anteriores
socket.on('previous-messages', (messages) => {
    messages.forEach(msg => {
        displayMessage(msg);
    });
    scrollToBottom();
});

// Recibir nuevo mensaje
socket.on('receive-message', (data) => {
    displayMessage(data);
    scrollToBottom();
});

// Mostrar mensaje en la interfaz
function displayMessage(data) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${data.username === currentUsername ? 'own-message' : ''}`;
    
    const messageHeader = document.createElement('div');
    messageHeader.className = 'message-header';
    
    const usernameSpan = document.createElement('span');
    usernameSpan.className = 'message-username';
    usernameSpan.textContent = data.username;
    
    const timeSpan = document.createElement('span');
    timeSpan.className = 'message-time';
    const date = new Date(data.timestamp);
    timeSpan.textContent = date.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    messageHeader.appendChild(usernameSpan);
    messageHeader.appendChild(timeSpan);
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = data.message;
    
    messageDiv.appendChild(messageHeader);
    messageDiv.appendChild(messageContent);
    
    messagesContainer.appendChild(messageDiv);
}

// Usuario escribiendo
socket.on('user-typing', (data) => {
    if (data.username !== currentUsername) {
        if (data.isTyping) {
            typingText.textContent = `${data.username} está escribiendo...`;
            typingIndicator.classList.remove('hidden');
        } else {
            typingIndicator.classList.add('hidden');
        }
    }
});

// Usuario se unió
socket.on('user-joined', (data) => {
    if (data.username !== currentUsername) {
        addSystemMessage(`${data.username} se unió al chat`);
        updateUserCount(data.users.length);
    }
});

// Usuario se fue
socket.on('user-left', (data) => {
    if (data.username !== currentUsername) {
        addSystemMessage(`${data.username} salió del chat`);
        updateUserCount(data.users.length);
    }
});

// Usuarios en la sala
socket.on('users-in-room', (users) => {
    updateUserCount(users.length);
});

function updateUserCount(count) {
    userCount.textContent = `${count} ${count === 1 ? 'usuario' : 'usuarios'}`;
}

function addSystemMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message system-message';
    messageDiv.style.textAlign = 'center';
    messageDiv.style.maxWidth = '100%';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.style.background = '#e3f2fd';
    messageContent.style.fontSize = '0.9rem';
    messageContent.style.color = '#666';
    messageContent.textContent = text;
    
    messageDiv.appendChild(messageContent);
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Enter para enviar, Shift+Enter para nueva línea
messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        messageForm.dispatchEvent(new Event('submit'));
    }
});

// Cargar salas al iniciar
loadRooms();

