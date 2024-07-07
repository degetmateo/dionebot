"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const package_json_1 = require("../../../package.json");
const postgres_1 = __importDefault(require("../database/postgres"));
class Bot extends discord_js_1.Client {
    constructor() {
        super({
            intents: [
                'Guilds',
                'GuildMembers',
            ]
        });
        this.loadCommands = () => {
            const directorioComandos = path_1.default.join(__dirname + "/commands/");
            const archivos = fs_1.default.readdirSync(directorioComandos);
            for (const archivo of archivos) {
                if (!archivo.endsWith('.ts') && !archivo.endsWith('.js'))
                    continue;
                const direccionArchivo = path_1.default.join(directorioComandos, archivo);
                const command = require(direccionArchivo);
                if (!command.execute || !command.data)
                    continue;
                this.commands.set(command.data.name, command);
            }
        };
        this.setStatusInterval = () => {
            const onlineStatus = [
                {
                    status: "online",
                    activities: [{
                            type: discord_js_1.ActivityType.Listening,
                            name: '/help'
                        }]
                },
                {
                    status: "online",
                    activities: [{
                            type: discord_js_1.ActivityType.Watching,
                            name: this.getServersAmount() + " servidores!"
                        }]
                }
            ];
            const maintenanceStatus = [
                {
                    status: "dnd",
                    activities: [{
                            type: discord_js_1.ActivityType.Custom,
                            name: '⚠️ Server is under maintenance...'
                        }]
                }
            ];
            let i = 0;
            setInterval(() => {
                const states = this.status === 'online' ? onlineStatus : maintenanceStatus;
                let presence = states[i];
                if (!presence) {
                    i = 0;
                    presence = states[i];
                }
                this.user.presence.set(presence);
                i++;
            }, 10000);
        };
        this.commands = new discord_js_1.Collection();
        this.cooldowns = new discord_js_1.Collection();
        this.version = package_json_1.version;
        this.status = 'online';
    }
    async start(token) {
        this.on("ready", () => {
            console.log("✅ | BOT iniciado.");
            this.setStatusInterval();
        });
        this.loadCommands();
        setInterval(async () => {
            const queryServer = await postgres_1.default.query() `
                SELECT * FROM discord_server;
            `;
            console.log(queryServer);
        }, Bot.HORA_EN_MILISEGUNDOS);
        this.loadEvents();
        try {
            await this.login(token);
        }
        catch (error) {
            console.error(error);
        }
    }
    loadEvents() {
        const eventsFolderPath = path_1.default.join(__dirname + '/events/');
        const eventsFolderFiles = fs_1.default.readdirSync(eventsFolderPath);
        for (const file of eventsFolderFiles) {
            if (!file.endsWith('.ts') && !file.endsWith('.js'))
                continue;
            const filePath = path_1.default.join(eventsFolderPath, file);
            const event = require(filePath);
            event(this);
        }
    }
    async fetchServer(id) {
        return await this.guilds.fetch(id);
    }
    async fetchUser(id) {
        return await this.users.fetch(id);
    }
    getServersAmount() {
        this.guilds.cache.each(server => {
            console.log(server.name);
        });
        return this.guilds.cache.size;
    }
    getVersion() {
        return this.version;
    }
    setStatus(status) {
        this.status = status;
    }
}
Bot.HORA_EN_MILISEGUNDOS = 3600000;
exports.default = Bot;
