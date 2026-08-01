import mongo from "../../database/mongo";
import GenericError from "../../errors/genericError";

const membersRepositoryUpdateMalTokens = async (_id: string, tokens: any) => {
    try {
        await mongo.users.updateOne(
            { 
                _id: _id as any
            },
            { 
                $set: {
                    'mal.auth.access_token': tokens.access_token,
                    'mal.auth.refresh_token': tokens.refresh_token
                } 
            }
        );
    } catch (error) {
        console.error(error);
        if (error instanceof GenericError) throw error;
        else throw new GenericError();
    };
};

export default membersRepositoryUpdateMalTokens;