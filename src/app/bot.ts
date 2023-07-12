import { Client, Collection, GatewayIntentBits, Events, ActivityType } from "discord.js";

import fs from "fs";
import path from "path";
import Aniuser from "./modelos/Aniuser";
import { uRegistrado } from "./types";

import { version } from '../../package.json';
import Embed from "./embeds/Embed";
import ErrorGenerico from "./errores/ErrorGenerico";
import ErrorSinResultados from "./errores/ErrorSinResultados";
import ErrorArgumentoInvalido from "./errores/ErrorArgumentoInvalido";
import Comando from "./interfaces/InterfazComando";
import ErrorDemasiadasPeticiones from "./errores/ErrorDemasiadasPeticiones";

export default class BOT extends Client {
    private comandos: Collection<string, any>;
    private usuarios: Array<uRegistrado>;
    public interacciones: Set<string>;
    private version: string;

    constructor() {
        super({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
        });

        this.comandos = new Collection();
        this.usuarios = new Array<uRegistrado>();
        this.interacciones = new Set<string>();
        this.version = version;
    }

    public getVersion = (): string => this.version;

    private loadCommands = () => {
        const commandsPath = path.join(__dirname + "/comandos/");
        const commandsFiles = fs.readdirSync(commandsPath);

        for (const file of commandsFiles) {
            if (!file.endsWith('.ts') && !file.endsWith('.js')) continue;

            const filePath = path.join(commandsPath, file);
            const command = require(filePath);

            if (!command.default) continue;

            const comando = new command.default() as Comando;

            if (!comando.execute || !comando.datos) continue;

            this.comandos.set(comando.datos.name, comando);
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

            const command = this.comandos.get(interaction.commandName);

            if (!command) {
                console.error(`🟨 | No se ha encontrado ningun comando con el nombre: ${interaction.commandName}`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                const esErrorCritico =
                    !(error instanceof ErrorGenerico) &&
                    !(error instanceof ErrorSinResultados) &&
                    !(error instanceof ErrorArgumentoInvalido) &&
                    !(error instanceof ErrorDemasiadasPeticiones);

                if (!esErrorCritico) {
                    interaction.editReply({ embeds: [Embed.CrearRojo(error.message)] })
                } else {
                    if (error instanceof Error) console.error('🟥 | ' + error.stack)
                    else console.error(error);
                    interaction.editReply({ embeds: [Embed.CrearRojo('Ha ocurrido un error. Inténtalo de nuevo más tarde.')] })
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
}