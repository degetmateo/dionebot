import { AnimeEntry, MangaEntry } from 'anilist-node';

export default abstract class Media {
    private media: AnimeEntry | MangaEntry;

    constructor (media: AnimeEntry | MangaEntry) {
        this.media = media;
    }

    public obtenerTitulo (): string {
        return this.media.title.romaji || this.media.title.english || this.media.title.native;
    }
}