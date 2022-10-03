"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Setup = void 0;
const User_1 = require("../modelos_db/User");
const Usuario_1 = require("../modelos/Usuario");
const Usuarios_1 = require("./Usuarios");
class Setup {
    static SetupUsuario(username, message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const usuario = new Usuario_1.Usuario(yield Usuarios_1.Usuarios.BuscarUsuario(message.guild == null ? "" : message.guild.id, username));
            if (!usuario)
                return false;
            let uRegistrados = yield User_1.User.find({ serverId: message.guildId });
            let uRegistrado = uRegistrados.find(u => u.discordId == message.author.id);
            if (uRegistrado != null && uRegistrado != undefined)
                return false;
            const aniuser = new User_1.User();
            aniuser.anilistUsername = usuario.getNombre();
            aniuser.anilistId = usuario.getID();
            aniuser.discordId = message.author.id;
            aniuser.serverId = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.id;
            aniuser.save(err => {
                console.error(err);
                return false;
            });
            return true;
        });
    }
    static UnsetupUsuario(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const uRegistrados = yield User_1.User.find({ serverId: message.guildId });
            const uRegistrado = uRegistrados.find(u => u.discordId == message.author.id);
            try {
                yield (uRegistrado === null || uRegistrado === void 0 ? void 0 : uRegistrado.delete());
                return true;
            }
            catch (err) {
                console.error(err);
                return false;
            }
        });
    }
}
exports.Setup = Setup;
