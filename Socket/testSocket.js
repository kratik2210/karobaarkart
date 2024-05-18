// testSocket.js
const io = require('socket.io-client');
const socket = io('http://localhost:3033'); // Ensure this matches your server's address

socket.on('connect', () => {
    console.log('Successfully connected to the server');

    // Emit test events if needed
    // socket.emit('testEvent', { data: 'test data' });
});

socket.on('disconnect', () => {
    console.log('Disconnected from the server');
});

// Handle other events
// socket.on('eventFromServer', (data) => {
//   console.log('Received eventFromServer:', data);
// });
