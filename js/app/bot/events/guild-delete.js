"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const ServerModel_1 = __importDefault(require("../../database/modelos/ServerModel"));
module.exports = (bot) => {
    bot.on(discord_js_1.Events.GuildDelete, async (server) => {
        try {
            await ServerModel_1.default.findOneAndDelete({ id: server.id });
            await bot.loadServers();
        }
        catch (error) {
            console.error(error);
        }
    });
};
