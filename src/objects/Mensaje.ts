import { Message } from "discord.js";

class Mensaje {
    private data: Message;

    constructor(data: Message) {
        this.data = data;
    }

    private getPartes(): Array<string> {
        return this.getContenido().split(" ");
    }

    public getComando(): string {
        return this.getPartes()[0];
    }

    public getArgumentos(): Array<string> {
        return this.getPartes().slice(1);
    }

    public getContenido(): string {
        return this.data.content == null ? "" : this.data.content;
    }

    public getServerID(): string | null {
        return this.data.guildId;
    }

    public getUserID(): string {
        return this.data.author.id;
    }
}

export { Mensaje };