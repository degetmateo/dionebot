import { AnimeEntry, StudioRelation, MediaStatus, MediaSeason, MediaTitle } from 'anilist-node';
import { ColorResolvable } from 'discord.js';
import Helpers from '../helpers';
import Media from './Media';

export default class Anime extends Media {
    private anime: AnimeEntry;

    constructor (anime: AnimeEntry) {
        super(anime);
        this.anime = anime;
    }

    public obtenerID (): number {
        return this.anime.id;
    }

    public obtenerMalID (): number {
        return this.anime.idMal;
    }

    public obtenerEstudios (): Array<StudioRelation> {
        return this.anime.studios;
    }

    public obtenerFormato (): string {
        return this.anime.format;
    }

    public obtenerGeneros (): Array<string> {
        return this.anime.genres;
    }

    public obtenerCantidadFavoritos (): number {
        return this.anime.favourites;
    }

    public obtenerPopularidad (): number {
        return this.anime.popularity;
    }

    public obtenerEstado (): MediaStatus {
        return this.anime.status;
    }

    public obtenerEpisodios (): number {
        return this.anime.episodes;
    }

    public obtenerTemporada (): MediaSeason {
        return this.anime.season;
    }

    public obtenerAnioEmision (): number {
        return this.anime.seasonYear;
    }

    public obtenerDuracion (): number {
        return this.anime.duration;
    }

    public obtenerCalificacionPromedio (): number {
        return this.anime.meanScore;
    }

    public obtenerEnlace (): string {
        return this.anime.siteUrl;
    }

    public obtenerTitulos (): MediaTitle {
        return this.anime.title;
    }

    public obtenerDescripcion (): string {
        return (!this.anime.description || this.anime.description.length <= 0) ? "?" : Helpers.eliminarEtiquetasHTML(this.anime.description);
    }

    public obtenerCoverImageURL (): string {
        return this.anime.coverImage.large;
    }
}