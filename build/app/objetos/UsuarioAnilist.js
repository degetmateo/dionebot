"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioAnilist = void 0;
class UsuarioAnilist {
    constructor(user) {
        this.user = user;
    }
    getUserData() {
        return this.user;
    }
    getID() {
        return this.user.id == null ? null : this.user.id.toString();
    }
    getEstadisticas() {
        return this.user.statistics == null ? null : this.user.statistics;
    }
    getColorName() {
        return this.user.options.profileColor == null ? "black" : this.user.options.profileColor;
    }
    getNombre() {
        return this.user.name == null ? null : this.user.name;
    }
    getBio() {
        return this.user.about == null ? null : this.user.about;
    }
    getAvatarURL() {
        return this.user.avatar.large == null ? null : this.user.avatar.large;
    }
    getBannerImage() {
        return this.user.bannerImage == null ? null : this.user.bannerImage;
    }
    getURL() {
        return this.user.siteUrl == null ? null : this.user.siteUrl;
    }
}
exports.UsuarioAnilist = UsuarioAnilist;
