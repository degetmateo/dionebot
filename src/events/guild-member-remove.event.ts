import { Events, GuildMember } from "discord.js";
import mongo from "../database/mongo";

module.exports = {
    name: Events.GuildMemberRemove,
    once: false,
    execute: async (member: GuildMember) => {
        try {        
            await mongo.claims.deleteMany({ guild_id: member.guild.id, user_id: member.id });
            await mongo.memberships.deleteOne({ _id: `${member.guild.id}_${member.id}` as any });
        } catch (error) {
            console.error(error);  
        };
    }
};