import GenericError from "../../../errors/genericError";
import anilist from "../anilist";
import Anianime from "../models/anianime";

const anilistSearchAnimeByName = async (name: string): Promise<Anianime[]> => {
    const query = `
        query  {
            Page (perPage: 3) {
                media (search: "${name}", type: ANIME) {
                    ...media
                }
            }    
        }
        
        fragment media on Media {
            id
            idMal
            title {
                romaji
                english
                native
                userPreferred
            }
            type
            format
            status
            description
            startDate {
                year
                month
                day
            }
            endDate {
                year
                month
                day
            }
            season
            episodes
            duration
            chapters
            volumes
            source
            trailer {
                id
                site
                thumbnail
            }
            updatedAt
            coverImage {
                extraLarge
                large
                medium
                color
            }
            tags {
                name
                isMediaSpoiler
            }
            bannerImage
            genres
            synonyms
            averageScore
            meanScore
            popularity
            favourites
            studios {
                edges {
                    node {
                        id
                        name
                    }
                }
            }
            siteUrl
        }
    `;

    const data = await anilist.request(query);

    const page = data.Page;
    if (!page) throw new GenericError('¡No encontramos resultados!');

    const media = page.media;
    if (!media || media.length <= 0) throw new GenericError('¡No encontramos resultados!');

    return data.Page.media.map((p: any) => new Anianime(p));
};

export default anilistSearchAnimeByName;