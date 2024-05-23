const socketIOClient = require('socket.io-client');

const socketUrl = 'http://localhost:3033'; // Change the URL to match your backend server
const auctionId = '664abea4977f5b420410c248'; // Replace with a valid auction ID

// Connect to the socket server
const clientSocket = socketIOClient(socketUrl, {
    query: {
        auctionId: auctionId
    }
});

// Handle events from the server
clientSocket.on('connect', () => {
    console.log('Connected to server');
});

clientSocket.on('message', (message) => {
    console.log('Received message:', message);
});

clientSocket.on('newHighestBid', (data) => {
    console.log('New highest bid:', data);
});

clientSocket.on('bidError', (error) => {
    console.error('Bid error:', error);
});

// Send a request to join the auction room
clientSocket.emit('joinRoom', auctionId);
