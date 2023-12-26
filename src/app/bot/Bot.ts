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
import ColeccionUsuarios from "./colecciones/ColeccionUsuarios";
import ColeccionInteracciones from "./colecciones/ColeccionInteracciones";

export default class Bot extends Client {
    private static readonly HORAS_EN_MILISEGUNDOS: number = 3600000;

    private comandos: Collection<string, Comando>;
    private version: string;
    
    public readonly usuarios: ColeccionUsuarios;
    public readonly interacciones: ColeccionInteracciones;

    constructor() {
        super({ intents: [] });

        this.comandos = new Collection<string, Comando>();
        this.usuarios = ColeccionUsuarios.CrearNueva();
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

            try {
                const command = this.comandos.get(interaction.commandName);
                if (!command) throw new Error(`No se ha encontrado ningun comando con el nombre: ${interaction.commandName}`);
                await command.execute(interaction);
            } catch (error) {
                const esErrorCritico =
                    !(error instanceof ErrorGenerico) &&
                    !(error instanceof ErrorSinResultados) &&
                    !(error instanceof ErrorArgumentoInvalido) &&
                    !(error instanceof ErrorDemasiadasPeticiones);

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

        await this.cargarUsuarios();

        setInterval(async () => {
            await this.cargarUsuarios();
        }, Bot.HORAS_EN_MILISEGUNDOS);

        this.on('guildMemberRemove', async (member) => {
            try {
                await Aniuser.findOneAndDelete({ serverId: member.guild.id, discordId: member.id })
                await this.cargarUsuarios();
            } catch (error) {
                console.error(error);
            }
        })

        this.login(token);
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
            if (!comando.execute || !comando.datos) continue;

            this.comandos.set(comando.datos.name, comando);
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

    public cargarUsuarios = async (): Promise<void> => {
        const aniusers =  await Aniuser.find();
        this.usuarios.vaciar();

        for (let i = 0; i < aniusers.length; i++) {
            const serverID = aniusers[i].serverId;
            const dsID = aniusers[i].discordId;
            const anilistUsername = aniusers[i].anilistUsername;
            const anilistID = aniusers[i].anilistId;

            if (!serverID || !dsID || !anilistUsername || !anilistID) {
                await aniusers[i].deleteOne();
                continue;
            }

            this.usuarios.insertar({
                serverId: serverID,
                discordId: dsID,
                anilistUsername: anilistUsername,
                anilistId: anilistID
            });
        }
    }

    public async obtenerUsuarioDiscord (id: string | number) {
        if (typeof id === 'number') id = id.toString();
        return await this.users.fetch(id);
    }
}