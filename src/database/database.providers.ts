import { createConnection } from 'typeorm';
import configuration from 'src/config';

export const databaseProviders = [
    {
        provide: 'DATABASE_CONNECTION',
        useFactory: async () => await createConnection(configuration.db)
    }
]