import { MessageFlags, TextDisplayBuilder } from "discord.js";
import Bot from "../extensions/bot.extension";
import mongo from "../database/mongo";

export const notifyUsers = async (bot: Bot) => {
    try {
        const pulls = await mongo.users.find(
            {
                "gacha.last_channel_id": { $ne: null, $exists: true }
            }
        ).toArray();

        for (const pullUser of pulls) {
            const channel = await bot.channels.fetch(pullUser.gacha.last_channel_id);
            
            if (channel) {
                if (channel.isSendable()) {
                    await channel.send({
                        flags: [MessageFlags.IsComponentsV2],
                        components: [
                            new TextDisplayBuilder()
                                .setContent(`💥 <@${pullUser._id}> ¡Se han repuesto las pulls!`)
                        ]
                    });
                };
            };
        };
    } catch (error) {
        console.error(error);  
    };
};