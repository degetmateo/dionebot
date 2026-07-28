import * as uuid from 'uuid';
import mongo from "../../database/mongo";
import { UUID } from 'mongodb';

const guildsRepositoryFindsert = async (id: string) => {
    const guilds = mongo.collection('guilds');
    
    let guild = await guilds.findOne({ discord_id: id });

    if (!guild) {
        guild = {
            _id: new UUID(uuid.v7()) as any,
            discord_id: id,
            claimed_characters: []
        };

        await guilds.insertOne(guild);
    };

    return guild;
};

export default guildsRepositoryFindsert;