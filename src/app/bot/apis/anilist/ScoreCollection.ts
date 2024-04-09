import { MediaList } from "./TiposAnilist";

export default class ScoreCollection {
    private mediaList: Array<MediaList>;

    constructor (mediaList: Array<MediaList>) {
        this.mediaList = mediaList;
    }

    public isEmpty (): boolean {
        return this.mediaList.length <= 0;
    }

    public empty (): void {
        this.mediaList = new Array<MediaList>();
    }

    public add (mediaList: MediaList): void {
        if (this.has(mediaList)) throw new Error('El elemento que intentas agregar ya existe en la coleccion.');
        this.mediaList.push(mediaList);
    }

    public has (mediaList: MediaList): boolean {
        return this.mediaList.find(m => (m.id === mediaList.id) && (m.user.id === mediaList.user.id)) ? true : false;
    }

    public getMediaList () {
        return this.mediaList;
    }

    public getCompleted () {
        return this.mediaList.filter(media => media.status === 'COMPLETED');
    }

    public getPlanning () {
        return this.mediaList.filter(media => media.status === 'PLANNING');
    }

    public getCurrent () {
        return this.mediaList.filter(media => media.status === 'CURRENT');
    }
    
    public getPaused () {
        return this.mediaList.filter(media => media.status === 'PAUSED');
    }

    public getDropped () {
        return this.mediaList.filter(media => media.status === 'DROPPED');
    }

    public getRepeating () {
        return this.mediaList.filter(media => media.status === 'REPEATING');
    }
}