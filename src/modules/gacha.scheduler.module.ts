import cron from 'node-cron';
import mongo from '../database/mongo';
import Bot from '../extensions/bot.extension';
import { MessageFlags, TextDisplayBuilder } from 'discord.js';

const SCHEDULE_PULLS_RESET = async (bot: Bot) => {
    cron.schedule('0 * * * *', async () => {
        console.log('EJECUTANDO RESET PULLS');

        try {
            await mongo.users.updateMany(
                {
                    "gacha.pulls": { $lt: 15 }
                },
                {
                    $set: {
                        "gacha.pulls": 15
                    }
                }
            );

            await mongo.users.updateMany(
                {
                    "gacha.claims": { $lt: 2 }
                },
                {
                    $set: {
                        "gacha.claims": 2
                    }
                }
            );

            const pulls = await mongo.users.find(
                {
                    "gacha.last_channel_id": { $ne: null, $exists: true },
                    "gacha.last_guild_id": { $ne: null, $exists: true }
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

            console.log(`✅ Actualización completada.`);
        } catch (error) {
            console.error('❌ Error en el cron job horario:', error);
        };
    },
    {
        timezone: "America/Argentina/Buenos_Aires"
    });
};

const GachaSchedulerModule = {
    SCHEDULE_PULLS_RESET
};

export default GachaSchedulerModule;