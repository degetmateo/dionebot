import { BOT } from "../objects/Bot";

async function BuscarMediaNombre(bot: BOT, tipo: string, args: string): Promise<any> {
    const variables = {
        search: args,
        type: tipo.toUpperCase(),
        page: 1,
        perPage: 1
    };

    const response = await bot.request(queryName, variables);

    return (response == null || response.Page == null || response.Page == null) ? null : response.Page.media[0].id;
}

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

export { BuscarMediaNombre };