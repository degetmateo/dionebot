"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const DB_1 = __importDefault(require("../../database/DB"));
module.exports = (bot) => {
    bot.on(discord_js_1.Events.GuildCreate, async (server) => {
        try {
            await DB_1.default.createServer(server.id);
            await bot.loadServers();
        }
        catch (error) {
            console.error(error);
        }
    });
};
