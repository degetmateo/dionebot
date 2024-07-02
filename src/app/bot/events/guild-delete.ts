import { Events } from "discord.js";
import Bot from "../Bot";
import Postgres from "../../database/postgres";

module.exports = (bot: Bot) => {
    bot.on(Events.GuildDelete, async server => {
        try {
            await Postgres.query().begin(async sql => {
                await sql `
                    DELETE FROM
                        discord_user
                    WHERE
                        id_server = ${server.id};
                `;

                await sql `
                    DELETE FROM
                        discord_server
                    WHERE
                        id_server = ${server.id};
                `;
            });
        } catch (error) {
            console.error(error)
        }
    })
}