import postgres from "postgres";
import { POSTGRES_DB_NAME, POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_URL, POSTGRES_USERNAME } from "../consts";

class Postgres {
    public database: postgres.Sql<{}> | null;

    constructor () {
        this.database = null;
    };

    init () {
        try {
            this.database = postgres({
                host: POSTGRES_URL,
                port: POSTGRES_PORT,
                database: POSTGRES_DB_NAME,
                username: POSTGRES_USERNAME,
                password: POSTGRES_PASSWORD,
                ssl: 'require'
            });
        } catch (error) {
            console.error(error);
        };
    };

    sql () {
        if (!this.database) throw new Error('Database is not connected.');
        return this.database;
    };
};

export default new Postgres();