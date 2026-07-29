import mongo from "../../database/mongo";
import { memberModel } from '../../database/models/member.model';
import { Document, WithId } from "mongodb";

const membersRepositoryFindsert = async (user_id: string, guild_id: string) => {
    try {
        const members = mongo.collection('members');
        let member = await members.findOne({ discord_id: user_id });

        if (!member) {
            member = memberModel.create(user_id, guild_id) as WithId<Document>;
            await members.insertOne(member);
        };
        
        return member as WithId<Document>;
    } catch (error) {
        console.error(error);  
    };
};

export default membersRepositoryFindsert;