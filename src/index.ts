import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import express from 'express';
import { INVITE_URL, PORT, TOKEN } from "./consts";
import Bot from './extensions/bot';
import postgres from './database/postgres';

const client = new Bot();
postgres.init();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath)
        .filter(file => file.endsWith('.js') || file.endsWith('.ts'));
    
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            console.log(command.data.name, 'loaded');
        } else {
            console.log(`🟧 | The command at ${filePath} is missing a required "data" or "execute" property.`);
        };
    };
};

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js') || file.endsWith('.ts'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);

    event.once ?
        client.once(event.name, (...args) => event.execute(...args)) :
        client.on(event.name, (...args) => event.execute(...args));

    console.log(event.name, 'loaded');
};

client.login(TOKEN);

const app = express();

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/invite', (_, res) => {
    res.redirect(INVITE_URL);
});

app.listen(PORT);