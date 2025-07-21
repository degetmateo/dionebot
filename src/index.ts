import 'dotenv/config';
import path from 'path';
import express from 'express';
import { INVITE_URL, PORT, TOKEN } from "./consts";
import Bot from './extensions/bot';
import postgres from './database/postgres';
import CommandsHandler from './handlers/commandsHandler';
import EventsHandler from './handlers/eventsHandler';

const bot = new Bot();
postgres.init();
CommandsHandler.load(bot);
EventsHandler.load(bot);
bot.login(TOKEN);

const app = express();

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/invite', (_, res) => {
    res.redirect(INVITE_URL);
});

app.listen(PORT);