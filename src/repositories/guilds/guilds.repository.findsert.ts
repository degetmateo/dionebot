import mongo from "../../database/mongo";

const guildsRepositoryFindsert = async (_id: string) => {
    let guild = await mongo.guilds.findOne({ _id: _id as any });

    if (!guild) {
        guild = {
            _id: _id as any,
            affinities: []
        };

        await mongo.guilds.insertOne(guild);
    };

    return guild;
};

export default guildsRepositoryFindsert;