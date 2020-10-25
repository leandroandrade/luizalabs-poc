const { createLogger, format, transports } = require('winston');

const { NODE_ENV } = process.env;

const logger = createLogger({
    level: 'debug',
    format: format.combine(
        format.colorize(),
        format.timestamp({
            format: 'DD-MM-YYYY HH:mm:ss',
        }),
        format.printf(info => {
            const { timestamp, level, code, stack, message } = info;

            const newCode = code ? ` ${code}` : '';
            const newMessage = stack || message;
            return `${timestamp} ${level}${newCode}: ${newMessage}`;
        })
    ),
    transports: [
        new transports.Console({
            silent: NODE_ENV === 'test',
        }),
    ],
});

module.exports = logger;
