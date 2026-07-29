import { Document, ObjectId, WithId } from "mongodb";
import mongo from "../../database/mongo";

const charactersRepository = {
    random: async () => {
        const characters = mongo.collection('characters');
        const result: any[] = await characters.aggregate([{ $sample: { size: 1 } }]).toArray();
        const character: WithId<Document> = result.length > 0 ? result[0] : null;
        return character;
    },

    increaseClaimCount: async (_id: ObjectId) => {
        const characters = mongo.collection('characters');
        characters.updateOne(
            { 
                _id
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