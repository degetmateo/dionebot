import anilist from "../anilist";

export const getAuthorizedUser = async (id: any, token: string) => {
    const QUERY = `
        query  {
            User (id: ${id}) {
                id
                name
                about
                avatar {
                    large
                }
                bannerImage
                options {
                    profileColor
                }
                statistics {
                    anime {
                        statuses {
                            status
                            count
                            meanScore
                        }
                        count
                        meanScore
                        minutesWatched
                        episodesWatched
                        genres {
                            genre
                            count
                            meanScore
                        }
                    }
                    manga {
                        statuses {
                            status
                            count
                            meanScore
                        }
                        count
                        meanScore
                        chaptersRead
                        volumesRead
                        genres {
                            genre
                            count
                            meanScore
                        }
                    }
                }
                siteUrl
                createdAt
            }
        }
    `;

    const response = await anilist.authorizedRequest(QUERY, token);
    return response.User;
};