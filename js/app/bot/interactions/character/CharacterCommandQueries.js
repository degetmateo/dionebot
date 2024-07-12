"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Helpers_1 = __importDefault(require("../../Helpers"));
class CharacterCommandQueries {
    static CreateCharacterQuery(criteria) {
        const qCharacter = Helpers_1.default.isNumber(criteria) ? `id: ${criteria}` : `search: "${criteria}"`;
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
    static CreateCharacterFavouritesQuery(users) {
        return `
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
exports.default = CharacterCommandQueries;
