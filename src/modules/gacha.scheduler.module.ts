import cron from 'node-cron';
import mongo from '../database/mongo';

const SCHEDULE_PULLS_RESET = async () => {
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