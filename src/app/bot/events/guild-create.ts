import { Events } from "discord.js";
import ServerModel from "../../database/modelos/ServerModel";
import Bot from "../Bot";

module.exports = (bot: Bot) => {
    bot.on(Events.GuildCreate, async server => {
        try {
            const props = {
                id: server.id,
                premium: false,
                users: []
            }

            const newServer = new ServerModel(props)

            await newServer.save();
            bot.servers.add(props);
        } catch (error) {
            console.error(error)
        }
    })
}