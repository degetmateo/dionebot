"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ServerModel_1 = __importDefault(require("./modelos/ServerModel"));
const IllegalArgumentException_1 = __importDefault(require("../errors/IllegalArgumentException"));
class DB {
    static async connect(url) {
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
    static async serverExists(id) {
        const server = await ServerModel_1.default.findOne({ id });
        return server ? true : false;
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
        if (server.users.find(u => u.discordId === discordId))
            throw new IllegalArgumentException_1.default('El usuario ya se encuentra registrado en este servidor.');
        server.users.push({ discordId, anilistId });
        await server.save();
    }
    static async removeUser(serverId, discordId) {
        const server = await ServerModel_1.default.findOne({ id: serverId });
        if (!server)
            throw new IllegalArgumentException_1.default('No hay ningun usuario registrado en este servidor.');
        await ServerModel_1.default.updateOne({ id: serverId }, { $pull: { users: { discordId } } });
    }
    static async userExists(serverId, discordId) {
        const server = await ServerModel_1.default.findOne({ id: serverId });
        if (!server)
            return false;
        const user = server.users.find(serverUser => serverUser.discordId === discordId);
        return user ? true : false;
    }
}
exports.default = DB;
