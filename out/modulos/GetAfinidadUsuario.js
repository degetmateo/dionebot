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
exports.GetAfinidadUsuario = void 0;
function GetAfinidadUsuario(bot, aniuser1, uRegistrados) {
    return __awaiter(this, void 0, void 0, function* () {
        const userList1 = yield bot.buscarListaUsuario(aniuser1 === null || aniuser1 === void 0 ? void 0 : aniuser1.getNombre());
        const user1AnimeList = userList1.animeList.lists[0].entries;
        let afinidades = [];
        let i = 0;
        while (i < uRegistrados.length) {
            if (uRegistrados[i].anilistUsername == aniuser1.getNombre()) {
                i++;
                continue;
            }
            const aniuser2 = yield bot.usuario(uRegistrados[i].anilistUsername || "");
            const userList2 = yield bot.buscarListaUsuario(aniuser2 === null || aniuser2 === void 0 ? void 0 : aniuser2.getNombre());
            const user2AnimeList = userList2.animeList.lists[0].entries;
            const resultado = yield bot.calcularAfinidad(user1AnimeList, user2AnimeList);
            afinidades.push({ username: aniuser2 === null || aniuser2 === void 0 ? void 0 : aniuser2.getNombre(), afinidad: resultado });
            i++;
        }
        return afinidades;
    });
}
exports.GetAfinidadUsuario = GetAfinidadUsuario;
