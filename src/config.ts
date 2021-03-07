import { config } from 'dotenv';
config();

let configuration: any;

switch (process.env.NODE_ENV) {
  case 'test':
    configuration = {
      HOST: process.env.HOST,
      PORT: process.env.PORT,
      LOG_LEVEL: process.env.LOG_LEVEL,
      db: {
        type: process.env.DB_TYPE,
        host: process.env.DB_HOST_TEST,
        port: process.env.DB_PORT_TEST,
        username: process.env.DB_USERNAME_TEST,
        password: process.env.DB_PASSWORD_TEST,
        database: process.env.DB_NAME_TEST,
        synchronize: (process.env.DB_SYNC === 'true'),
        logging: (process.env.DB_LOG === 'true'),
        entities: ['dist/**/*.entity.js'],
      },
    };
    break;
  case 'production':
    configuration = {
      HOST: process.env.HOST,
      PORT: process.env.PORT,
      LOG_LEVEL: process.env.LOG_LEVEL,
      db: {
        type: process.env.DB_TYPE,
        host: process.env.DB_HOST_PROD,
        port: process.env.DB_PORT_PROD,
        username: process.env.DB_USERNAME_PROD,
        password: process.env.DB_PASSWORD_PROD,
        database: process.env.DB_NAME_PROD,
        synchronize: (process.env.DB_SYNC === 'true'),
        logging: (process.env.DB_LOG === 'true'),
        entities: ['dist/**/*.entity.js'],
      },
    };
    break;
  default:
    configuration = {
      HOST: process.env.HOST,
      PORT: process.env.PORT,
      LOG_LEVEL: process.env.LOG_LEVEL,
      db: {
        type: process.env.DB_TYPE,
        host: process.env.DB_HOST_DEV,
        port: process.env.DB_PORT_DEV,
        username: process.env.DB_USERNAME_DEV,
        password: process.env.DB_PASSWORD_DEV,
        database: process.env.DB_NAME_DEV,
        synchronize: (process.env.DB_SYNC === 'true'),
        logging: (process.env.DB_LOG === 'true'),
        entities: ['dist/**/*.entity.js'],
      },
    };
    break;
}

export default configuration;
