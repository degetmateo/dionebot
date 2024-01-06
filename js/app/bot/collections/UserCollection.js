"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserCollection {
    constructor(elementos) {
        this.delete = (serverId, userId) => {
            this.usuarios = this.usuarios.filter(u => u.serverId != serverId && u.discordId != userId);
        };
        this.getUsers = (serverID) => {
            return this.usuarios.filter(u => u.serverId === serverID);
        };
        this.usuarios = elementos;
    }
    static Create() {
        return new UserCollection(new Array());
    }
    empty() {
        this.usuarios = new Array();
    }
    add(elemento) {
        if (this.has(elemento))
            throw new Error('El elemento que intentas agregar ya existe en la coleccion.');
        this.usuarios.push(elemento);
    }
    has(usuario) {
        for (let i = 0; i < this.usuarios.length; i++) {
            const cond = this.usuarios[i].serverId === (usuario === null || usuario === void 0 ? void 0 : usuario.serverId) && this.usuarios[i].discordId === usuario.discordId;
            if (cond)
                return true;
        }
        return false;
    }
}
exports.default = UserCollection;
