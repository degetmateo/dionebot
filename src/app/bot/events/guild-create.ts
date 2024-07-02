import { Events } from "discord.js";
import Bot from "../Bot";
import Postgres from "../../database/postgres";

module.exports = (bot: Bot) => {
    bot.on(Events.GuildCreate, async server => {
        try {
            await Postgres.query().begin(async sql => {
                await sql `
                    INSERT INTO
                        discord_server
                    VALUES (
                        ${server.id},
                        0
                    );
                `;
            });
        } catch (error) {
            console.error(error)
        }
    })
}