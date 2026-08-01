import mongo from "../../database/mongo";
import { memberModel } from '../../database/models/member.model';
import { Document, WithId } from "mongodb";

const membersRepositoryFindsert = async (user_id: string, guild_id: string) => {
    try {
        let user = await mongo.users.findOne({ _id: user_id as any });

        if (!user) {
            user = memberModel.create(user_id, guild_id) as WithId<Document>;
            await mongo.users.insertOne(user);
        };
        
        return user as WithId<Document>;
    } catch (error) {
        console.error(error);  
    };
};

export default membersRepositoryFindsert;