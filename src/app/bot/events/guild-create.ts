import { Events } from "discord.js";
import Bot from "../Bot";
import Postgres from "../../database/postgres";

module.exports = (bot: Bot) => {
    bot.on(Events.GuildCreate, async server => {
        try {
            await Postgres.query().begin(async sql => {
                await sql `
                    SELECT insert_server (
                        ${server.id}
                    );
                `;
            });
        } catch (error) {
            console.error(error)
        }
    })
}