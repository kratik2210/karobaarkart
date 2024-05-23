// // socket.js
// const socketIO = require('socket.io');
// const cors = require('cors'); // Import the 'cors' package

// let io;

// function initializeSocket(server) {
//     io = socketIO(server, {
//         cors: {
//             origin: 'https://karobaarkart.com',
//             methods: ['GET', 'POST'],
//             allowedHeaders: ['Content-Type'],
//             credentials: true,
//         },
//     });

//     io.on('connection', (socket) => {
//         console.log('A user connected');

//         socket.on('disconnect', () => {
//             console.log('A user disconnected');
//         });
//     });
// }

// function getIO() {
//     if (!io) {
//         throw new Error('Socket.io not initialized!');
//     }
//     return io;
// }

// module.exports = {
//     initializeSocket,
//     getIO
// };



// const socketIO = require('socket.io');
// const cors = require('cors');
// const { placeBidModel } = require('../Models/auction-model');
// const { authenticateUser } = require('../Utils/GlobalFunctions')

// let io;

// function initializeSocket(server) {
//     io = socketIO(server, {
//         cors: {
//             origin: '*',
//             methods: ['GET', 'POST'],
//             allowedHeaders: ['Content-Type'],
//             credentials: true,
//         },
//     });

//     io.use((socket, next) => {
//         const token = socket.handshake.auth.token;
//         const authenticated = authenticateUser(token);

//         if (authenticated) {
//             socket.userData = authenticated;
//             next();
//         } else {
//             next(new Error('Authentication failed'));
//         }
//     });

//     io.on('connect', (socket) => {
//         console.log('A user connected:',);
//         // console.log('A user connected:', socket.userData.userData._id);

//         socket.on('placeBid', async (bidData, callback) => {
//             console.log("🚀 ~ socket.on ~ bidData:", bidData)
//             try {
//                 const { auctionId, currentBid, userId } = bidData;
//                 // const userId = socket.userData.userId;

//                 // Validate the input
//                 if (!auctionId || !currentBid) {
//                     socket.emit('bidError', { message: 'Invalid bid data' });
//                     return;
//                 }

//                 // Place the bid and update the auction
//                 const result = await placeBidModel(auctionId, userId, currentBid);
//                 console.log("🚀 ~ socket.on ~ result:", result)

//                 if (result.status) {
//                     const { currentBid, highestBidder } = result.data;

//                     // Broadcast the new highest bid and bidder to all connected clients
//                     io.emit('newHighestBid', { auctionId, currentBid, highestBidder });
//                     if (callback) callback({ status: 'success', data: result.data });

//                 } else {

//                     socket.emit('bidError', { message: result.message });
//                     if (callback) callback({ status: 'success', data: result.data });

//                 }
//             } catch (error) {
//                 console.error('Error placing bid:', error);
//                 socket.emit('bidError', { message: 'An error occurred while placing the bid' });
//             }
//         });

//         socket.on('disconnect', () => {
//             console.log('A user disconnected');
//         });
//     });


//     io = io
// }

// function getIO() {
//     if (!io) {
//         throw new Error('Socket.io not initialized!');
//     }
//     return io;
// }

// module.exports = { initializeSocket, getIO };


const socketIO = require('socket.io');
const { authenticateUser } = require('../Utils/GlobalFunctions');
// const { placeBidModel } = require('../Models/auction-model');

let io;

function initializeSocket(server) {
    io = socketIO(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type'],
            credentials: true,
        },
    });

    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        const authenticated = authenticateUser(token);

        if (authenticated) {
            socket.userData = authenticated;
            next();
        } else {
            next(new Error('Authentication failed'));
        }
    });

    io.on('connect', (socket) => {
        console.log('A user connected');



        const auctionId = socket.handshake.query.auctionId;

        // Join the room associated with the auction

        socket.on('joinRoom', (auctionId) => {
            console.log("🚀 ~ socket.on ~ auctionId:", auctionId)
            socket.join(auctionId)
            console.log(`Client joined room: ${auctionId}`);

            socket.emit('message', `Welcome to ${auctionId}`);
        });
        ;

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
    getIO,
};



// socket.on('placeBid', async (bidData, callback) => {
//     console.log("🚀 ~ socket.on ~ bidData:", bidData)
//     try {
//         const { auctionId, currentBid, userId } = bidData;

//         if (!auctionId || !currentBid) {
//             socket.emit('bidError', { message: 'Invalid bid data' });
//             if (callback) callback({ status: 'error', message: 'Invalid bid data' });
//             return;
//         }

//         const result = await placeBidModel(auctionId, userId, currentBid);
//         console.log("🚀 ~ socket.on ~ result:", result)

//         if (result.status) {
//             const { currentBid, highestBidder } = result.data;
//             io.emit('newHighestBid', { auctionId, currentBid, highestBidder });
//             if (callback) callback({ status: 'success', data: result.data });
//         } else {
//             socket.emit('bidError', { message: result.message });
//             if (callback) callback({ status: 'error', message: result.message });
//         }
//     } catch (error) {
//         console.error('Error placing bid:', error);
//         socket.emit('bidError', { message: 'An error occurred while placing the bid' });
//         if (callback) callback({ status: 'error', message: 'An error occurred while placing the bid' });
//     }
// });

