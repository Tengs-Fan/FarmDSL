import winston from 'winston';

// Levels of verbosity
// {
//    error: 0,
//    warn: 1,
//    info: 2,
//    http: 3,
//    verbose: 4,
//    debug: 5,
//    silly: 6
// }

// Logger configuration
const consoleTransport = new winston.transports.Console();
const fileTransport = new winston.transports.File({ filename: 'application.log' });
const errorTransport = new winston.transports.File({ filename: 'error.log', level: 'error' });

const logger = winston.createLogger({
    level: 'info', // Default log level
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        fileTransport,
        errorTransport,
    ],
});

// Function to set the logger's verbosity level
export function setLogLevel(level: string) {
    logger.level = level;
}

export function removeConsoleOutput() {
    logger.remove(consoleTransport);
}

// Function to configure logger for REPL mode (console only)
export function addConsoleOutput() {
    logger.add(consoleTransport)
}

// Function to configure logger for file output 
export function configureFileLogging() {
    logger.add(fileTransport);
}


export default logger;

