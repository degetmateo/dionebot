import { Events } from "discord.js";
import Aniuser from "../../database/modelos/Aniuser";
import Bot from "../Bot";
import ServerModel from "../../database/modelos/ServerModel";

module.exports = (bot: Bot) => {
    bot.on(Events.GuildMemberRemove, async (member) => {
        try {
            await ServerModel.updateOne(
                { id: member.guild.id },
                { $pull: { users: { discordId: member.id } } });

            await bot.loadServers();
        } catch (error) {
            console.error(error);
        }
    })
}