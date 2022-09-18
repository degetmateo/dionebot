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
exports.UnsetupUsuario = void 0;
const AniUser_1 = require("../models/AniUser");
function UnsetupUsuario(bot, message) {
    return __awaiter(this, void 0, void 0, function* () {
        const uRegistrados = yield AniUser_1.AniUser.find({ serverId: message.guildId });
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
exports.UnsetupUsuario = UnsetupUsuario;
