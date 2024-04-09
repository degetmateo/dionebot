import { Events } from "discord.js";
import ServerModel from "../../database/modelos/ServerModel";
import Bot from "../Bot";

module.exports = (bot: Bot) => {
    bot.on(Events.GuildDelete, async server => {
        try {
            await ServerModel.findOneAndDelete({ id: server.id });
            await bot.loadServers();
        } catch (error) {
            console.error(error)
        }
    })
}