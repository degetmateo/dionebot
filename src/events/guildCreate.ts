import { Events, Guild } from "discord.js";
import postgres from "../database/postgres";

module.exports = {
    name: Events.GuildCreate,
    once: false,
    execute: async (guild: Guild) => {
        try {
            await postgres.sql().begin(async transaction => {
                const qGuild = (await transaction`
                    SELECT * FROM 
                        guild
                    WHERE
                        discord_id = ${guild.id};
                `)[0];

                if (!qGuild) {
                    (await transaction`
                        INSERT INTO
                            guild (
                                discord_id
                            )
                            VALUES (
                                ${guild.id}
                            );
                    `);
                };
            });
        } catch (error) {
            console.error(error);
        };
    }
};