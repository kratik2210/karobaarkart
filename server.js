// Imports
const express = require('express');
const app = express();
const cors = require('cors');
const env = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
const logger = require('./Utils/logger/log.config');
const Redis = require('redis')
const helmet = require('helmet')
const http = require('http');
const redisClient = Redis.createClient()
const { initializeSocket } = require('./Sockets/socket');

const server = http.createServer(app);


// Configs
env.config();

// Middlewares
app.use(express.json());
app.use(helmet())
app.use(cors());
app.use(morgan('dev'));

// DB connectivity
mongoose.connect(process.env.MONGOURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  initializeSocket(server);

  logger.info('DB connected successfully...');
}).catch((err) => {
  logger.error('DB connected with some issues..');
})




// Api
const accountRouter = require('./Routers/accountRouter');
const userRouter = require('./Routers/userRouter');
const adminRouter = require('./Routers/adminRouter');
const vehicleRouter = require('./Routers/vehicleRouter');
const wishlistRouter = require('./Routers/wishlistInquiryRouter');
const searchRouter = require('./Routers/searchRouter');
const auctionRouter = require('./Routers/auctionRouter');

app.use('/api', accountRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/vehicle', vehicleRouter);
app.use('/vehicle', wishlistRouter);
app.use('/search', searchRouter);
app.use('/auction', auctionRouter);



// Server listen port
server.listen(process.env.PORT, (() => {
  logger.info(`Server connected with port : ${process.env.PORT}`);
}));

