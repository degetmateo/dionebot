import Media from './Media';
import * as TiposMedia from '../../tipos/TiposMedia';

export default class Manga extends Media {
    constructor (media: TiposMedia.Media) {
        super(media);
    }

    public getChapters (): number {
        return this.media.chapters;
    }

    public getVolumes (): number {
        return this.media.volumes;
    }
}