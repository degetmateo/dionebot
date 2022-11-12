"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Embeds = void 0;
var discord_js_1 = require("discord.js");
var toHex = __importStar(require("colornames"));
var Usuarios_1 = require("./Usuarios");
var Embeds = /** @class */ (function () {
    function Embeds() {
    }
    Embeds.EmbedInformacionUsuario = function (usuario) {
        var hexColor = toHex.get(usuario.getColorName()).value;
        var color = "0x" + hexColor;
        var stats = usuario.getEstadisticas();
        return new discord_js_1.EmbedBuilder()
            .setTitle(usuario.getNombre())
            .setURL(usuario.getURL())
            .setColor(color)
            .setThumbnail(usuario.getAvatarURL())
            .setImage(usuario.getBannerImage())
            .setDescription(usuario.getBio())
            .addFields({
            name: "Animes",
            value: "\u2023 Vistos: ".concat(stats.anime.count, "\n\u2023 Nota Promedio: ").concat(stats.anime.meanScore, "\n\u2023 D\u00EDas Vistos: ").concat(((stats.anime.minutesWatched / 60) / 24).toFixed(), "\n\u2023 Episodios Totales: ").concat(stats.anime.episodesWatched),
            inline: false
        }, {
            name: "Mangas",
            value: "\u2023 Le\u00EDdos: ".concat(stats.manga.count, "\n\u2023 Nota Promedio: ").concat(stats.manga.meanScore, "\n\u2023 Cap\u00EDtulos Le\u00EDdos: ").concat(stats.manga.chaptersRead, "\n\u2023 Vol\u00FAmenes Le\u00EDdos: ").concat(stats.manga.volumesRead),
            inline: false
        });
    };
    Embeds.EmbedInformacionHelp = function () {
        var descripcion = "▹ `!setup [anilist username]` - Guardar tu usuario de anilist para mostrar tus notas.\n▹ `!unsetup` - Elimina tu usuario de anilist.\n▹ `!user | [anilist username] | [discord mention]` - Ver la información del perfil de anilist de un usuario.\n▹ `!afinidad | [anilist username] | [discord mention]` - Muestra tu afinidad o la otro usuario con el resto del servidor.\n▹ `!manga o !anime [nombre] | [id]` - Muestra la información de un anime o manga.\n▹ `!mangab o !animeb [nombre] | [id]` - Lo mismo pero con la descripción traducida.\n▹ `!color [HEX CODE]` - Te da un rol con el color del código hexadecimal que pongas.";
        return new discord_js_1.EmbedBuilder()
            .setTitle("▾ Comandos")
            .setDescription(descripcion.trim());
    };
    Embeds.EmbedImagen = function (url) {
        return new discord_js_1.EmbedBuilder()
            .setImage(url)
            .setFooter({ text: "..." });
    };
    Embeds.EmbedInformacionMedia = function (message, obra, traducir) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var titulos, EmbedInformacion, _b, _c, _d, infoTEXT_1, infoTEXT_2, infoTEXT_1, infoTEXT_2, estudiosInfo, estudios, i, generosInfo, generos, i, uMedia, completedTEXT, inProgressTEXT, droppedTEXT, pausedListTEXT, planningTEXT, i;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        titulos = obra.getTitulos();
                        _c = (_b = new discord_js_1.EmbedBuilder()
                            .setTitle(titulos.romaji == null ? titulos.native : titulos.romaji)
                            .setURL(obra.getURL()))
                            .setDescription;
                        if (!(traducir == true)) return [3 /*break*/, 2];
                        return [4 /*yield*/, obra.getDescripcionTraducida()];
                    case 1:
                        _d = _e.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _d = obra.getDescripcion();
                        _e.label = 3;
                    case 3:
                        EmbedInformacion = _c.apply(_b, [_d])
                            .setThumbnail(obra.getCoverImageURL())
                            .setFooter({ text: obra.getTitulos().native + " | " + obra.getTitulos().english })
                            .setColor(obra.getColorEstado());
                        if (obra.getTipo() == "ANIME") {
                            infoTEXT_1 = "\n                \u2023 **Tipo**: ".concat(obra.getTipo(), "\n\u2023 **Formato**: ").concat(obra.getFormato(), "\n\u2023 **Estado**: ").concat(obra.getEstado(), "\n\u2023 **Calificaci\u00F3n**: ").concat(obra.getPromedio(), "/100\n            ");
                            infoTEXT_2 = "\n                \u2023 **Popularidad**: ".concat(obra.getPopularidad(), "\n\u2023 **Favoritos**: ").concat(obra.getFavoritos(), "\n\u2023 **Temporada**: ").concat(obra.getTemporada(), "\n\u2023 **A\u00F1o de Emisi\u00F3n**: ").concat(obra.getAnioEmision(), "\n\u2023 **Episodios**: ").concat(obra.getEpisodios(), "\n            ");
                            EmbedInformacion
                                .addFields({ name: "▽", value: infoTEXT_1, inline: true }, { name: "▽", value: infoTEXT_2, inline: true });
                        }
                        else {
                            infoTEXT_1 = "\n                \u2023 **Tipo**: ".concat(obra.getTipo(), "\n\u2023 **Formato**: ").concat(obra.getFormato(), "\n\u2023 **Estado**: ").concat(obra.getEstado(), "\n\u2023 **Calificaci\u00F3n**: ").concat(obra.getPromedio(), "/100\n            ");
                            infoTEXT_2 = "\n                \u2023 **Popularidad**: ".concat(obra.getPopularidad(), "\n\u2023 **Favoritos**: ").concat(obra.getFavoritos(), "\n\u2023 **Cap\u00EDtulos**: ").concat(obra.getCapitulos(), "\n\u2023 **Vol\u00FAmenes**: ").concat(obra.getVolumenes(), "\n            ");
                            EmbedInformacion
                                .addFields({ name: "▽", value: infoTEXT_1, inline: true }, { name: "▽", value: infoTEXT_2, inline: true });
                        }
                        estudiosInfo = "";
                        estudios = obra.getEstudios();
                        for (i = 0; i < estudios.length; i++) {
                            estudiosInfo += "`" + estudios[i].name + "` - ";
                        }
                        estudiosInfo = estudiosInfo.substring(0, estudiosInfo.length - 3);
                        if (!estudiosInfo || estudiosInfo.length < 0)
                            estudiosInfo = "`Desconocidos`";
                        if (obra.getTipo() == "ANIME") {
                            EmbedInformacion
                                .addFields({ name: "▿ Estudios", value: estudiosInfo, inline: false });
                        }
                        generosInfo = "";
                        generos = obra.getGeneros();
                        for (i = 0; i < generos.length; i++) {
                            generosInfo += "`" + generos[i] + "` - ";
                        }
                        generosInfo = generosInfo.substring(0, generosInfo.length - 3);
                        if (!generosInfo || generosInfo.length < 0)
                            generosInfo = "`Desconocidos`";
                        EmbedInformacion
                            .addFields({ name: "▿ Géneros", value: generosInfo, inline: false });
                        return [4 /*yield*/, Usuarios_1.Usuarios.GetUsuariosMedia((_a = message.guild) === null || _a === void 0 ? void 0 : _a.id, obra)];
                    case 4:
                        uMedia = _e.sent();
                        if (uMedia.length > 0) {
                            completedTEXT = "";
                            inProgressTEXT = "";
                            droppedTEXT = "";
                            pausedListTEXT = "";
                            planningTEXT = "";
                            for (i = 0; i < uMedia.length; i++) {
                                if (uMedia[i].status == "COMPLETED") {
                                    completedTEXT += "".concat(uMedia[i].name, " **[").concat(uMedia[i].score, "]** - ");
                                }
                                if (uMedia[i].status == "DROPPED") {
                                    droppedTEXT += "".concat(uMedia[i].name, " **(").concat(uMedia[i].progress, ")** **[").concat(uMedia[i].score, "]** - ");
                                }
                                if (uMedia[i].status == "CURRENT") {
                                    inProgressTEXT += "".concat(uMedia[i].name, " **(").concat(uMedia[i].progress, ")** **[").concat(uMedia[i].score, "]** - ");
                                }
                                if (uMedia[i].status == "PAUSED") {
                                    pausedListTEXT += "".concat(uMedia[i].name, " **(").concat(uMedia[i].progress, ")** **[").concat(uMedia[i].score, "]** - ");
                                }
                                if (uMedia[i].status == "PLANNING") {
                                    planningTEXT += "".concat(uMedia[i].name, " - ");
                                }
                            }
                            if (completedTEXT.trim().endsWith("-")) {
                                completedTEXT = completedTEXT.substring(0, completedTEXT.length - 2);
                            }
                            if (droppedTEXT.trim().endsWith("-")) {
                                droppedTEXT = droppedTEXT.substring(0, droppedTEXT.length - 2);
                            }
                            if (inProgressTEXT.trim().endsWith("-")) {
                                inProgressTEXT = inProgressTEXT.substring(0, inProgressTEXT.length - 2);
                            }
                            if (pausedListTEXT.trim().endsWith("-")) {
                                pausedListTEXT = pausedListTEXT.substring(0, pausedListTEXT.length - 2);
                            }
                            if (planningTEXT.trim().endsWith("-")) {
                                planningTEXT = planningTEXT.substring(0, planningTEXT.length - 2);
                            }
                            if (completedTEXT.trim().length > 0) {
                                EmbedInformacion
                                    .addFields({ name: "▿ Completado por", value: completedTEXT, inline: false });
                            }
                            if (inProgressTEXT.trim().length > 0) {
                                EmbedInformacion
                                    .addFields({ name: "▿ Iniciado por", value: inProgressTEXT, inline: false });
                            }
                            if (pausedListTEXT.trim().length > 0) {
                                EmbedInformacion
                                    .addFields({ name: "▿ Pausado por", value: pausedListTEXT, inline: false });
                            }
                            if (planningTEXT.trim().length > 0) {
                                EmbedInformacion
                                    .addFields({ name: "▿ Planeado por", value: planningTEXT, inline: false });
                            }
                            if (droppedTEXT.trim().length > 0) {
                                EmbedInformacion
                                    .addFields({ name: "▿ Dropeado por", value: droppedTEXT, inline: false });
                            }
                        }
                        return [2 /*return*/, EmbedInformacion];
                }
            });
        });
    };
    Embeds.EmbedAfinidad = function (usuario, afinidades) {
        var textoAfinidad = "";
        for (var i = 0; i < afinidades.length && i < 10; i++) {
            textoAfinidad += "\u25B9 ".concat(afinidades[i].username, " - **").concat(afinidades[i].afinidad, "%**\n");
        }
        var hexColor = toHex.get(usuario == null ? "black" : usuario.getColorName()).value;
        var color = "0x" + hexColor;
        return new discord_js_1.EmbedBuilder()
            .setTitle("Afinidad de " + usuario.getNombre())
            .setThumbnail(usuario.getAvatarURL())
            .setDescription(textoAfinidad)
            .setColor(color);
    };
    return Embeds;
}());
exports.Embeds = Embeds;
