import Media from './Media';
import * as ANILIST from '../apis/anilist/types/Media'

export default class Manga extends Media {
    constructor (media: ANILIST.Media) {
        super(media);
    }

    public obtenerCapitulos (): number {
        return this.media.chapters;
    }

    public obtenerVolumenes (): number {
        return this.media.volumes;
    }
}