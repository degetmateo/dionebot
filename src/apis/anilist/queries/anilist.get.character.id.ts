import anilist from "../anilist";

const ANILIST_GET_CHARACTER_ID = async (id: string | number) => {
    const query = `
        query  {
            Character (id: ${id}) {
                id
                name {
                    full
                    userPreferred
                }
                siteUrl
                age
                bloodType
                description
                favourites
                gender
                image {
                    large
                    medium
                }
                media {
                    nodes {
                        id
                        favourites
                        siteUrl
                        title {
                            userPreferred
                        }      
                    }
                }
            }
        }
    `;

    const data = await anilist.request(query);
    return data.Character;
};

export default ANILIST_GET_CHARACTER_ID;