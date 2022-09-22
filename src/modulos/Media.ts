import { BOT } from "../objects/Bot";

class Media {
    public static async BuscarMedia(bot: BOT, tipo: string, args: string): Promise<any> {
        const variables = {
            search: args,
            type: tipo.toUpperCase(),
            page: 1,
            perPage: 1
        };
    
        const response = await bot.request(queryName, variables);
    
        return (response == null || response.Page == null || response.Page.media == null || response.Page.media[0] == null) ? 
            null : response.Page.media[0].id;
    }

    public static async GetDatosMedia(bot: BOT, tipo: string, args: string): Promise<any> {
        const variables = {
            id: parseInt(args),
            type: tipo.toUpperCase()
        };
    
        const response = await bot.request(queryID, variables);

        return (response == null || response.Media == null) ? null : response.Media;
    }
}

export { Media };

const queryName = `
    query ($page: Int, $perPage: Int, $search: String, $type: MediaType) {
        Page (page: $page, perPage: $perPage) {
            pageInfo {
                total
                currentPage
                lastPage
                hasNextPage
                perPage
            }
            media (search: $search, type: $type) {
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
    }
`;

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
            studios {
                nodes {
                    id
                    name
                    siteUrl
                }
            }
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