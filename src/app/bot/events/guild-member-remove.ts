import { Events } from "discord.js";
import Bot from "../Bot";
import Postgres from "../../database/postgres";

module.exports = (bot: Bot) => {
    bot.on(Events.GuildMemberRemove, async (member) => {
        try {
            await Postgres.query().begin(async sql => {
                await sql `
                    DELETE FROM
                        discord_user
                    WHERE
                        id_user = ${member.id} and
                        id_server = ${member.guild.id};
                `;
            });
        } catch (error) {
            console.error(error);
        }
    })
}