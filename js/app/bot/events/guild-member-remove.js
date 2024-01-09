"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const ServerModel_1 = __importDefault(require("../../database/modelos/ServerModel"));
module.exports = (bot) => {
    bot.on(discord_js_1.Events.GuildMemberRemove, async (member) => {
        try {
            await ServerModel_1.default.updateOne({ id: member.guild.id }, { $pull: { users: { discordId: member.id } } });
            await bot.loadServers();
        }
        catch (error) {
            console.error(error);
        }
    });
};
