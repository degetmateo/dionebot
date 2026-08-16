import { Channel, MessageFlags, TextDisplayBuilder } from "discord.js";
import Bot from "../extensions/bot.extension";
import mongo from "../database/mongo";

export const notifyUsers = async (bot: Bot) => {
    try {
        const pulls = await mongo.users.find(
            {
                "gacha.last_channel_id": { $ne: null, $exists: true }
            }
        ).toArray();

        mongo.users.updateMany(
            {
                _id: {
                    $in: pulls.map(p => p._id)
                }
            },
            {
                $set: {
                    "gacha.last_channel_id": null
                }
            }
        );

        const channels = new Map<string, Channel>();

        for (const pullUser of pulls) {
            const cId: string | null = pullUser.gacha.last_channel_id;
            
            if (cId) {
                if (!channels.has(cId)) {
                    const channel = await bot.channels.fetch(pullUser.gacha.last_channel_id);
                    if (channel) channels.set(cId, channel);
                };
            };
        };

        for (const pullUser of pulls) {
            const cId = pullUser.gacha.last_channel_id;
            if (!cId) continue;

            const channel = channels.get(cId);
            if (!channel) continue;

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