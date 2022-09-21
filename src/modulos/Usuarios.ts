import { BOT } from "../objects/Bot";
import { AniUser } from "../models/AniUser";
import { Obra } from "../objects/Obra";

class Usuarios {
    public static async BuscarUsuario(bot: BOT, serverID: string, args: string): Promise<any> {
        if (isNaN(parseInt(args))) {
            const variables = {
                name: args
            };
    
            const data = await bot.request(queryUsername, variables);
            
            return (data == null || data.User == null) ? null : data.User;
        } else {
            const user = await AniUser.findOne({ serverId: serverID, discordId: args });
    
            if (!user) return null;
    
            const variables = {
                name: user.anilistUsername
            }
    
            const data = await bot.request(queryUsername, variables);
            
            return (data == null || data.User == null) ? null : data.User;
        }
    }

    public static async GetUsuariosMedia(bot: BOT, serverID: any, media: Obra): Promise<any> {
        const uRegistrados = await AniUser.find({ serverId: serverID });
        const uMedia = [];
    
        for (let i = 0; i < uRegistrados.length; i++) {
            const uLista = await bot.buscarMediaUsuario(uRegistrados[i].anilistId, media.getID());
    
            if (uLista != null) {
                uLista.username = uRegistrados[i].anilistUsername;
                uLista.discordId = uRegistrados[i].discordId;
                uMedia.push(uLista);
            }
        }
    
        const uMapeados = [];
    
        for (let i = 0; i < uMedia.length; i++) {
            if (parseFloat(uMedia[i].score.toString()) <= 10) {
                uMedia[i].score = parseFloat((uMedia[i].score * 10).toString());
            }
    
            const u = {
                name: uMedia[i].username,
                status: uMedia[i].status,
                progress: uMedia[i].progress,
                score: parseFloat(uMedia[i].score.toString())
            }
    
            uMapeados.push(u);
        }
    
        return uMapeados;
    }

    public static async GetEntradas(bot: BOT, username: string): Promise<any> {
        const variables = { username };
        const response = await bot.request(queryLista, variables);
    
        return (response == null) ? null : response;
    }

    public static async GetStatsMedia(bot: BOT, uID: any, mID: string): Promise<any> {
        const userID = parseInt(uID);
        const mediaID = parseInt(mID);
    
        const variables = { userID, mediaID };
    
        const response = await bot.request(queryMedia, variables);
    
        return (response == null || response.MediaList == null) ? null : response.MediaList;
    }
}

export { Usuarios };

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

const queryLista = `
    query ($username: String) {
        animeList: MediaListCollection(userName: $username, type: ANIME) {
            user {
                name
                avatar {
                    large
                }
                options {
                    profileColor
                }
                siteUrl
            }
            lists {
                entries {
                    mediaId,
                    score(format: POINT_100)
                }
                status
            }
        }
        mangaList: MediaListCollection(userName: $username, type: MANGA) {
            lists {
                entries {
                    mediaId,
                    score(format: POINT_100)
                }
            }
        }
    }
`;

const queryMedia = `
    query ($userID: Int, $mediaID: Int) {
        MediaList(userId: $userID, mediaId: $mediaID) {
            id
            mediaId
            status
            score
            progress
        }
    }
`;