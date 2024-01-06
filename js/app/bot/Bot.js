"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const package_json_1 = require("../../../package.json");
const ServerModel_1 = __importDefault(require("../database/modelos/ServerModel"));
const ServerCollection_1 = __importDefault(require("./collections/ServerCollection"));
class Bot extends discord_js_1.Client {
    constructor() {
        super({ intents: [] });
        this.loadCommands = () => {
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
                if (!comando.execute || !comando.data)
                    continue;
                this.commands.set(comando.data.name, comando);
            }
        };
        this.setStatusInterval = () => {
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
                                    name: this.getServersAmount() + " servidores!"
                                }]
                        });
                        break;
                }
            }, 5000);
        };
        this.loadServers = async () => {
            this.servers.empty();
            const servers = await ServerModel_1.default.find();
            servers.forEach(server => {
                this.servers.add({
                    id: server.id,
                    premium: server.premium,
                    users: server.users.toObject()
                });
            });
        };
        this.commands = new discord_js_1.Collection();
        this.cooldowns = new discord_js_1.Collection();
        this.servers = ServerCollection_1.default.Create();
        this.version = package_json_1.version;
    }
    async start(token) {
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
        }
        catch (error) {
            console.error(error);
        }
    }
    async fetchServer(id) {
        return await this.guilds.fetch(id);
    }
    async fetchUser(id) {
        return await this.users.fetch(id);
    }
    getServersAmount() {
        return this.guilds.cache.size;
    }
    getVersion() {
        return this.version;
    }
}
Bot.HORA_EN_MILISEGUNDOS = 3600000;
exports.default = Bot;
