import Anilist from "../../services/anilist";

export default async (token: string) => {
    const query = `
        query {
            Viewer {
                id
                name
                siteUrl
                avatar {
                    large
                }
                options {
                    profileColor                    
                }   
            }
        }
    `;

    const results = await Anilist.authorizedQuery(query, token);
    return results.Viewer;
};