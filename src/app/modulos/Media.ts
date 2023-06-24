import { response } from "express";
import { Obra } from "../objetos/Obra";
import { Fetch } from "./Fetch";

class Media {
    public static BuscarMedia = async (tipo: string, args: string) => {
        if (isNaN(+args) || isNaN(parseFloat(args))) {
            const media = await Media.BuscarMediaNombre(tipo, args);
            return media == null ? null : new Obra(media);
        } else {
            const media = await Media.BuscarMediaID(tipo, args);
            return media == null ? null : new Obra(media);
        }
    }
    
    private static async BuscarMediaNombre(tipo: string, args: string): Promise<any> {
        const variables = {
            search: args,
            type: tipo.toUpperCase(),
            page: 1,
            perPage: 1
        };
    
        const response = await Fetch.request(queryName, variables);

        return (response == null || response.Page == null || response.Page.media == null || response.Page.media[0] == null) ? 
            null : response.Page.media[0];
    }

    private static async BuscarMediaID(tipo: string, id: string): Promise<any> {
        const variables = {
            id: parseInt(id),
            type: tipo.toUpperCase()
        };
    
        const response = await Fetch.request(queryID, variables);

        return (response == null || response.Media == null) ? null : response.Media;
    }

    public static BuscarMediaPorTemporada = async (seasonYear: number, season: string) => {
        const variables = {
            seasonYear,
            season,
            page: 1,
            perPage: 100
        }

        const response: any = await Fetch.request(querySeason, variables);

        return (response == null || response.Page == null || response.Page.media == null || response.Page.media[0] == null) ?
            null :
            response.Page.media;
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

const querySeason = `
    query ($page: Int, $perPage: Int, $seasonYear: Int, $season: MediaSeason) {
        Page (page: $page, perPage: $perPage) {
            pageInfo {
                total
                currentPage
                lastPage
                hasNextPage
                perPage
            }
            media (seasonYear: $seasonYear, season: $season, type: ANIME) {
                id
                idMal
                title {
                    english
                    romaji
                    native
                }
                season
                seasonYear
            }
        }
    }   
`;