"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Aniuser_1 = __importDefault(require("../../database/modelos/Aniuser"));
module.exports = (bot) => {
    bot.on('guildMemberRemove', async (member) => {
        try {
            await Aniuser_1.default.findOneAndDelete({ serverId: member.guild.id, discordId: member.id });
            await bot.loadServers();
        }
        catch (error) {
            console.error(error);
        }
    });
};
