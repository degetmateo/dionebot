import Media from './Media';
import * as TiposMedia from '../../tipos/TiposMedia'

export default class Anime extends Media {
    constructor (media: TiposMedia.Media) {
        super(media);
    }

    public getEpisodes (): number {
        return this.media.episodes;
    }

    public getSeason (): TiposMedia.MediaTemporada {
        return this.media.season;
    }

    public getDuration (): number {
        return this.media.duration;
    }
}