import { AnimeEntry, MangaEntry } from 'anilist-node';
import { ColorResolvable } from 'discord.js';

export default abstract class Media {
    private media: AnimeEntry | MangaEntry;

    constructor (media: AnimeEntry | MangaEntry) {
        this.media = media;
    }

    public obtenerTitulo (): string {
        return this.media.title.romaji || this.media.title.english || this.media.title.native;
    }

    public obtenerColor (): ColorResolvable {
        return this.media.coverImage.color as ColorResolvable;
    }

    public obtenerBannerImageURL (): string {
        return this.media.bannerImage;
    }
}