import 'dotenv/config';
import { TOKEN } from "./consts";
import Bot from './extensions/bot';
import postgres from './database/postgres';

const bot = new Bot();
postgres.init();
bot.login(TOKEN);