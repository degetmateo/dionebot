import { MangaEntry, StudioRelation, MediaStatus, FuzzyDate, MediaTitle } from 'anilist-node';
import { ColorResolvable } from 'discord.js';
import Helpers from '../helpers';
import Media from './Media';

export default class Manga extends Media {
    private manga: MangaEntry;

    constructor (manga: MangaEntry) {
        super(manga);
        this.manga = manga;
    }

    public obtenerID (): number {
        return this.manga.id;
    }

    public obtenerMalID (): number {
        return this.manga.idMal;
    }

    public obtenerEstudios (): Array<StudioRelation> {
        return this.manga.studios;
    }

    public obtenerFormato (): string {
        return this.manga.format;
    }

    public obtenerGeneros (): Array<string> {
        return this.manga.genres;
    }

    public obtenerCantidadFavoritos (): number {
        return this.manga.favourites;
    }

    public obtenerPopularidad (): number {
        return this.manga.popularity;
    }

    public obtenerEstado (): MediaStatus {
        return this.manga.status;
    }

    public obtenerCapitulos (): number {
        return this.manga.chapters;
    }

    public obtenerVolumenes (): number {
        return this.manga.volumes;
    }

    public obtenerAnioEmision (): FuzzyDate {
        return this.manga.startDate;
    }

    public obtenerCalificacionPromedio (): number {
        return this.manga.meanScore;
    }

    public obtenerEnlace (): string {
        return this.manga.siteUrl;
    }

    public obtenerTitulos (): MediaTitle {
        return this.manga.title;
    }

    public obtenerDescripcion (): string {
        const descripcion: string = Helpers.eliminarEtiquetasHTML(this.manga.description);
        return descripcion.length <= 0 ? "?" : descripcion;
    }

    public obtenerCoverImageURL (): string {
        return this.manga.coverImage.large || this.manga.coverImage.medium || this.manga.coverImage.small;
    }

    public obtenerBannerImageURL (): string {
        return this.manga.bannerImage;
    }

    public obtenerColor (): ColorResolvable {
        return this.manga.coverImage.color as ColorResolvable;
    }
}