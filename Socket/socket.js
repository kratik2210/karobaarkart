// socket.js
const socketIO = require('socket.io');
const cors = require('cors'); // Import the 'cors' package

let io;

function initializeSocket(server) {
    io = socketIO(server, {
        cors: {
            origin: 'https://karobaarkart.com', // Replace with the URL of your client-side application
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type'],
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
}

function getIO() {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
}

module.exports = {
    initializeSocket,
    getIO
};
