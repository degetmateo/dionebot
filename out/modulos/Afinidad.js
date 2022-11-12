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
exports.Afinidad = void 0;
var Usuarios_1 = require("./Usuarios");
var Afinidad = /** @class */ (function () {
    function Afinidad() {
    }
    Afinidad.FiltrarCompletados = function (listas) {
        return listas.find(function (lista) { return lista.status == "COMPLETED"; });
    };
    Afinidad.GetSharedMedia = function (l1, l2) {
        var sharedMedia = [];
        var _loop_1 = function (i) {
            var mediaID_1 = l1[i].mediaId;
            var mediaScore_1 = l1[i].score;
            if (mediaScore_1 == 0) {
                return "continue";
            }
            var media_2 = l2.find(function (e) { return e.mediaId == mediaID_1; });
            if (!media_2 || media_2.score == 0) {
                return "continue";
            }
            sharedMedia.push({ id: mediaID_1, scoreA: mediaScore_1, scoreB: media_2.score });
        };
        for (var i = 0; i < l1.length; i++) {
            _loop_1(i);
        }
        return sharedMedia;
    };
    /**
     * Método que calcula el coeficiente de correlación personal entre dos usuarios.
     * Basado en:
     * https://en.wikipedia.org/wiki/Pearson_correlation_coefficient
     * https://github.com/AlexanderColen/Annie-May-Discord-Bot/blob/default/Annie/Utility/AffinityUtility.cs
     * @param sharedMedia Arreglo con la media compartida por los dos usuarios.
     * @returns Porcentaje de la afinidad.
     */
    Afinidad.CalcularAfinidad = function (sharedMedia) {
        var scoresA = sharedMedia.map(function (media) { return media.scoreA; });
        var scoresB = sharedMedia.map(function (media) { return media.scoreB; });
        var ma = this.CalcularPromedioLista(scoresA);
        var mb = this.CalcularPromedioLista(scoresB);
        var am = scoresA.map(function (score) { return score - ma; });
        var bm = scoresB.map(function (score) { return score - mb; });
        var sa = am.map(function (x) { return Math.pow(x, 2); });
        var sb = bm.map(function (x) { return Math.pow(x, 2); });
        var numerador = this.SumarLista(this.zip(am, bm).map(function (tupla) { return tupla[0] * tupla[1]; }));
        var denominador = Math.sqrt(this.SumarLista(sa) * this.SumarLista(sb));
        return (denominador == 0 ? 0 : numerador / denominador) * 100;
    };
    Afinidad.OrdenarAfinidades = function (afinidades) {
        return afinidades.sort(function (a, b) {
            if (a.afinidad < b.afinidad) {
                return 1;
            }
            if (a.afinidad > b.afinidad) {
                return -1;
            }
            return 0;
        });
    };
    Afinidad.SumarLista = function (lista) {
        var suma = 0;
        for (var i = 0; i < lista.length; i++) {
            suma += lista[i];
        }
        return suma;
    };
    Afinidad.CalcularPromedioLista = function (lista) {
        return this.SumarLista(lista) / lista.length;
    };
    var _a;
    _a = Afinidad;
    Afinidad.GetAfinidadUsuario = function (user_1, uRegistrados) { return __awaiter(void 0, void 0, void 0, function () {
        var listaUsuario_1, animesUsuario_1, afinidades, i, datosUsuario, animesUsuario_2, sharedMedia, resultado;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Usuarios_1.Usuarios.GetEntradas(user_1.getNombre())];
                case 1:
                    listaUsuario_1 = _b.sent();
                    if (!listaUsuario_1) {
                        return [2 /*return*/, {
                                error: true,
                                message: "No se han encontrados entradas de ese usuario.",
                                afinidades: []
                            }];
                    }
                    animesUsuario_1 = this.FiltrarCompletados(listaUsuario_1.animeList.lists);
                    animesUsuario_1 = animesUsuario_1.entries;
                    if (!animesUsuario_1) {
                        return [2 /*return*/, {
                                error: true,
                                message: "",
                                afinidades: []
                            }];
                    }
                    afinidades = [];
                    i = 0;
                    _b.label = 2;
                case 2:
                    if (!(i < uRegistrados.length)) return [3 /*break*/, 4];
                    if (uRegistrados[i].anilistUsername == user_1.getNombre()) {
                        i++;
                        return [3 /*break*/, 2];
                    }
                    if (!uRegistrados[i].anilistUsername) {
                        i++;
                        return [3 /*break*/, 2];
                    }
                    return [4 /*yield*/, Usuarios_1.Usuarios.GetEntradasAnime(uRegistrados[i].anilistUsername)];
                case 3:
                    datosUsuario = _b.sent();
                    animesUsuario_2 = this.FiltrarCompletados(datosUsuario.animeList.lists);
                    animesUsuario_2 = animesUsuario_2.entries;
                    if (!animesUsuario_2) {
                        i++;
                        return [3 /*break*/, 2];
                    }
                    sharedMedia = this.GetSharedMedia(animesUsuario_1, animesUsuario_2);
                    resultado = this.CalcularAfinidad(sharedMedia);
                    afinidades.push({ username: uRegistrados[i].anilistUsername, afinidad: parseFloat(resultado.toFixed(2)) });
                    i++;
                    return [3 /*break*/, 2];
                case 4: return [2 /*return*/, {
                        error: false,
                        message: "",
                        afinidades: this.OrdenarAfinidades(afinidades)
                    }];
            }
        });
    }); };
    Afinidad.zip = function (a, b) { return a.map(function (k, i) { return [k, b[i]]; }); };
    return Afinidad;
}());
exports.Afinidad = Afinidad;
