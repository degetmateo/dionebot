import Media from './Media';
import * as TiposMedia from '../../tipos/TiposMedia'

export default class Anime extends Media {
    constructor (media: TiposMedia.Media) {
        super(media);
    }

    public obtenerEpisodios (): number {
        return this.media.episodes;
    }

    public obtenerTemporada (): TiposMedia.MediaTemporada {
        return this.media.season;
    }

    public obtenerDuracion (): number {
        return this.media.duration;
    }
}