import { createLogger, transports, format, Logger } from 'winston';
const { combine, timestamp, printf, json } = format;

const logFormat = printf(info => {
  return `${info.timestamp} [${info.level}]: ${info.message}`;
});

export class FileLogger {
  private static logOptions: any = {
    error: {
      level: 'error',
      filename: 'logs/error.log',
      handleExceptions: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: combine(timestamp(), logFormat, json({ space: 2 })),
    },
    combined: {
      level: 'info',
      filename: 'logs/combined.log',
      handleExceptions: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: combine(timestamp(), logFormat, json({ space: 2 })),
    },
  };

  private static logger: Logger = createLogger({
    transports: [
      new transports.File(FileLogger.logOptions.error),
      new transports.File(FileLogger.logOptions.combined),
    ],
    exitOnError: false,
  });

  static log(message: any) {
    FileLogger.logger.log('info', message);
  }

  static error(message: string, trace?: string) {
    FileLogger.logger.error(message);
  }

  static warn(message: string) {
    FileLogger.logger.warn(message);
  }

  static debug(message: string) {
    FileLogger.logger.debug(message);
  }

  static verbose(message: string) {
    FileLogger.logger.verbose(message);
  }
}
