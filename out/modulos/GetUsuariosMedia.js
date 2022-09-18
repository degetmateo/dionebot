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
exports.GetUsuariosMedia = void 0;
const AniUser_1 = require("../models/AniUser");
function GetUsuariosMedia(bot, serverID, media) {
    return __awaiter(this, void 0, void 0, function* () {
        const uRegistrados = yield AniUser_1.AniUser.find({ serverId: serverID });
        const uMedia = [];
        for (let i = 0; i < uRegistrados.length; i++) {
            const uLista = yield bot.buscarMediaUsuario(uRegistrados[i].anilistId, media.getID());
            if (uLista != null) {
                uLista.username = uRegistrados[i].anilistUsername;
                uLista.discordId = uRegistrados[i].discordId;
                uMedia.push(uLista);
            }
        }
        const uMapeados = [];
        for (let i = 0; i < uMedia.length; i++) {
            if (parseFloat(uMedia[i].score.toString()) <= 10) {
                uMedia[i].score = parseFloat((uMedia[i].score * 10).toString());
            }
            const u = {
                name: uMedia[i].username,
                status: uMedia[i].status,
                progress: uMedia[i].progress,
                score: parseFloat(uMedia[i].score.toString())
            };
            uMapeados.push(u);
        }
        return uMapeados;
    });
}
exports.GetUsuariosMedia = GetUsuariosMedia;
