import { Events } from "discord.js";
import Bot from "../Bot";
import DB from "../../database/DB";

module.exports = (bot: Bot) => {
    bot.on(Events.GuildCreate, async server => {
        try {
            await DB.createServer(server.id);
            await bot.loadServers();
        } catch (error) {
            console.error(error)
        }
    })
}