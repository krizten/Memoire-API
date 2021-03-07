import { Connection } from 'typeorm';
import { LogoutTokenEntity } from './logout-token.entity';

export const logoutTokenProviders = [
    {
        provide: 'LOGOUT_TOKEN_REPOSITORY',
        useFactory: (connection: Connection) => connection.getRepository(LogoutTokenEntity),
        inject: ['DATABASE_CONNECTION']
    }
]