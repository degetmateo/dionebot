"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mensaje = void 0;
class Mensaje {
    constructor(data) {
        this.data = data;
    }
    getPartes() {
        return this.getContenido().split(" ");
    }
    getComando() {
        return this.getPartes()[0];
    }
    getArgumentos() {
        return this.getPartes().slice(1);
    }
    getContenido() {
        return this.data.content == null ? "" : this.data.content;
    }
    getServerID() {
        return this.data.guildId;
    }
    getUserID() {
        return this.data.author.id;
    }
}
exports.Mensaje = Mensaje;
