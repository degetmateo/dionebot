import { uRegistrado } from "../tipos";

export default class UserCollection {
    private usuarios: Array<uRegistrado>;

    private constructor (elementos: Array<uRegistrado>) {
        this.usuarios = elementos;
    }
    
    public static Create () {
        return new UserCollection(new Array<uRegistrado>());
    }
    
    public empty (): void {
        this.usuarios = new Array<uRegistrado>();
    }

    public add (elemento: uRegistrado): void {
        if (this.has(elemento)) throw new Error('El elemento que intentas agregar ya existe en la coleccion.');
        this.usuarios.push(elemento);
    }

    public has (usuario: uRegistrado): boolean {
        for (let i = 0; i < this.usuarios.length; i++) {
            const cond = this.usuarios[i].serverId === usuario?.serverId && this.usuarios[i].discordId === usuario.discordId;
            if (cond) return true;
        }

        return false;
    }

    public delete = (serverId: string, userId: string): void => {
        this.usuarios = this.usuarios.filter(u => u.serverId != serverId && u.discordId != userId);
    }

    public getUsers = (serverID: string) => {
        return this.usuarios.filter(u => u.serverId === serverID);
    }
}