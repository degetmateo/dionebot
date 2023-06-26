"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Aniuser_1 = __importDefault(require("./modelos/Aniuser"));
class BOT extends discord_js_1.Client {
    constructor() {
        super({
            intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildMessages, discord_js_1.GatewayIntentBits.MessageContent],
            presence: {
                status: "online",
                activities: [{
                        name: "/help",
                        type: discord_js_1.ActivityType.Listening
                    }]
            }
        });
        this.loadCommands = () => {
            const commandsPath = path_1.default.join(__dirname + "/comandos/");
            const commandsFiles = fs_1.default.readdirSync(commandsPath);
            for (const file of commandsFiles) {
                const filePath = path_1.default.join(commandsPath, file);
                const command = require(filePath);
                if ("data" in command && "execute" in command) {
                    this.comandos.set(command.data.name, command);
                }
                else {
                    console.log(`[WARNING] The command at ${filePath} is missing required "data" or "execute" property.`);
                }
            }
        };
        this.insertarUsuario = (usuario) => {
            this.usuarios.push(usuario);
        };
        this.eliminarUsuario = (serverId, userId) => {
            this.usuarios = this.usuarios.filter(u => u.serverId != serverId && u.discordId != userId);
        };
        this.existeUsuario = (usuario) => {
            for (let i = 0; i < this.usuarios.length; i++) {
                const cond = this.usuarios[i].serverId === (usuario === null || usuario === void 0 ? void 0 : usuario.serverId) && this.usuarios[i].discordId === usuario.discordId;
                if (cond)
                    return true;
            }
            return false;
        };
        this.getUsuario = (usuario) => {
            return this.usuarios.find(u => u.serverId === (usuario === null || usuario === void 0 ? void 0 : usuario.serverId) && u.discordId === usuario.discordId);
        };
        this.getUsuariosRegistrados = (serverID) => {
            return this.usuarios.filter(u => u.serverId === serverID);
        };
        this.loadUsers = async () => {
            const aniusers = await Aniuser_1.default.find();
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
        };
        this.isGettingAfinitty = (serverID) => {
            return this.buscando_afinidad.has(serverID);
        };
        this.isSearchingMedia = (serverID) => {
            return this.buscando_media.has(serverID);
        };
        this.setGettingAffinity = (serverID, buscando) => {
            buscando ?
                this.buscando_afinidad.add(serverID) :
                this.buscando_afinidad.delete(serverID);
        };
        this.setSearchingMedia = (serverID, buscando) => {
            buscando ?
                this.buscando_media.add(serverID) :
                this.buscando_media.delete(serverID);
        };
        this.comandos = new discord_js_1.Collection();
        this.buscando_afinidad = new Set();
        this.buscando_media = new Set();
        this.usuarios = new Array();
    }
    async iniciar(token) {
        this.on("ready", () => {
            console.log("BOT preparado!");
        });
        await this.loadUsers();
        setInterval(async () => {
            await this.loadUsers();
        }, 300000);
        this.loadCommands();
        this.on(discord_js_1.Events.InteractionCreate, async (interaction) => {
            if (!interaction.isChatInputCommand())
                return;
            if (!interaction)
                return;
            if (!interaction.user)
                return;
            if (!interaction.guild)
                return;
            if (!interaction.guild.id)
                return;
            const command = this.comandos.get(interaction.commandName);
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
            try {
                await command.execute(interaction);
            }
            catch (err) {
                const error = err;
                console.error(error);
                if (!interaction)
                    return;
                if (interaction.replied) {
                    interaction.editReply({ content: "Ha ocurrido un error inesperado. Inténtalo de nuevo más tarde." })
                        .catch(err => console.error(err));
                }
                else {
                    interaction.reply({ content: "Ha ocurrido un error inesperado. Inténtalo de nuevo más tarde.", ephemeral: true })
                        .catch(err => console.error(err));
                }
            }
        });
        this.login(token);
    }
}
exports.default = BOT;
