import { BOT } from "../objects/Bot";

async function BuscarListaUsuario(bot: BOT, username: string): Promise<any> {
    const variables = { username };
    const response = await bot.request(queryLista, variables);

    return (response == null) ? null : response;
}

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

export { BuscarListaUsuario };