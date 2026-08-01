import { Document, UUID, WithId } from "mongodb";
import * as uuid from 'uuid';
import mongo from "../../database/mongo";

const guildsRepositoryUpdateAffinityTop = async (guild_id: string, affinity: {
    pearson: number;
    pair: { a: { discord_id: string }, b: { discord_id: string } };
}) => {
    try {
        let guild: WithId<Document> | null = await mongo.guilds.findOne({ _id: guild_id as any });

        if (!guild) {
            guild = {
                _id: guild_id as any,
                affinities: []
            };
        };

        if (!guild.affinities) guild.affinities = [];

        let i = 0;
        let found = false;
        while (i < guild.affinities.length) {
            const e = guild.affinities[i];

            const cond = (
                (e.pair.a.discord_id == affinity.pair.a.discord_id) && 
                (e.pair.b.discord_id == affinity.pair.b.discord_id)
            ) || (
                (e.pair.a.discord_id == affinity.pair.b.discord_id) && 
                (e.pair.b.discord_id == affinity.pair.a.discord_id)
            );

            if (cond) {
                guild.affinities[i] = affinity;
                break;
            };

            i++;
        };

        if (!found) {
            guild.affinities.push(affinity);
        };

        await mongo.guilds.updateOne(
            { _id: guild._id },
            { $set: guild },
            { upsert: true }
        );
    } catch (error) {
        console.error(error);
    };
};

export default guildsRepositoryUpdateAffinityTop;