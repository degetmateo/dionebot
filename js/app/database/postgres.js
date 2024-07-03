"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postgres_1 = __importDefault(require("postgres"));
class Postgres {
    static init() {
        try {
            this.db = (0, postgres_1.default)({
                host: process.env.POSTGRES_URL,
                port: parseInt(process.env.POSTGRES_PORT) || 5432,
                database: process.env.POSTGRES_DB_NAME,
                username: process.env.POSTGRES_USERNAME,
                password: process.env.POSTGRES_PASSWORD,
                ssl: 'require'
            });
            console.log('✅ | Base de datos Postgres conectada.');
        }
        catch (error) {
            console.error('🟥 | Error: ', error);
        }
    }
    static query() {
        return this.db;
    }
}
exports.default = Postgres;
