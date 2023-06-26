"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioAnilist = void 0;
class UsuarioAnilist {
    constructor(data) {
        this.data = data;
    }
    getData() {
        return this.data;
    }
    getID() {
        return this.data.id == null ? null : this.data.id.toString();
    }
    getEstadisticas() {
        return this.data.statistics == null ? null : this.data.statistics;
    }
    getColorName() {
        return this.data.options.profileColor == null ? "black" : this.data.options.profileColor;
    }
    getNombre() {
        return this.data.name == null ? null : this.data.name;
    }
    getBio() {
        return this.data.about == null ? null : this.data.about;
    }
    getAvatarURL() {
        return this.data.avatar.large == null ? null : this.data.avatar.large;
    }
    getBannerImage() {
        return this.data.bannerImage == null ? null : this.data.bannerImage;
    }
    getURL() {
        return this.data.siteUrl == null ? null : this.data.siteUrl;
    }
}
exports.UsuarioAnilist = UsuarioAnilist;
