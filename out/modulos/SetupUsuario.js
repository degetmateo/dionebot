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
exports.SetupUsuario = void 0;
const AniUser_1 = require("../models/AniUser");
function SetupUsuario(bot, username, message) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const usuario = yield bot.usuario(username);
        if (!usuario)
            return false;
        let uRegistrados = yield AniUser_1.AniUser.find({ serverId: message.guildId });
        let uRegistrado = uRegistrados.find(u => u.discordId == message.author.id);
        if (uRegistrado != null && uRegistrado != undefined)
            return false;
        const aniuser = new AniUser_1.AniUser();
        aniuser.anilistUsername = usuario.getNombre();
        aniuser.anilistId = usuario.getID();
        aniuser.discordId = message.author.id;
        aniuser.serverId = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.id;
        aniuser.save((err) => {
            console.error(err);
            return false;
        });
        return true;
    });
}
exports.SetupUsuario = SetupUsuario;
