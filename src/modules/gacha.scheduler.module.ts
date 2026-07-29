import cron from 'node-cron';
import mongo from '../database/mongo';

const SCHEDULE_PULLS_RESET = async () => {
    cron.schedule('0 * * * *', async () => {
        console.log('EJECUTANDO RESET PULLS');
        const members = mongo.collection('members');

        try {
            await members.updateMany(
                {
                    "gacha.pulls": { $lt: 20 }
                },
                {
                    $set: {
                        "gacha.pulls": 20
                    }
                }
            );

            await members.updateMany(
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