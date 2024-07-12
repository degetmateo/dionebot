"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Character = void 0;
class Character {
    constructor(data) {
        this.data = data;
    }
    getId() {
        return this.data.id;
    }
    getName() {
        return this.data.name.userPreferred;
    }
    getImageURL() {
        return this.data.image.large;
    }
    getURL() {
        return this.data.siteUrl;
    }
    getFavourites() {
        return this.data.favourites;
    }
}
exports.Character = Character;
