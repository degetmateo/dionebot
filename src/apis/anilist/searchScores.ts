import Anilist from "../../services/anilist";

export default async (mediaId: string, anilistIds: string[]) => {
    const query = `
        query {
            users: Page (page: 1, perPage: 50) {
                results: mediaList (mediaId: ${mediaId}, userId_in: [${anilistIds.join(',')}]) {
                    user {
                        id
                        name
                    }
                    progress
                    repeat
                    score (format: POINT_100)
                    status
                }
            }
        }
    `;

    const response = await Anilist.query(query);
    return response.users.results;
};