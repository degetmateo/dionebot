import { ColorResolvable } from 'discord.js';
import * as TiposMedia from '../../tipos/TiposMedia';
import Helpers from '../../../../Helpers';

export default abstract class Media {
    protected media: TiposMedia.Media;

    constructor (media: TiposMedia.Media) {
        this.media = media;
    }

    public getId (): number {
        return this.media.id;
    }

    public getMalId (): number {
        return this.media.idMal;
    }

    public getPreferredTitle (): string {
        return this.media.title.userPreferred;
    }

    public getTitle (): string {
        return this.media.title.userPreferred || this.media.title.romaji || this.media.title.english || this.media.title.native;
    }

    public getColor (): ColorResolvable {
        return this.media.coverImage.color as ColorResolvable;
    }

    public getBannerURL (): string {
        return this.media.bannerImage;
    }

    public getDescription (): string {
        if (!this.media.description) return '?';
        return this.media.description.length <= 0 ? "?" : Helpers.eliminarEtiquetasHTML(this.media.description);
    }

    public getURL (): string {
        return this.media.siteUrl;
    }

    public getTitles (): TiposMedia.MediaTitulo {
        return this.media.title;
    }

    public getCoverURL (): string {
        return this.media.coverImage.large || this.media.coverImage.medium || this.media.coverImage.small;
    }

    public getFormat (): string {
        return this.media.format;
    }

    public getGenres (): Array<string> {
        return this.media.genres;
    }

    public getFavourites (): number {
        return this.media.favourites;
    }

    public getPopularity (): number {
        return this.media.popularity;
    }

    public getStatus (): TiposMedia.MediaEstado {
        return this.media.status;
    }

    public getStudios (): TiposMedia.MediaListaEstudios {
        return this.media.studios.edges;
    }

    public getStartDate (): TiposMedia.MediaFecha {
        return this.media.startDate;
    }

    public getMeanScore (): number {
        return this.media.meanScore;
    }
}