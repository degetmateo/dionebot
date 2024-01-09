"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const ServerModel_1 = __importDefault(require("../../database/modelos/ServerModel"));
module.exports = (bot) => {
    bot.on(discord_js_1.Events.GuildCreate, async (server) => {
        try {
            const props = {
                id: server.id,
                premium: false,
                users: []
            };
            const newServer = new ServerModel_1.default(props);
            await newServer.save();
            bot.servers.add(props);
        }
        catch (error) {
            console.error(error);
        }
    });
};
