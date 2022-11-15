"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Setup = void 0;
const Aniuser_1 = __importDefault(require("../modelos/Aniuser"));
const Usuario_1 = require("../objetos/Usuario");
const Usuarios_1 = require("./Usuarios");
class Setup {
    static async SetupUsuario(username, serverID, discordID) {
        let uRegistrados = await Aniuser_1.default.find({ serverId: serverID });
        let uRegistrado = uRegistrados.find(u => u.discordId == discordID);
        if (uRegistrado)
            return false;
        let usuario = await Usuarios_1.Usuarios.BuscarUsuario(serverID, username);
        if (!usuario)
            return false;
        usuario = new Usuario_1.Usuario(usuario);
        const aniuser = new Aniuser_1.default();
        aniuser.anilistUsername = usuario.getNombre();
        aniuser.anilistId = usuario.getID();
        aniuser.discordId = discordID;
        aniuser.serverId = serverID;
        aniuser.save(err => {
            console.error(err);
            return false;
        });
        return true;
    }
    static async UnsetupUsuario(serverID, userID) {
        const uRegistrados = await Aniuser_1.default.find({ serverId: serverID });
        const uRegistrado = uRegistrados.find(u => u.discordId == userID);
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
