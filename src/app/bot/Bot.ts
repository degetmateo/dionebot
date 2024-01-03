import { Client, Collection, Events, ActivityType } from 'discord.js';

import fs from "fs";
import path from "path";
import Aniuser from "../database/modelos/Aniuser";

import { version } from '../../../package.json';
import Embed from "./embeds/Embed";
import ErrorGenerico from "../errores/ErrorGenerico";
import ErrorSinResultados from "../errores/ErrorSinResultados";
import ErrorArgumentoInvalido from "../errores/ErrorArgumentoInvalido";
import Comando from "./interfaces/InterfazComando";
import ErrorDemasiadasPeticiones from "../errores/ErrorDemasiadasPeticiones";
import UserCollection from "./collections/UserCollection";
import ColeccionInteracciones from "./collections/ColeccionInteracciones";
import ServerModel from '../database/modelos/ServerModel';
import ServerCollection from './collections/ServerCollection';
import IllegalArgumentException from '../errores/IllegalArgumentException';
import CommandUnderMaintenanceException from '../errores/CommandUnderMaintenanceException';

export default class Bot extends Client {
    private static readonly HORA_EN_MILISEGUNDOS: number = 3600000;

    private commands: Collection<string, Comando>;
    private cooldowns: Collection<string, Collection<string, number>>;

    private version: string;
    
    public readonly servers: ServerCollection;

    public readonly interacciones: ColeccionInteracciones;

    constructor() {
        super({ intents: [] });

        this.commands = new Collection<string, Comando>();
        this.cooldowns = new Collection<string, Collection<string, number>>();

        this.servers = ServerCollection.Create();

        this.interacciones = ColeccionInteracciones.CrearNueva();
        this.version = version;
    }

    public obtenerVersion = (): string => this.version;

    public async iniciar(token: string | undefined) {
        this.on("ready", () => {
            console.log("✅ | BOT iniciado.");
            this.establecerEstados();
        });

        this.cargarComandos();
 
        this.on(Events.InteractionCreate, async interaction => {
            if (!interaction.isChatInputCommand()) return;

            const command = this.commands.get(interaction.commandName);
            if (!command) throw new Error(`No se ha encontrado ningun comando con el nombre: ${interaction.commandName}`);

            if (!this.cooldowns.has(command.data.name)) this.cooldowns.set(command.data.name, new Collection<string, number>());

            const now = Date.now();
            const timestamps = this.cooldowns.get(command.data.name);
            const defaultCooldownDuration = 3;
            const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;

            if (timestamps.has(interaction.user.id)) {
                const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

                if (now < expirationTime) {
                    const expirationSeconds = ((expirationTime - now) / 1000).toFixed(0);

                    const desc = parseInt(expirationSeconds) === 1 ? 
                    `Podrás volver a utilizar este comando \`en ${expirationSeconds} segundo.\`` :
                    `Podrás volver a utilizar este comando \`en ${expirationSeconds} segundos.\``;

                    const embedError = Embed.Crear()
                        .establecerColor(Embed.COLOR_ROJO)
                        .establecerDescripcion(`Podrás volver a utilizar este comando \`en ${expirationSeconds} segundos.\``);

                    interaction.reply({
                        embeds: [embedError.obtenerDatos()],
                        ephemeral: true
                    })

                    this.interacciones.eliminar(interaction.id);

                    return;
                }
            }

            timestamps.set(interaction.user.id, now);
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

            try {
                await command.execute(interaction);
            } catch (error) {
                const esErrorCritico =
                    !(error instanceof ErrorGenerico) &&
                    !(error instanceof ErrorSinResultados) &&
                    !(error instanceof ErrorArgumentoInvalido) &&
                    !(error instanceof ErrorDemasiadasPeticiones) &&
                    !(error instanceof IllegalArgumentException) &&
                    !(error instanceof CommandUnderMaintenanceException);

                const embed = Embed.Crear()
                    .establecerColor(Embed.COLOR_ROJO);

                (!esErrorCritico) ?
                    embed.establecerDescripcion(error.message) :
                    embed.establecerDescripcion('Ha ocurrido un error. Inténtalo de nuevo más tarde.') && console.error('🟥 | ' + error.stack);

                try {
                    (!interaction.deferred && !interaction.replied) ?
                        interaction.reply({ embeds: [embed.obtenerDatos()] }) :
                        interaction.editReply({ embeds: [embed.obtenerDatos()] });
                } catch (error) {
                    console.error(error);
                }

                this.interacciones.eliminar(interaction.id);
            }
        });

        await this.loadServers();

        setInterval(async () => {
            await this.loadServers();
        }, Bot.HORA_EN_MILISEGUNDOS);

        this.on('guildMemberRemove', async (member) => {
            try {
                await Aniuser.findOneAndDelete({ serverId: member.guild.id, discordId: member.id })
                await this.loadServers();
            } catch (error) {
                console.error(error);
            }
        })

        this.on('guildCreate', async server => {
            try {
                const newServer = new ServerModel({
                    id: server.id,
                    premium: false,
                    users: []
                })

                await newServer.save();
            } catch (error) {
                console.error(error)
            }
        })

        try {
            await this.login(token);
        } catch (error) {
            console.error(error)
        }
    }

    private cargarComandos = () => {
        const directorioComandos = path.join(__dirname + "/comandos/");
        const archivos = fs.readdirSync(directorioComandos);

        for (const archivo of archivos) {
            if (!archivo.endsWith('.ts') && !archivo.endsWith('.js')) continue;

            const direccionArchivo = path.join(directorioComandos, archivo);
            const datosComando = require(direccionArchivo);
            if (!datosComando.default) continue;
            
            const comando = new datosComando.default() as Comando;
            if (!comando.execute || !comando.data) continue;

            this.commands.set(comando.data.name, comando);
        }
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
                                name: this.obtenerCantidadServidores() + " servidores!"
                            }]
                        })
                break;
            }
        }, 5000);
    }

    public obtenerCantidadServidores = (): number => {
        return this.guilds.cache.size;
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

    public async obtenerUsuarioDiscord (id: string | number) {
        if (typeof id === 'number') id = id.toString();
        return await this.users.fetch(id);
    }
}