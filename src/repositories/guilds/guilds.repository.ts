import { ObjectId, UUID } from "mongodb";
import guildsRepositoryFindsert from "./guilds.repository.findsert";
import guildsRepositoryUpdateAffinityTop from "./guilds.repository.update.affinityTop";
import mongo from "../../database/mongo";

const guildsRepository = {
    update: {
        affinityTop: guildsRepositoryUpdateAffinityTop
    },
    findsert: guildsRepositoryFindsert,

    getClaim: async (guild_id: string, character_id: ObjectId) => {
        const claim = await mongo.guilds.findOne(
            {
                _id: guild_id as any,
                "claimed_characters.character_id": character_id
            },
            {
                projection: {
                    _id: 0,
                    "claimed_characters.$": 1
                }
            }
        );

        return claim ? claim.claimed_characters[0] : null;
    }
};

export default guildsRepository;