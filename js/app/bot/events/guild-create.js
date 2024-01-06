"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ServerModel_1 = __importDefault(require("../../database/modelos/ServerModel"));
module.exports = (bot) => {
    bot.on('guildCreate', async (server) => {
        try {
            const newServer = new ServerModel_1.default({
                id: server.id,
                premium: false,
                users: []
            });
            await newServer.save();
        }
        catch (error) {
            console.error(error);
        }
    });
};
