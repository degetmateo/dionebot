import { Events } from "discord.js";
import Bot from "../Bot";
import DB from "../../database/DB";

module.exports = (bot: Bot) => {
    bot.on(Events.GuildMemberRemove, async (member) => {
        try {
            await DB.removeUser(member.guild.id, member.id);
            await bot.loadServers();
        } catch (error) {
            console.error(error);
        }
    })
}