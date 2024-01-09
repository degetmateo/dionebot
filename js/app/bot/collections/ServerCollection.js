"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ServerCollection {
    constructor(servers) {
        this.servers = servers;
    }
    static Create() {
        return new ServerCollection(new Array());
    }
    empty() {
        this.servers = new Array();
    }
    add(server) {
        if (this.has(server))
            throw new Error('El elemento que intentas agregar ya existe en la coleccion.');
        this.servers.push(server);
    }
    has(server) {
        return this.servers.find(s => s.id === server.id) ? true : false;
    }
    get(id) {
        return this.servers.find(server => server.id === id);
    }
    getUsers(serverId) {
        const server = this.servers.find(s => s.id === serverId);
        return server ? server.users : [];
    }
}
exports.default = ServerCollection;
