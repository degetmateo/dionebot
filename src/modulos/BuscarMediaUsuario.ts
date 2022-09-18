import { BOT } from "../objects/Bot";

async function BuscarMediaUsuario(bot: BOT, uID: any, mID: string): Promise<any> {
    const userID = parseInt(uID);
    const mediaID = parseInt(mID);

    const variables = { userID, mediaID };

    const response = await bot.request(queryMedia, variables);

    return (response == null || response.MediaList == null) ? null : response.MediaList;
}

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

export { BuscarMediaUsuario };