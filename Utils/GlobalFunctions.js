// Imports
const JWT = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const env = require('dotenv');
const Logger = require('./logger/log.config')
const { API_RESP_CODES } = require('./common/error-codes')
const { JWT_EXPIRY_IN_HOURS, JWT_REFRESH_EXPIRY_IN_HOURS } = require('../Utils/common/constants')
// Config
env.config();

// JWT token generate
exports.generateToken = function (payload) {
   return JWT.sign(payload, process.env.JWT_SECRETKEY, { expiresIn: JWT_EXPIRY_IN_HOURS + 'd' });
}
exports.generateRefreshToken = function (payload) {
   return JWT.sign(payload, process.env.JWT_SECRETKEY, { expiresIn: JWT_REFRESH_EXPIRY_IN_HOURS + 'd' });
}

// Password encrypt
exports.passwordEncrypt = function (payload) {
   const salt = 10;
   return bcrypt.hashSync(payload, salt);
}

// Password decrypt
exports.passwordDecrypt = function (hashPassword, password) {
   return bcrypt.compareSync(password, hashPassword);
}

// Authentication Middleware
exports.authMiddleware = function (req, res, next) {
   try {
      const token = req.headers.authorization;
      if (!token) {
         res.status(403).json({ success: false, message: 'Token is not send ' })
      }
      const isAuth = token.split(" ")[1];
      JWT.verify(isAuth, process.env.JWT_SECRETKEY, function (error, decoded) {
         if (error) {
            Logger.error(` ${new Date()} "authMiddleware":${error}`);
            res.status(400).send({
               success: false,
               message: 'JWT has expired',
               data: null,
            });
         } else {
            req.user = decoded;
            next();
         }
      })

   } catch (err) {
      //  res.status(404).json({Message:'Authentication required.'})
      Logger.error(` ${new Date()} "authMiddleware":${err}`);
      res.status(API_RESP_CODES.AUTHENTICATION_REQUIRED.status).send({
         status: API_RESP_CODES.AUTHENTICATION_REQUIRED.status,
         message: API_RESP_CODES.AUTHENTICATION_REQUIRED.message,
         data: { error: err },
      });
   }
}

exports.asyncMiddlewareController = function (handler) {
   return async (req, res) => {
      try {
         await handler(req, res);
      } catch (err) {
         Logger.error(` ${new Date()} "asyncMiddlewareController":${err}`);
         res.status(API_RESP_CODES.HTTP_SERVER_ERR.status).send({
            status: API_RESP_CODES.HTTP_SERVER_ERR.status,
            message: API_RESP_CODES.HTTP_SERVER_ERR.message,
            data: { error: err },
         });
      }
   };
}