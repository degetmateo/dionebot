import { Client, Collection, ActivityType } from 'discord.js';

import fs from "fs";
import path from "path";

import { version } from '../../../package.json';
import Command from "./interfaces/CommandInterface";
import ServerModel from '../database/modelos/ServerModel';
import ServerCollection from './collections/ServerCollection';

export default class Bot extends Client {
    private static readonly HORA_EN_MILISEGUNDOS: number = 3600000;

    public readonly commands: Collection<string, Command>;
    public readonly cooldowns: Collection<string, Collection<string, number>>;

    public readonly servers: ServerCollection;
    private version: string;

    constructor () {
        super({ intents: [] });

        this.commands = new Collection<string, Command>();
        this.cooldowns = new Collection<string, Collection<string, number>>();

        this.servers = ServerCollection.Create();
        this.version = version;
    }

    public async start (token: string): Promise<void> {
        this.on("ready", () => {
            console.log("✅ | BOT iniciado.");
            this.setStatusInterval();
        });

        this.loadCommands();
        await this.loadServers();

        setInterval(async () => {
            await this.loadServers();
        }, Bot.HORA_EN_MILISEGUNDOS);

        require('./events/interaction-create')(this);
        require('./events/guild-member-remove')(this);
        require('./events/guild-create')(this);

        try {
            await this.login(token);
        } catch (error) {
            console.error(error)
        }
    }

    private loadCommands = () => {
        const directorioComandos = path.join(__dirname + "/comandos/");
        const archivos = fs.readdirSync(directorioComandos);

        for (const archivo of archivos) {
            if (!archivo.endsWith('.ts') && !archivo.endsWith('.js')) continue;

            const direccionArchivo = path.join(directorioComandos, archivo);
            const datosComando = require(direccionArchivo);
            if (!datosComando.default) continue;
            
            const comando = new datosComando.default() as Command;
            if (!comando.execute || !comando.data) continue;

            this.commands.set(comando.data.name, comando);
        }
    }

    private setStatusInterval = () => {
        setInterval(() => {
            const num = Math.floor(Math.random() * 2);

            switch (num) {
                case 0: this.user?.presence.set({
                            status: "online",
                            activities: [{
                                type: ActivityType.Listening,
                                name: '/help'
                            }]
                        })
                break;
                case 1: this.user?.presence.set({
                            status: "online",
                            activities: [{
                                type: ActivityType.Watching,
                                name: this.getServersAmount() + " servidores!"
                            }]
                        })
                break;
            }
        }, 5000);
    }

    public loadServers = async (): Promise<void> => {
        this.servers.empty();
        const servers = await ServerModel.find();

        servers.forEach(server => {
            this.servers.add({
                id: server.id,
                premium: server.premium,
                users: server.users.toObject()
            })
        })
    }

    public async fetchServer (id: string) {
        return await this.guilds.fetch(id);
    }

    public async fetchUser (id: string) {
        return await this.users.fetch(id);
    }

    public getServersAmount (): number {
        return this.guilds.cache.size;
    } 

    public getVersion (): string {
        return this.version;
    }
}