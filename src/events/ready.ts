import { Events } from 'discord.js';
import Bot from '../extensions/bot';

module.exports = {
	name: Events.ClientReady,
	once: true,
    execute: (client: Bot) => {
        console.log(`✅ Logged in as ${client.user.tag}`);
    }
};