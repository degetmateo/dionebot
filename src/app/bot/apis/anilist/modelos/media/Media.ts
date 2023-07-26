import { ColorResolvable } from 'discord.js';
import * as TiposMedia from '../../tipos/TiposMedia';
import Helpers from '../../../../Helpers';

export default abstract class Media {
    protected media: TiposMedia.Media;

    constructor (media: TiposMedia.Media) {
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

    public obtenerTitulos (): TiposMedia.MediaTitulo {
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

    public obtenerEstado (): TiposMedia.MediaEstado {
        return this.media.status;
    }

    public obtenerEstudios (): TiposMedia.MediaListaEstudios {
        return this.media.studios.edges;
    }

    public obtenerFechaEmision (): TiposMedia.MediaFecha {
        return this.media.startDate;
    }

    public obtenerCalificacionPromedio (): number {
        return this.media.meanScore;
    }
}