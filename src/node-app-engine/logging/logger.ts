import winston from 'winston';
import { Config } from '../constants/config';
import { ExpectedError } from '../util/expected-error';

export const Logger = winston.createLogger({
    exitOnError: false,
    level: Config.log.LEVEL,
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.json()
    ),
    defaultMeta: {
        service: Config.server.Name
    },
    transports: [
        new winston.transports.File({ filename: Config.log.OUTPUT_FILENAME }),
        new winston.transports.Console({format: winston.format.simple()}) // remove for prod
    ]
});

export const logError = (err: any): void => {
    if (err instanceof ExpectedError) {
        Logger.error(err.message);
    }
    else {
        console.error(err);
    }
};