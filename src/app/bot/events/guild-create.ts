import ServerModel from "../../database/modelos/ServerModel";
import Bot from "../Bot";

module.exports = (bot: Bot) => {
    bot.on('guildCreate', async server => {
        try {
            const newServer = new ServerModel({
                id: server.id,
                premium: false,
                users: []
            })

            await newServer.save();
        } catch (error) {
            console.error(error)
        }
    })
}