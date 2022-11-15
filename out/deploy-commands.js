"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const discord_js_1 = require("discord.js");
const config_json_1 = require("./config.json");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const commands = [];
const commandFiles = fs_1.default.readdirSync(path_1.default.join(__dirname + "/commands/"));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data);
}
const token = process.env.TOKEN || "";
const rest = new discord_js_1.REST({ version: "10" }).setToken(token);
(async () => {
    try {
        console.log(`Comenzando a refrescar ${commands.length} comandos (/) de la aplicación.`);
        const data = await rest.put(discord_js_1.Routes.applicationCommands(config_json_1.clientId), { body: commands });
        console.log(`Se han refrescado exitosamente ${data.length} comandos.`);
    }
    catch (err) {
        console.log(err);
    }
})();
