"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
// import postgres from 'postgres';
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const package_json_1 = require("../../../package.json");
const ServerModel_1 = __importDefault(require("../database/modelos/ServerModel"));
const ServerCollection_1 = __importDefault(require("./collections/ServerCollection"));
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
        this.status = 'online';
    }
    async start(token) {
        this.on("ready", () => {
            console.log("✅ | BOT iniciado.");
            this.setStatusInterval();
        });
        // this.sql();
        this.loadCommands();
        await this.loadServers();
        setInterval(async () => {
            await this.loadServers();
        }, Bot.HORA_EN_MILISEGUNDOS);
        this.loadEvents();
        try {
            await this.login(token);
        }
        catch (error) {
            console.error(error);
        }
    }
    // private sql () {
    //     console.log('sql start')
    //     const db = postgres ({
    //         host: 'localhost',
    //         port: 5432,
    //         database: 'dione_db',
    //         username: 'postgres',
    //         password: 'password'
    //     });
    //     console.log('sql connection')
    //     this.on(Events.MessageCreate, async message => {
    //         console.log('message created');
    //         await db `
    //             insert into discord_user values (
    //                 ${parseInt(message.author.id)},
    //                 ${parseInt(message.guildId)},
    //                 0
    //             );
    //         `;
    //         await db`
    //             update
    //                 discord_server
    //             set
    //                 user_count = user_count + 1
    //             where
    //                 id_server = ${parseInt(message.guildId)};
    //         `;
    //     })
    //     console.log('sql end')
    // }
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
