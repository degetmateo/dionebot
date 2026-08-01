import { Document, ObjectId, WithId } from "mongodb";
import mongo from "../../database/mongo";

const charactersRepository = {
    random: async () => {
        const result: any[] = await mongo.characters.aggregate([{ $sample: { size: 1 } }]).toArray();
        const character: WithId<Document> = result.length > 0 ? result[0] : null;
        return character;
    },

    increaseClaimCount: async (_id: number) => {
        await mongo.characters.updateOne(
            { 
                _id: _id as any
            },
            {
                $inc: {
                    claimed_count: 1
                }
            }
        );
    }
};

export default charactersRepository;