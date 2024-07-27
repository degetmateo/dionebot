export type CharacterData = {
    id: number,
    name: {
        userPreferred: string
    },
    image: {
        large: string
    },
    siteUrl: string,
    favourites: number
}

export class Character {
    private data: CharacterData;

    constructor (data: CharacterData) {
        this.data = data;
    }

    public getId () {
        return this.data.id;
    }

    public getName () {
        return this.data.name.userPreferred;
    }

    public getImageURL () {
        return this.data.image.large;
    }

    public getURL () {
        return this.data.siteUrl;
    }

    public getFavourites () {
        return this.data.favourites;
    }
}