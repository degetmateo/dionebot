"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ColeccionUsuarios {
    constructor(elementos) {
        this.eliminar = (serverId, userId) => {
            this.usuarios = this.usuarios.filter(u => u.serverId != serverId && u.discordId != userId);
        };
        this.obtenerUsuariosRegistrados = (serverID) => {
            return this.usuarios.filter(u => u.serverId === serverID);
        };
        this.usuarios = elementos;
    }
    static CrearNueva() {
        return new ColeccionUsuarios(new Array());
    }
    vaciar() {
        this.usuarios = new Array();
    }
    insertar(elemento) {
        if (this.existe(elemento))
            throw new Error('El elemento que intentas agregar ya existe en la coleccion.');
        this.usuarios.push(elemento);
    }
    existe(usuario) {
        for (let i = 0; i < this.usuarios.length; i++) {
            const cond = this.usuarios[i].serverId === (usuario === null || usuario === void 0 ? void 0 : usuario.serverId) && this.usuarios[i].discordId === usuario.discordId;
            if (cond)
                return true;
        }
        return false;
    }
}
exports.default = ColeccionUsuarios;
