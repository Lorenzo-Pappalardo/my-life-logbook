import { drizzle } from 'drizzle-orm/tursodatabase/database';
import { DB_FILE_NAME } from '../drizzle.config';

export const getDbConnection = () => {
    const db = drizzle({ connection: { path: DB_FILE_NAME } });
    console.log('DB connection established with file:', DB_FILE_NAME);

    return db;
};

export const closeDbConnection = (connection: ReturnType<typeof getDbConnection>) => {
    connection.$client.close();
};
