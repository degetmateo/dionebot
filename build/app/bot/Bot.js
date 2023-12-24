"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Aniuser_1 = __importDefault(require("../database/modelos/Aniuser"));
const package_json_1 = require("../../../package.json");
const Embed_1 = __importDefault(require("./embeds/Embed"));
const ErrorGenerico_1 = __importDefault(require("../errores/ErrorGenerico"));
const ErrorSinResultados_1 = __importDefault(require("../errores/ErrorSinResultados"));
const ErrorArgumentoInvalido_1 = __importDefault(require("../errores/ErrorArgumentoInvalido"));
const ErrorDemasiadasPeticiones_1 = __importDefault(require("../errores/ErrorDemasiadasPeticiones"));
const ColeccionUsuarios_1 = __importDefault(require("./colecciones/ColeccionUsuarios"));
const ColeccionInteracciones_1 = __importDefault(require("./colecciones/ColeccionInteracciones"));
class Bot extends discord_js_1.Client {
    constructor() {
        super({ intents: [] });
        this.obtenerVersion = () => this.version;
        this.cargarComandos = () => {
            const directorioComandos = path_1.default.join(__dirname + "/comandos/");
            const archivos = fs_1.default.readdirSync(directorioComandos);
            for (const archivo of archivos) {
                if (!archivo.endsWith('.ts') && !archivo.endsWith('.js'))
                    continue;
                const direccionArchivo = path_1.default.join(directorioComandos, archivo);
                const datosComando = require(direccionArchivo);
                if (!datosComando.default)
                    continue;
                const comando = new datosComando.default();
                if (!comando.execute || !comando.datos)
                    continue;
                this.comandos.set(comando.datos.name, comando);
            }
        };
        this.establecerEstados = () => {
            setInterval(() => {
                var _a, _b;
                const num = Math.floor(Math.random() * 2);
                switch (num) {
                    case 0:
                        (_a = this.user) === null || _a === void 0 ? void 0 : _a.presence.set({
                            status: "online",
                            activities: [{
                                    type: discord_js_1.ActivityType.Listening,
                                    name: '/help'
                                }]
                        });
                        break;
                    case 1:
                        (_b = this.user) === null || _b === void 0 ? void 0 : _b.presence.set({
                            status: "online",
                            activities: [{
                                    type: discord_js_1.ActivityType.Watching,
                                    name: this.obtenerCantidadServidores() + " servidores!"
                                }]
                        });
                        break;
                }
            }, 5000);
        };
        this.obtenerCantidadServidores = () => {
            return this.guilds.cache.size;
        };
        this.cargarUsuarios = async () => {
            const aniusers = await Aniuser_1.default.find();
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
        };
        this.comandos = new discord_js_1.Collection();
        this.usuarios = ColeccionUsuarios_1.default.CrearNueva();
        this.interacciones = ColeccionInteracciones_1.default.CrearNueva();
        this.version = package_json_1.version;
    }
    async iniciar(token) {
        this.on("ready", () => {
            console.log("✅ | BOT iniciado.");
            this.establecerEstados();
        });
        this.cargarComandos();
        this.on(discord_js_1.Events.InteractionCreate, async (interaction) => {
            if (!interaction.isChatInputCommand())
                return;
            try {
                const command = this.comandos.get(interaction.commandName);
                if (!command)
                    throw new Error(`No se ha encontrado ningun comando con el nombre: ${interaction.commandName}`);
                await command.execute(interaction);
            }
            catch (error) {
                const esErrorCritico = !(error instanceof ErrorGenerico_1.default) &&
                    !(error instanceof ErrorSinResultados_1.default) &&
                    !(error instanceof ErrorArgumentoInvalido_1.default) &&
                    !(error instanceof ErrorDemasiadasPeticiones_1.default);
                const embed = Embed_1.default.Crear()
                    .establecerColor(Embed_1.default.COLOR_ROJO);
                (!esErrorCritico) ?
                    embed.establecerDescripcion(error.message) :
                    embed.establecerDescripcion('Ha ocurrido un error. Inténtalo de nuevo más tarde.') && console.error('🟥 | ' + error.stack);
                try {
                    (!interaction.deferred && !interaction.replied) ?
                        interaction.reply({ embeds: [embed.obtenerDatos()] }) :
                        interaction.editReply({ embeds: [embed.obtenerDatos()] });
                }
                catch (error) {
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
                await Aniuser_1.default.findOneAndRemove({ serverId: member.guild.id, discordId: member.id });
                await this.cargarUsuarios();
            }
            catch (error) {
                console.error(error);
            }
        });
        this.login(token);
    }
    async obtenerUsuarioDiscord(id) {
        if (typeof id === 'number')
            id = id.toString();
        return await this.users.fetch(id);
    }
}
exports.default = Bot;
Bot.HORAS_EN_MILISEGUNDOS = 3600000;
