import Helpers from "../../Helpers";

export default class CharacterCommandQueries {
    public static CreateCharacterQuery (criteria: string) {
        const qCharacter = Helpers.isNumber(criteria) ? `id: ${criteria}` : `search: "${criteria}"`;

        return `
            query {                
                Character (${qCharacter}) {
                    id
                    name {
                        userPreferred
                    }
                    image {
                        large
                    }
                    siteUrl
                    favourites
                }
            }
        `;
    }

    public static CreateCharacterFavouritesQuery (users: Array<{ id_user: string, id_anilist: string }>) {
        return  `
            query {
                ${users.map((user, i) => `
                    q${i}: Page (perPage: 1) {
                        users (id: ${user.id_anilist}) {
                            ...user
                        }
                    }
                `).join('\n')}
            }

            fragment user on User {
                id
                favourites {
                    characters {
                        nodes {
                            id
                        }
                    }
                }
            }
        `;
    }   
}