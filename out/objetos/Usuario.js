"use strict";
exports.__esModule = true;
exports.Usuario = void 0;
var Usuario = /** @class */ (function () {
    function Usuario(user) {
        this.user = user;
    }
    Usuario.prototype.getUserData = function () {
        return this.user;
    };
    Usuario.prototype.getID = function () {
        return this.user.id == null ? null : this.user.id.toString();
    };
    Usuario.prototype.getEstadisticas = function () {
        return this.user.statistics == null ? null : this.user.statistics;
    };
    Usuario.prototype.getColorName = function () {
        return this.user.options.profileColor == null ? "black" : this.user.options.profileColor;
    };
    Usuario.prototype.getNombre = function () {
        return this.user.name == null ? null : this.user.name;
    };
    Usuario.prototype.getBio = function () {
        return this.user.about == null ? null : this.user.about;
    };
    Usuario.prototype.getAvatarURL = function () {
        return this.user.avatar.large == null ? null : this.user.avatar.large;
    };
    Usuario.prototype.getBannerImage = function () {
        return this.user.bannerImage == null ? null : this.user.bannerImage;
    };
    Usuario.prototype.getURL = function () {
        return this.user.siteUrl == null ? null : this.user.siteUrl;
    };
    return Usuario;
}());
exports.Usuario = Usuario;
