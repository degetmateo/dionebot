"use strict";
exports.__esModule = true;
exports.Mensaje = void 0;
var Mensaje = /** @class */ (function () {
    function Mensaje(data) {
        this.data = data;
    }
    Mensaje.prototype.getPartes = function () {
        return this.getContenido().split(" ");
    };
    Mensaje.prototype.getComando = function () {
        return this.getPartes()[0];
    };
    Mensaje.prototype.getArgumentos = function () {
        return this.getPartes().slice(1);
    };
    Mensaje.prototype.getContenido = function () {
        return this.data.content == null ? "" : this.data.content;
    };
    Mensaje.prototype.getServerID = function () {
        return this.data.guildId;
    };
    Mensaje.prototype.getUserID = function () {
        return this.data.author.id;
    };
    return Mensaje;
}());
exports.Mensaje = Mensaje;
