import { ObjectId, UUID } from "mongodb";
import guildsRepositoryFindsert from "./guilds.repository.findsert";
import guildsRepositoryUpdateAffinityTop from "./guilds.repository.update.affinityTop";
import mongo from "../../database/mongo";

const guildsRepository = {
    update: {
        affinityTop: guildsRepositoryUpdateAffinityTop
    },
    findsert: guildsRepositoryFindsert,

    getClaim: async (guild_discord_id: string, character_id: ObjectId) => {
        const guilds = mongo.collection('guilds');
        const claim = await guilds.findOne(
            {
                discord_id: guild_discord_id,
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
    },

    pushClaim: async (_id: ObjectId, claim: { character_id: ObjectId, member_discord_id: string }) => {
        const guilds = mongo.collection('guilds');
        await guilds.updateOne(
            {
                _id: _id
            },
            {
                $push: {
                    claimed_characters: {
                        character_id: claim.character_id,
                        member_discord_id: claim.member_discord_id
                    } as any
                }
            }
        );
    }
};

export default guildsRepository;