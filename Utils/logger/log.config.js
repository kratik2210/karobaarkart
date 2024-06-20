const pino = require('pino');
const fs = require('fs');
const { pretty } = require('pino-pretty');

// Define file options for logging
const fileOptions = {
    level: 'info',
    name: 'file.info',
    filename: './logs/success.log',
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 100,
    colorize: true,
};

// Define error file options for logging
const errorFileOptions = {
    level: 'error',
    name: 'file.error',
    filename: './logs/error.log',
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 100,
    colorize: true,
};

const logger = pino({
    level: 'info', // Set log level
    base: null, // Disable default properties
    timestamp: pino.stdTimeFunctions.isoTime, // Use ISO 8601 timestamp
    serializers: {
        err: pino.stdSerializers.err, // Serialize error objects
    },
    colorize: false,
    transport: {
        targets: [
            // Log to console
            { target: 'pino-pretty', options: { translateTime: "sys:dd-mm-yyyy HH:MM:ss" } },
            // Log to success log file
            // { target: 'pino-pretty', options: { translateTime: "sys:dd-mm-yyyy HH:MM:ss", destination: fileOptions.filename, level: fileOptions.level, colorize: false } },
            // Log to error log file
            { target: 'pino-pretty', options: { translateTime: "sys:dd-mm-yyyy HH:MM:ss", destination: errorFileOptions.filename, level: errorFileOptions.level, colorize: false } }
        ]
    }
});

module.exports = logger;
