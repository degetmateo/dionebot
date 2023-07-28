import { uRegistrado } from "../tipos";

export default class ColeccionUsuarios {
    private usuarios: Array<uRegistrado>;

    private constructor (elementos: Array<uRegistrado>) {
        this.usuarios = elementos;
    }
    
    public static CrearNueva () {
        return new ColeccionUsuarios(new Array<uRegistrado>());
    }
    
    public vaciar (): void {
        this.usuarios = new Array<uRegistrado>();
    }

    public insertar (elemento: uRegistrado): void {
        if (this.existe(elemento)) throw new Error('El elemento que intentas agregar ya existe en la coleccion.');
        this.usuarios.push(elemento);
    }

    public existe (usuario: uRegistrado): boolean {
        for (let i = 0; i < this.usuarios.length; i++) {
            const cond = this.usuarios[i].serverId === usuario?.serverId && this.usuarios[i].discordId === usuario.discordId;
            if (cond) return true;
        }

        return false;
    }

    public eliminar = (serverId: string, userId: string): void => {
        this.usuarios = this.usuarios.filter(u => u.serverId != serverId && u.discordId != userId);
    }

    public obtenerUsuariosRegistrados = (serverID: string) => {
        return this.usuarios.filter(u => u.serverId === serverID);
    }
}