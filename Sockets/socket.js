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

//olddddddddddddddddddddddddddddddddddddddd

// const socketIO = require('socket.io');
// const { authenticateUser } = require('../Utils/GlobalFunctions');
// // const { placeBidModel } = require('../Models/auction-model');

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
//         console.log('A user connected');



//         const auctionId = socket.handshake.query.auctionId;

//         // Join the room associated with the auction

//         socket.on('joinRoom', (auctionId) => {
//             socket.join(auctionId)
//             console.log(`Client joined room: ${auctionId}`);
//             socket.emit('message', `Welcome to ${auctionId}`);
//         });
//         ;

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
//     getIO,
// };

//olddddddddddddddddddddddddddddddddddddddddddddd

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


const socketIO = require('socket.io');
const logger = require('../Utils/logger/log.config'); // Import your Pino logger
const { authenticateUser } = require('../Utils/GlobalFunctions');
const Auction = require('../Schema/auctionSchema');
const Bid = require('../Schema/bidSchema');
// const { placeBidModel } = require('../Models/auction-model');

let io;
let pingInterval;


function initializeSocket(server) {
    io = socketIO(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
            allowedHeaders: ['Contrsent-Type'],
            credentials: true,
        },
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        randomizationFactor: 0.5
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
        logger.info('A user connected'); // Log user connection
        console.log('A user connected');

        const ping = () => {
            socket.emit('ping');
        };


        // Start sending ping messages to the client at regular intervals
        pingInterval = setInterval(ping, 5000); // Send ping every 5 seconds

        // Handle the pong response from the client
        socket.on('pong', () => {
            logger.info('Received pong from client');
            console.log('Received pong from client');
        });

        const auctionId = socket.handshake.query.auctionId;

        // Join the room associated with the auction
        socket.on('joinRoom', (auctionId) => {
            socket.join(auctionId)
            console.log(`Client joined room: ${auctionId}`);
            logger.info(`Client joined room: ${auctionId}`); // Log room joining
            socket.emit('message', `Welcome to ${auctionId}`);
        });


        socket.on('requestLatestAuctionState', async (auctionId) => {
            try {
                const [oneAuction, allLatestBids] = await Promise.all([
                    Auction.findOne({ _id: auctionId })
                        .populate({
                            path: 'highestBidder',
                            select: 'userName address',
                        })
                        .lean()
                        .exec(),
                    Bid.find({ auctionId })
                        .populate({
                            path: 'bidderId',
                            model: 'User',
                            select: 'userName address',
                        })
                        .sort({ createdAt: -1 })
                        .limit(8)
                        .lean()
                        .exec(),
                ]);

                const highestBidder = {
                    _id: oneAuction.highestBidder._id,
                    userName: oneAuction.highestBidder.userName,
                    address: oneAuction.highestBidder.address,
                };

                const totalBids = await Bid.countDocuments({ auctionId });

                socket.emit('latestAuctionState', {
                    auctionId,
                    currentBid: oneAuction.currentBid,
                    highestBidder,
                    totalBids,
                    sortedBids: allLatestBids,
                });
            } catch (error) {
                logger.error(`Error fetching latest auction state: ${error.message}`);
            }
        });





        socket.on('disconnect', () => {
            logger.info('A user disconnected'); // Log user disconnection
            clearInterval(pingInterval);

        });
    });


    io.on('reconnect', () => {
        logger.info('Reconnected to the server');
        console.log('Reconnected to the server');

        // Restart the ping-pong mechanism when the client reconnects
        pingInterval = setInterval(ping, 5000); // Send ping every 5 seconds
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
