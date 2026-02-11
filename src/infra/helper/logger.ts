import winston from 'winston';
import { EEnvironment } from '@config/enums';
import { generalEnv } from '@environment/general';

export const helperLogger = winston.createLogger({
  level: 'info',
  format:
    generalEnv.environment === EEnvironment.DEVELOPMENT
      ? winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }),
          winston.format.printf(({ level, message, timestamp }) => {
            return `[${timestamp}] ${level}: ${message}`;
          }),
        )
      : winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
  transports: [new winston.transports.Console()],
});
