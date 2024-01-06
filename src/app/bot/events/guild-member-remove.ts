import Aniuser from "../../database/modelos/Aniuser";
import Bot from "../Bot";

module.exports = (bot: Bot) => {
    bot.on('guildMemberRemove', async (member) => {
        try {
            await Aniuser.findOneAndDelete({ serverId: member.guild.id, discordId: member.id })
            await bot.loadServers();
        } catch (error) {
            console.error(error);
        }
    })
}