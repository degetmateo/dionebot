import { ColorResolvable } from "discord.js";
import Helpers from "../../../helpers";

export type AnianimeData = {
    id: number;
    idMal: number;
    title: {
        romaji: string;
        english: string;
        native: string;
        userPreferred: string;
    };
    format: string;
    status: string;
    description: string;
    startDate: {
        year: number;
        month: number;
        day: number;
    };
    endDate: {
        year: number;
        month: number;
        day: number;
    };
    season: string;
    episodes: number;
    duration: number;
    source: string;
    trailer: {
        id: string;
        site: string;
        thumbnail: string;
    };
    updatedAt: string;
    coverImage: {
        extraLarge: string;
        large: string;
        medium: string;
        color: string;
    };
    tags: Array<{
        name: string;
        isMediaSpoiler: boolean;
    }>;
    bannerImage: string;
    genres: Array<any>;
    synonyms: Array<any>
    averageScore: number;
    meanScore: number;
    popularity: number;
    favourites: number;
    siteUrl: string;
    studios: {
        edges: Array<{
            node: {
                id: number;
                name: string;
            }
        }>
    }
};

export default class Anianime {
    public data: AnianimeData;

    constructor (data: AnianimeData) {
        this.data = data;
    };

    getCoverImageUrl () {
        return this.data.coverImage.extraLarge || this.data.coverImage.large || this.data.coverImage.medium;
    };

    getBannerImageUrl () {
        return this.data.bannerImage;
    };

    getColorAsResolvable () {
        return this.data.coverImage.color as ColorResolvable;
    };

    getColorAsRGBTuple () {
        return Helpers.hexToRgb(this.data.coverImage.color);
    };

    getId () {
        return this.data.id;
    };

    getMalId () {
        return this.data.idMal;
    };

    getSiteUrl () {
        return this.data.siteUrl;
    };

    getFormat () {
        return this.data.format;
    };

    getStatus () {
        return this.data.status;
    };

    getDescription () {
        return Helpers.clearHTML(this.data.description);
    };

    getTitle () {
        return (
            this.data.title.userPreferred ||
            this.data.title.english ||
            this.data.title.romaji ||
            this.data.title.native
        );
    };

    getTitles () {
        return this.data.title;
    };

    getSynonyms () {
        return this.data.synonyms;
    };

    getGenres () {
        return this.data.genres || [];
    };

    getStudios () {
        if (this.data.studios.edges && this.data.studios.edges.length > 1) {
            return this.data.studios.edges.map(e => e.node.name);
        } else {
            return [];
        };
    };

    getNoSpoilerTags () {
        if ((!this.data.tags) || (this.data.tags.length < 1)) {
            return [];
        };

        const noSpoilerTags = this.data.tags.filter(t => !t.isMediaSpoiler);
        return noSpoilerTags.map(t => t.name);
    };

    getStartDate (): string | null {
        const hasStartDate =
            (this.data.startDate) &&
            (this.data.startDate.day) &&
            (this.data.startDate.month) &&
            (this.data.startDate.year);
        
        return hasStartDate ?
            `${this.data.startDate.day}/${this.data.startDate.month}/${this.data.startDate.year}` : null;
    };

    getSource () {
        return this.data.source;
    };

    getFavourites () {
        return this.data.favourites;
    };

    getMeanScore () {
        return this.data.meanScore;
    };

    getSeason () {
        return this.data.season;
    };

    getEpisodes () {
        return this.data.episodes;
    };

    getPopularity () {
        return this.data.popularity;
    };
};