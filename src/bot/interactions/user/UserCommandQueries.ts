export default class UserCommandQueries {
    public static UserQuery (id: number): string {
        return `
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
        `
    }
}