import { Server, User } from "../../database/types";

export default class ServerCollection {
    private servers: Array<Server>;

    private constructor (servers: Array<Server>) {
        this.servers = servers;
    }

    public static Create (): ServerCollection {
        return new ServerCollection(new Array<Server>());
    }

    public empty (): void {
        this.servers = new Array<Server>();
    }

    public add (server: Server): void {
        if (this.has(server)) throw new Error('El elemento que intentas agregar ya existe en la coleccion.');
        this.servers.push(server);
    }

    public has (server: Server): boolean {
        return this.servers.find(s => s.id === server.id) ? true : false;
    }

    public getUsers (serverId: string): Array<User> {
        const server = this.servers.find(s => s.id === serverId);
        return server ? server.users : [];
    }
}