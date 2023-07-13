import { ColorResolvable } from 'discord.js';
import * as AnilistTypes from '../apis/anilist/types/Media';
import Helpers from '../helpers';

export default abstract class Media {
    protected media: AnilistTypes.Media;

    constructor (media: AnilistTypes.Media) {
        this.media = media;
    }

    public obtenerID (): number {
        return this.media.id;
    }

    public obtenerMalID (): number {
        return this.media.idMal;
    }

    public obtenerTituloPreferido (): string {
        return this.media.title.userPreferred;
    }

    public obtenerTitulo (): string {
        return this.media.title.userPreferred || this.media.title.romaji || this.media.title.english || this.media.title.native;
    }

    public obtenerColor (): ColorResolvable {
        return this.media.coverImage.color as ColorResolvable;
    }

    public obtenerBannerImageURL (): string {
        return this.media.bannerImage;
    }

    public obtenerDescripcion (): string {
        if (!this.media.description) return '?';
        return this.media.description.length <= 0 ? "?" : Helpers.eliminarEtiquetasHTML(this.media.description);
    }

    public obtenerEnlace (): string {
        return this.media.siteUrl;
    }

    public obtenerTitulos (): AnilistTypes.MediaTitulo {
        return this.media.title;
    }

    public obtenerCoverImageURL (): string {
        return this.media.coverImage.large || this.media.coverImage.medium || this.media.coverImage.small;
    }

    public obtenerFormato (): string {
        return this.media.format;
    }

    public obtenerGeneros (): Array<string> {
        return this.media.genres;
    }

    public obtenerCantidadFavoritos (): number {
        return this.media.favourites;
    }

    public obtenerPopularidad (): number {
        return this.media.popularity;
    }

    public obtenerEstado (): AnilistTypes.MediaEstado {
        return this.media.status;
    }

    public obtenerEstudios (): AnilistTypes.MediaListaEstudios {
        return this.media.studios.edges;
    }

    public obtenerAnioEmision (): AnilistTypes.MediaFecha {
        return this.media.startDate;
    }

    public obtenerCalificacionPromedio (): number {
        return this.media.meanScore;
    }
}