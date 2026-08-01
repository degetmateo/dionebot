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

    decreasePulls: async (_id: string) => {
        await mongo.users.updateOne(
            {
                _id: _id as any
            },
            {
                $inc: {
                    "gacha.pulls": -1
                }
            }
        );
    },

    decreaseClaims: async (_id: string) => {
        await mongo.users.updateOne(
            {
                _id: _id as any
            },
            {
                $inc: {
                    "gacha.claims": -1
                }
            }
        );
    },

    increaseRenas: async (_id: string, renas: number) => {
        await mongo.users.updateOne(
            {
                _id: _id as any
            },
            {
                $inc: {
                    renas: renas
                }
            }
        );
    },

    increaseClaimCount: async (_id: string) => {
        await mongo.users.updateOne(
            { 
                _id: _id as any
            },
            {
                $inc: {
                    claimed_characters_count: 1
                }
            }
        );
    },

    buyPulls: async (_id: string, pulls: number, price: number) => {
        await mongo.users.updateOne(
            {
                _id: _id as any
            },
            {
                $inc: {
                    renas: -price,
                    "gacha.pulls": pulls
                }
            }
        )
    },

    buyClaims: async (_id: string, claims: number, price: number) => {
        await mongo.users.updateOne(
            {
                _id: _id as any
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