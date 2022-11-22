"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Setup = void 0;
const Aniuser_1 = __importDefault(require("../modelos/Aniuser"));
class Setup {
    static async SetupUsuario(usuario, serverID, discordID) {
        const aniuser = new Aniuser_1.default();
        aniuser.anilistUsername = usuario.getNombre();
        aniuser.anilistId = usuario.getID();
        aniuser.discordId = discordID;
        aniuser.serverId = serverID;
        try {
            await aniuser.save();
            return true;
        }
        catch (err) {
            console.error(err);
            return false;
        }
    }
    static async UnsetupUsuario(serverID, userID) {
        const uRegistrado = await Aniuser_1.default.findOne({ serverId: serverID, discordId: userID });
        try {
            await (uRegistrado === null || uRegistrado === void 0 ? void 0 : uRegistrado.delete());
            return true;
        }
        catch (err) {
            console.error(err);
            return false;
        }
    }
}
exports.Setup = Setup;
