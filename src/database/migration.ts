import mongo from "./mongo";

export default {
    execute: async () => {
        console.log('Executing migration...');
        try {
            const members = mongo.collection('members');

            await members.updateMany(
                {
                    gacha: { $exists: false }
                },
                {
                    $set: {
                        gacha: {
                            pulls: 20,
                            claims: 2
                        }
                    }
                }
            );
        } catch (error) {
            console.error(error);  
        };
        console.log('Migration finished.');
    }
};