import anilist from "../anilist";

const ANILIST_GET_CHARACTER_NAME = async (name: string) => {
    const query = `
        query  {
            Page (perPage: 5) {
                characters (search: "${name}") {
                id
                name {
                    full
                    userPreferred
                }
                siteUrl
                age
                bloodType
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
        }
    `;

    const data = await anilist.request(query);
    return data.Page.characters;
};

export default ANILIST_GET_CHARACTER_NAME;