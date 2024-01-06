"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ScoreCollection {
    constructor(mediaList) {
        this.mediaList = mediaList;
    }
    isEmpty() {
        return this.mediaList.length <= 0;
    }
    empty() {
        this.mediaList = new Array();
    }
    add(mediaList) {
        if (this.has(mediaList))
            throw new Error('El elemento que intentas agregar ya existe en la coleccion.');
        this.mediaList.push(mediaList);
    }
    has(mediaList) {
        return this.mediaList.find(m => (m.id === mediaList.id) && (m.user.id === mediaList.user.id)) ? true : false;
    }
    getCompleted() {
        return this.mediaList.filter(media => media.status === 'COMPLETED');
    }
    getPlanning() {
        return this.mediaList.filter(media => media.status === 'PLANNING');
    }
    getCurrent() {
        return this.mediaList.filter(media => media.status === 'CURRENT');
    }
    getPaused() {
        return this.mediaList.filter(media => media.status === 'PAUSED');
    }
    getDropped() {
        return this.mediaList.filter(media => media.status === 'DROPPED');
    }
}
exports.default = ScoreCollection;
