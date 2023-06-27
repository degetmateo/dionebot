import { Client, Collection, GatewayIntentBits, Events, ActivityType } from "discord.js";

import fs from "fs";
import path from "path";
import Aniuser from "./modelos/Aniuser";
import { uRegistrado } from "./types";

export default class BOT extends Client {
    private comandos: Collection<string, any>;

    private buscando_afinidad: Set<string>;
    private buscando_media: Set<string>;

    private usuarios: Array<uRegistrado>;

    constructor() {
        super({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
        });

        this.comandos = new Collection();
        this.buscando_afinidad = new Set<string>();
        this.buscando_media = new Set<string>();
        this.usuarios = new Array<uRegistrado>();
    }

    private loadCommands = () => {
        const commandsPath = path.join(__dirname + "/comandos/");
        const commandsFiles = fs.readdirSync(commandsPath);

        for (const file of commandsFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);

            if ("data" in command && "execute" in command) {
                this.comandos.set(command.data.name, command);
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing required "data" or "execute" property.`);
            }
        }
    }

    public async iniciar(token: string | undefined) {
        this.on("ready", () => {
            console.log("✅ | BOT iniciado.");
            this.establecerEstados();
        });

        await this.loadUsers();

        setInterval(async () => {
            await this.loadUsers();
        }, 300000)

        this.loadCommands();

        this.on(Events.InteractionCreate, async interaction => {
            if (!interaction.isChatInputCommand()) return;
            if (!interaction) return;
            if (!interaction.user) return;
            if (!interaction.guild) return;
            if (!interaction.guild.id) return;

            const command = this.comandos.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (err) {
                console.error(err);

                if (interaction.replied) {
                    await interaction.editReply({
                        content: "Ha ocurrido un error inesperado. Inténtalo de nuevo más tarde."
                    })

                    return;
                }
            }
        });

        this.login(token);
    }

    private establecerEstados = () => {
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
                                name: this.getCantidadServidores() + " servidores!"
                            }]
                        })
                break;
            }
        }, 5000);
    }

    public getCantidadServidores = (): number => {
        return this.guilds.cache.size;
    }

    public insertarUsuario = (usuario: uRegistrado) => {
        this.usuarios.push(usuario);
    }

    public eliminarUsuario = (serverId: string, userId: string): void => {
        this.usuarios = this.usuarios.filter(u => u.serverId != serverId && u.discordId != userId);
    }

    public existeUsuario = (usuario: uRegistrado): boolean => {
        for (let i = 0; i < this.usuarios.length; i++) {
            const cond = this.usuarios[i].serverId === usuario?.serverId && this.usuarios[i].discordId === usuario.discordId;
            if (cond) return true;
        }

        return false;
    }

    public getUsuario = (usuario: uRegistrado) => {
        return this.usuarios.find(u => u.serverId === usuario?.serverId && u.discordId === usuario.discordId);
    }

    public getUsuariosRegistrados = (serverID: string) => {
        return this.usuarios.filter(u => u.serverId === serverID);
    }

    public loadUsers = async (): Promise<void> => {
        const aniusers =  await Aniuser.find();
        
        for (let i = 0; i < aniusers.length; i++) {
            const serverID = aniusers[i].serverId;
            const dsID = aniusers[i].discordId;
            const anilistUsername = aniusers[i].anilistUsername;
            const anilistID = aniusers[i].anilistId;

            if (!serverID || !dsID || !anilistUsername || !anilistID) {
                continue;
            }

            this.insertarUsuario({
                serverId: serverID,
                discordId: dsID,
                anilistUsername: anilistUsername,
                anilistId: anilistID
            });
        }
    }

    public isGettingAfinitty = (serverID: string): boolean => {
        return this.buscando_afinidad.has(serverID);
    }

    public isSearchingMedia = (serverID: string): boolean => {
        return this.buscando_media.has(serverID);
    }

    public setGettingAffinity = (serverID: string, buscando: boolean): void => {
        buscando ?
            this.buscando_afinidad.add(serverID) :
            this.buscando_afinidad.delete(serverID);
    }

    public setSearchingMedia = (serverID: string, buscando: boolean): void => {
        buscando ?
            this.buscando_media.add(serverID) :
            this.buscando_media.delete(serverID);
    }
}