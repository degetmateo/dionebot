"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ServerModel_1 = __importDefault(require("./modelos/ServerModel"));
const IllegalArgumentException_1 = __importDefault(require("../errors/IllegalArgumentException"));
class DB {
    async connect(url) {
        await mongoose_1.default.connect(url)
            .then(() => console.log("✅ | Base de datos iniciada."))
            .catch(err => console.error(err));
    }
    static async createServer(id) {
        const server = await ServerModel_1.default.findOne({ id });
        if (server)
            throw new IllegalArgumentException_1.default('Server already exists.');
        await new ServerModel_1.default({
            id,
            users: [],
            premium: false
        }).save();
    }
    static async removeServer(id) {
        await ServerModel_1.default.findOneAndDelete({ id });
    }
    static async createUser(serverId, discordId, anilistId) {
        let server = await ServerModel_1.default.findOne({ id: serverId });
        if (!server) {
            server = new ServerModel_1.default({
                id: serverId,
                users: [],
                premium: false
            });
        }
        server.users.push({ discordId, anilistId });
        await server.save();
    }
    static async removeUser(serverId, discordId) {
        const server = await ServerModel_1.default.findOne({ id: serverId });
        if (!server)
            throw new IllegalArgumentException_1.default('Server does not exist.');
        await ServerModel_1.default.updateOne({ id: serverId }, { $pull: { users: { discordId } } });
    }
}
exports.default = DB;
