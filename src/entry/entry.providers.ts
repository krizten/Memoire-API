import { Connection } from 'typeorm';
import { EntryEntity } from './entry.entity';

export const entryProviders = [
    {
        provide: 'ENTRY_REPOSITORY',
        useFactory: (connection: Connection) => connection.getRepository(EntryEntity),
        inject: ['DATABASE_CONNECTION']
    }
]