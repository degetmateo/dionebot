import { BOT } from "../objects/Bot";
import { AniUser } from "../models/AniUser";

async function BuscarUsuario(bot: BOT, args: string): Promise<any> {
    if (isNaN(parseInt(args))) {
        const variables = {
            name: args
        };

        const data = await bot.request(queryUsername, variables);
        
        return (data == null || data.User == null) ? null : data.User;
    } else {
        const user = await AniUser.findOne({ discordId: args });

        if (!user) return null;

        const variables = {
            name: user?.anilistUsername
        }

        const data = await bot.request(queryUsername, variables);
        
        return (data == null || data.User == null) ? null : data.User;
    }
}

const queryUsername = `
    query ($name: String) {
        User(name: $name) {
            name
            id
            about
            avatar {
                large
                medium
            }
            bannerImage
            options {
                profileColor
            }
            statistics {
                anime {
                    count
                    meanScore
                    standardDeviation
                    minutesWatched
                    episodesWatched
                    formats {
                        count
                        format
                    }
                    statuses {
                        count
                        status
                    }
                    releaseYears {
                        count
                        releaseYear
                    }
                    startYears {
                        count
                        startYear
                    }
                    genres {
                        count
                        genre
                        meanScore
                        minutesWatched
                    }
                }
                manga {
                    count
                    meanScore
                    standardDeviation
                    chaptersRead
                    volumesRead
                    statuses {
                        count
                        status
                    }
                    releaseYears {
                        count
                        releaseYear
                    }
                    startYears {
                        count
                        startYear
                    }
                    genres {
                        count
                        genre
                        meanScore
                        chaptersRead
                    }
                }
            }
            siteUrl
            updatedAt
        }
    }
`;

export { BuscarUsuario };