import anilist from "../apis/anilist/anilist";
import mongo from "../database/mongo";

const updateCharacterHelper = async (_id: number) => {
    try {
        const data = await anilist.get.character.id(_id);
    
        let images = [{ url: data.image.large || data.image.medium }];
    
        mongo.characters.updateOne(
            {
                _id: _id as any
            },
            {
                $set: {
                    updated_at: new Date(),
                    name: data.name.full || data.name.userPreferred,
                    favourites: data.favourites,
                    media: data.media.nodes,
                    images: images
                }
            }
        );
    } catch (error) {
        console.error(error);
    };
};

export default updateCharacterHelper;