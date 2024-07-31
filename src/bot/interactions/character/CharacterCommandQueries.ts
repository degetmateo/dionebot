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
}