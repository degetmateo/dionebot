import { BOT } from "../objects/Bot";

async function CargarMedia(bot: BOT, tipo: string, args: string): Promise<any> {
    const variables = {
        id: parseInt(args),
        type: tipo.toUpperCase()
    };

    const response = await bot.request(queryID, variables);

    return (response == null || response.Media == null) ? null : response.Media;
}

const queryID = `
    query ($id: Int, $type: MediaType) { # Define which variables will be used in the query (id)
        Media (id: $id, type: $type) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
            id
            idMal
            title {
                english
                romaji
                native
            }
            type
            format
            status
            description
            season
            seasonYear
            episodes
            duration
            chapters
            volumes
            coverImage {
                extraLarge
            }
            genres
            synonyms
            meanScore
            popularity
            favourites
            siteUrl
        }
    }
`;

export { CargarMedia };