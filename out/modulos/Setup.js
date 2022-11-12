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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.Setup = void 0;
var Aniuser_1 = __importDefault(require("../modelos/Aniuser"));
var Usuario_1 = require("../objetos/Usuario");
var Usuarios_1 = require("./Usuarios");
var Setup = /** @class */ (function () {
    function Setup() {
    }
    Setup.SetupUsuario = function (username, message) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var usuario, _b, uRegistrados, uRegistrado, aniuser;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = Usuario_1.Usuario.bind;
                        return [4 /*yield*/, Usuarios_1.Usuarios.BuscarUsuario(message.guild == null ? "" : message.guild.id, username)];
                    case 1:
                        usuario = new (_b.apply(Usuario_1.Usuario, [void 0, _c.sent()]))();
                        if (!usuario)
                            return [2 /*return*/, false];
                        return [4 /*yield*/, Aniuser_1["default"].find({ serverId: message.guildId })];
                    case 2:
                        uRegistrados = _c.sent();
                        uRegistrado = uRegistrados.find(function (u) { return u.discordId == message.author.id; });
                        if (uRegistrado != null && uRegistrado != undefined)
                            return [2 /*return*/, false];
                        aniuser = new Aniuser_1["default"]();
                        aniuser.anilistUsername = usuario.getNombre();
                        aniuser.anilistId = usuario.getID();
                        aniuser.discordId = message.author.id;
                        aniuser.serverId = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.id;
                        aniuser.save(function (err) {
                            console.error(err);
                            return false;
                        });
                        return [2 /*return*/, true];
                }
            });
        });
    };
    Setup.UnsetupUsuario = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var uRegistrados, uRegistrado, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Aniuser_1["default"].find({ serverId: message.guildId })];
                    case 1:
                        uRegistrados = _a.sent();
                        uRegistrado = uRegistrados.find(function (u) { return u.discordId == message.author.id; });
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, (uRegistrado === null || uRegistrado === void 0 ? void 0 : uRegistrado["delete"]())];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 4:
                        err_1 = _a.sent();
                        console.error(err_1);
                        return [2 /*return*/, false];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return Setup;
}());
exports.Setup = Setup;
