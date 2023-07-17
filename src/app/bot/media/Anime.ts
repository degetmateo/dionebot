import * as ANILIST from '../apis/anilist/types/Media'
import Media from './Media';

export default class Anime extends Media {
    constructor (media: ANILIST.Media) {
        super(media);
    }

    public obtenerEpisodios (): number {
        return this.media.episodes;
    }

    public obtenerTemporada (): ANILIST.MediaTemporada {
        return this.media.season;
    }

    public obtenerDuracion (): number {
        return this.media.duration;
    }
}