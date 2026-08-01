import { Events, GuildMember } from "discord.js";
import mongo from "../database/mongo";

module.exports = {
    name: Events.GuildMemberRemove,
    once: false,
    execute: async (member: GuildMember) => {
        try {        
            const user = await mongo.users.findOne({ _id: member.id as any });
            if (!user) return;

            const guilds = user.guilds.filter((guild: any) => guild._id != member.guild.id);

            await mongo.users.updateOne(
                { _id: user._id },
                { $set: { guilds } }
            );
        } catch (error) {
            console.error(error);  
        };
    }
};