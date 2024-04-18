import { Client, Collection, ActivityType, PresenceData } from 'discord.js';

import fs from "fs";
import path from "path";

import { version } from '../../../package.json';
import ServerModel from '../database/modelos/ServerModel';
import ServerCollection from './collections/ServerCollection';
import { Command } from './types';

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


        this.loadEvents();

        try {
            await this.login(token);
        } catch (error) {
            console.error(error)
        }
    }

    private loadEvents () {
        const eventsFolderPath = path.join(__dirname + '/events/');
        const eventsFolderFiles = fs.readdirSync(eventsFolderPath);

        for (const file of eventsFolderFiles) {
            if (!file.endsWith('.ts') && !file.endsWith('.js')) continue;

            const filePath = path.join(eventsFolderPath, file);
            require(filePath)(this);
        }
    }

    private loadCommands = () => {
        const directorioComandos = path.join(__dirname + "/commands/");
        const archivos = fs.readdirSync(directorioComandos);

        for (const archivo of archivos) {
            if (!archivo.endsWith('.ts') && !archivo.endsWith('.js')) continue;

            const direccionArchivo = path.join(directorioComandos, archivo);
            const command = require(direccionArchivo);

            if (!command.execute || !command.data) continue;

            this.commands.set(command.data.name, command);
        }
    }

    private setStatusInterval = () => {
        const states: Array<PresenceData> = [
            {
                status: "online",
                activities: [{
                    type: ActivityType.Listening,
                    name: '/help'
                }]
            },
    
            {
                status: "online",
                activities: [{
                    type: ActivityType.Watching,
                    name: this.getServersAmount() + " servidores!"
                }]  
            }
        ];

        let i = 0;

        setInterval(() => {
            let presence = states[i];
            if (!presence) {
                i = 0;
                presence = states[i];
            }
            this.user.presence.set(presence);
            i++;
        }, 10000);
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

    public async createServer (id: string) {
        await new ServerModel({
            id: id,
            premium: false,
            users: []
        }).save();
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