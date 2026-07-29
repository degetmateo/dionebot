import { ObjectId } from "mongodb";
import membersRepositoryFindsert from "./members.repository.findsert";
import membersRepositoryUpdateMalTokens from "./members.repository.update.malTokens";
import mongo from "../../database/mongo";

const membersRepository = {
    findsert: membersRepositoryFindsert,
    update: {
        mal: {
            tokens: membersRepositoryUpdateMalTokens
        }
    },

    decreasePulls: async (_id: ObjectId) => {
        const members = mongo.collection('members');
        await members.updateOne(
            {
                _id
            },
            {
                $inc: {
                    "gacha.pulls": -1
                }
            }
        );
    },

    increaseRenas: async (discord_id: string, renas: number) => {
        const members = mongo.collection('members');
        members.updateOne(
            {
                discord_id: discord_id
            },
            {
                $inc: {
                    renas: renas
                }
            }
        );
    },

    increaseClaimCount: async (_id: ObjectId) => {
        const members = mongo.collection('members');
        await members.updateOne(
            { 
                _id
            },
            {
                $inc: {
                    claimed_characters_count: 1
                }
            }
        );
    },

    buyPulls: async (_id: ObjectId, pulls: number, price: number) => {
        const members = mongo.collection('members');
        await members.updateOne(
            {
                _id
            },
            {
                $inc: {
                    renas: -price,
                    "gacha.pulls": pulls
                }
            }
        )
    },
    buyClaims: async (_id: ObjectId, claims: number, price: number) => {
        const members = mongo.collection('members');
        await members.updateOne(
            {
                _id
            },
            {
                $inc: {
                    renas: -price,
                    "gacha.claims": claims
                }
            }
        )
    }
};

export default membersRepository;