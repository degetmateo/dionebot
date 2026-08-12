import { Events, Guild } from "discord.js";
import mongo from "../database/mongo";

module.exports = {
    name: Events.GuildCreate,
    once: false,
    execute: async (guild: Guild) => {
        try {
            await mongo.guilds.insertOne({
                _id: guild.id as any,
                affinities: []
            });
        } catch (error) {
            console.error(error);
        };
    }
};