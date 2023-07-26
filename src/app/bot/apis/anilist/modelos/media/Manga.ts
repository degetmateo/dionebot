import Media from './Media';
import * as TiposMedia from '../../tipos/TiposMedia';

export default class Manga extends Media {
    constructor (media: TiposMedia.Media) {
        super(media);
    }

    public obtenerCapitulos (): number {
        return this.media.chapters;
    }

    public obtenerVolumenes (): number {
        return this.media.volumes;
    }
}