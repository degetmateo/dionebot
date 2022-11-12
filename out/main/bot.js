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
var discord_js_1 = require("discord.js");
var Obra_1 = require("../objetos/Obra");
var Usuario_1 = require("../objetos/Usuario");
var Database_1 = require("./Database");
var Aniuser_1 = __importDefault(require("../modelos/Aniuser"));
var Mensaje_1 = require("../objetos/Mensaje");
var Media_1 = require("../modulos/Media");
var Usuarios_1 = require("../modulos/Usuarios");
var Afinidad_1 = require("../modulos/Afinidad");
var Setup_1 = require("../modulos/Setup");
var Embeds_1 = require("../modulos/Embeds");
var BOT = /** @class */ (function () {
    function BOT() {
        var _this = this;
        this.getServerCount = function () { return _this.client.guilds.cache.size; };
        this.on = function (event, func) {
            _this.client.on(event, func);
        };
        this.color = function (message, colorCode) { return __awaiter(_this, void 0, void 0, function () {
            var colorRoleCode, color, waitingReaction, memberColorRole, guildColorRole, newRole, newMemberRole;
            var _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        if (!colorCode || colorCode.trim() == "" || colorCode.trim().length <= 0)
                            return [2 /*return*/, message.react("❌")];
                        colorRoleCode = "0x" + (colorCode.split("#").join(""));
                        color = colorRoleCode;
                        if (!color) {
                            message.react("❌");
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, message.react("🔄")];
                    case 1:
                        waitingReaction = _g.sent();
                        memberColorRole = (_a = message.member) === null || _a === void 0 ? void 0 : _a.roles.cache.find(function (r) { var _a; return r.name === ((_a = message.member) === null || _a === void 0 ? void 0 : _a.user.username); });
                        if (!!memberColorRole) return [3 /*break*/, 5];
                        guildColorRole = (_b = message.guild) === null || _b === void 0 ? void 0 : _b.roles.cache.find(function (r) { var _a; return r.name === ((_a = message.member) === null || _a === void 0 ? void 0 : _a.user.username); });
                        if (!!guildColorRole) return [3 /*break*/, 3];
                        return [4 /*yield*/, ((_c = message.guild) === null || _c === void 0 ? void 0 : _c.roles.create({
                                name: (_d = message.member) === null || _d === void 0 ? void 0 : _d.user.username,
                                color: color
                            }))];
                    case 2:
                        newRole = _g.sent();
                        if (!newRole) {
                            waitingReaction.remove();
                            message.react("❌");
                            return [2 /*return*/];
                        }
                        (_e = message.member) === null || _e === void 0 ? void 0 : _e.roles.add(newRole);
                        return [3 /*break*/, 4];
                    case 3:
                        guildColorRole.setColor(color);
                        (_f = message.member) === null || _f === void 0 ? void 0 : _f.roles.add(guildColorRole);
                        _g.label = 4;
                    case 4: return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, memberColorRole.setColor(color)];
                    case 6:
                        newMemberRole = _g.sent();
                        if (!newMemberRole) {
                            waitingReaction.remove();
                            message.react("❌");
                            return [2 /*return*/];
                        }
                        _g.label = 7;
                    case 7: return [2 /*return*/, message.react("✅")];
                }
            });
        }); };
        this.user = function (message, args) { return __awaiter(_this, void 0, void 0, function () {
            var usuario, serverID, reaccionEspera, usuarioMencionado, embed;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        serverID = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.id;
                        if (!serverID) {
                            message.react("❌");
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, message.react("🔄")];
                    case 1:
                        reaccionEspera = _c.sent();
                        if (!(!args || args.length <= 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.usuario(message.guild.id, message.author.id)];
                    case 2:
                        usuario = _c.sent();
                        return [3 /*break*/, 7];
                    case 3:
                        usuarioMencionado = (_b = message.mentions.members) === null || _b === void 0 ? void 0 : _b.first();
                        if (!usuarioMencionado) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.usuario(message.guild.id, usuarioMencionado.id)];
                    case 4:
                        usuario = _c.sent();
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, this.usuario(message.guild.id, args)];
                    case 6:
                        usuario = _c.sent();
                        _c.label = 7;
                    case 7:
                        if (!usuario) {
                            reaccionEspera.remove();
                            return [2 /*return*/, message.react("❌")];
                        }
                        embed = Embeds_1.Embeds.EmbedInformacionUsuario(usuario);
                        reaccionEspera.remove();
                        message.react("✅");
                        this.enviarEmbed(message, embed);
                        return [2 /*return*/];
                }
            });
        }); };
        this.obra = function (message, tipo, args, traducir) { return __awaiter(_this, void 0, void 0, function () {
            var serverID, reaccionEspera, media, embedInformacion;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        serverID = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.id;
                        if (!serverID) {
                            message.react("❌");
                            return [2 /*return*/];
                        }
                        if (this.estaBuscandoMedia(serverID)) {
                            message.react("⛔");
                            return [2 /*return*/];
                        }
                        this.setBuscandoMedia(serverID, true);
                        return [4 /*yield*/, message.react("🔄")];
                    case 1:
                        reaccionEspera = _b.sent();
                        return [4 /*yield*/, this.buscarMedia(tipo, args.join(" "))];
                    case 2:
                        media = _b.sent();
                        if (!media) {
                            reaccionEspera.remove();
                            message.react("❌");
                            this.setBuscandoMedia(serverID, false);
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, Embeds_1.Embeds.EmbedInformacionMedia(message, media, traducir)];
                    case 3:
                        embedInformacion = _b.sent();
                        reaccionEspera.remove();
                        message.react("✅");
                        this.enviarEmbed(message, embedInformacion);
                        this.setBuscandoMedia(serverID, false);
                        return [2 /*return*/];
                }
            });
        }); };
        this.estaBuscandoAfinidad = function (serverID) {
            return _this.buscando_afinidad.includes(serverID);
        };
        this.estaBuscandoMedia = function (serverID) {
            return _this.buscando_media.includes(serverID);
        };
        this.setBuscandoAfinidad = function (serverID, buscando) {
            buscando ?
                _this.buscando_afinidad.push(serverID) :
                _this.buscando_afinidad = _this.eliminarElementoArreglo(_this.buscando_afinidad, serverID);
        };
        this.setBuscandoMedia = function (serverID, buscando) {
            buscando ?
                _this.buscando_media.push(serverID) :
                _this.buscando_media = _this.eliminarElementoArreglo(_this.buscando_media, serverID);
        };
        this.eliminarElementoArreglo = function (arreglo, elemento) {
            return arreglo.filter(function (e) { return e != elemento; });
        };
        this.afinidad = function (message, args) { return __awaiter(_this, void 0, void 0, function () {
            var serverID, waitingReaction, userID, uMencionado, username, user, uRegistrados, usuario, aniuser1, resultado;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        serverID = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.id;
                        if (!serverID)
                            return [2 /*return*/];
                        if (this.estaBuscandoAfinidad(serverID)) {
                            return [2 /*return*/, message.react("⛔")];
                        }
                        this.setBuscandoAfinidad(serverID, true);
                        return [4 /*yield*/, message.react("🔄")];
                    case 1:
                        waitingReaction = _d.sent();
                        if (!serverID) {
                            this.setBuscandoAfinidad(serverID, false);
                            waitingReaction.remove();
                            return [2 /*return*/, message.react("❌")];
                        }
                        if (!!args[0]) return [3 /*break*/, 2];
                        userID = message.author.id;
                        return [3 /*break*/, 5];
                    case 2:
                        if (!((_b = message.mentions.members) === null || _b === void 0 ? void 0 : _b.first())) return [3 /*break*/, 3];
                        uMencionado = (_c = message.mentions.members) === null || _c === void 0 ? void 0 : _c.first();
                        if (!uMencionado) {
                            this.setBuscandoAfinidad(serverID, false);
                            waitingReaction.remove();
                            return [2 /*return*/, message.react("❌")];
                        }
                        userID = uMencionado.id;
                        return [3 /*break*/, 5];
                    case 3:
                        username = args[0];
                        return [4 /*yield*/, Aniuser_1["default"].findOne({ anilistUsername: username })];
                    case 4:
                        user = _d.sent();
                        if (!user) {
                            this.setBuscandoAfinidad(serverID, false);
                            waitingReaction.remove();
                            return [2 /*return*/, message.react("❌")];
                        }
                        if (!(user === null || user === void 0 ? void 0 : user.discordId)) {
                            this.setBuscandoAfinidad(serverID, false);
                            waitingReaction.remove();
                            return [2 /*return*/, message.react("❌")];
                        }
                        userID = user.discordId;
                        _d.label = 5;
                    case 5: return [4 /*yield*/, Aniuser_1["default"].find({ serverId: serverID })];
                    case 6:
                        uRegistrados = _d.sent();
                        usuario = uRegistrados.find(function (u) { return u.discordId == userID; });
                        if (!usuario) {
                            this.setBuscandoAfinidad(serverID, false);
                            waitingReaction.remove();
                            return [2 /*return*/, message.react("❌")];
                        }
                        if (!usuario.anilistUsername) {
                            this.setBuscandoAfinidad(serverID, false);
                            waitingReaction.remove();
                            return [2 /*return*/, message.react("❌")];
                        }
                        return [4 /*yield*/, this.usuario(serverID, usuario.anilistUsername)];
                    case 7:
                        aniuser1 = _d.sent();
                        if (!aniuser1) {
                            this.setBuscandoAfinidad(serverID, false);
                            waitingReaction.remove();
                            return [2 /*return*/, message.react("❌")];
                        }
                        return [4 /*yield*/, Afinidad_1.Afinidad.GetAfinidadUsuario(aniuser1, uRegistrados)];
                    case 8:
                        resultado = _d.sent();
                        if (resultado.error) {
                            this.setBuscandoAfinidad(serverID, false);
                            waitingReaction.remove();
                            return [2 /*return*/, message.react("❌")];
                        }
                        this.enviarEmbed(message, Embeds_1.Embeds.EmbedAfinidad(aniuser1, resultado.afinidades));
                        this.setBuscandoAfinidad(serverID, false);
                        waitingReaction.remove();
                        message.react("✅");
                        return [2 /*return*/];
                }
            });
        }); };
        this.ruleta = function (message) { return __awaiter(_this, void 0, void 0, function () {
            var number, ImagenCargando, ImagenDisparo, ImagenFallo, EmbedImagenCargando, EmbedImagenDisparo, EmbedImagenFallo, embedActual;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        number = Math.floor(Math.random() * 6);
                        ImagenCargando = "https://media.discordapp.net/attachments/712773186336456766/1040413408199180328/ruletaCargando.gif";
                        ImagenDisparo = "https://media.discordapp.net/attachments/712773186336456766/1040418304797462568/ruletaDisparo.gif";
                        ImagenFallo = "https://media.discordapp.net/attachments/712773186336456766/1040418327052423288/ruletaFallogif.gif";
                        EmbedImagenCargando = new discord_js_1.EmbedBuilder()
                            .setImage(ImagenCargando)
                            .setFooter({ text: "..." });
                        EmbedImagenDisparo = new discord_js_1.EmbedBuilder()
                            .setImage(ImagenDisparo);
                        EmbedImagenFallo = new discord_js_1.EmbedBuilder()
                            .setImage(ImagenFallo)
                            .setFooter({ text: "Uf..." });
                        return [4 /*yield*/, message.reply({ embeds: [EmbedImagenCargando] })];
                    case 1:
                        embedActual = _a.sent();
                        setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                            var channel, invite, _a, _b;
                            var _c, _d;
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0:
                                        if (!(number === 1)) return [3 /*break*/, 9];
                                        return [4 /*yield*/, message.channel.fetch()];
                                    case 1:
                                        channel = _e.sent();
                                        if (!(channel.type === discord_js_1.ChannelType.GuildText)) return [3 /*break*/, 3];
                                        return [4 /*yield*/, channel.createInvite()];
                                    case 2:
                                        _a = _e.sent();
                                        return [3 /*break*/, 4];
                                    case 3:
                                        _a = null;
                                        _e.label = 4;
                                    case 4:
                                        invite = _a;
                                        return [4 /*yield*/, embedActual.edit({ embeds: [EmbedImagenDisparo] })];
                                    case 5:
                                        _e.sent();
                                        if (!invite) return [3 /*break*/, 7];
                                        return [4 /*yield*/, ((_c = message.member) === null || _c === void 0 ? void 0 : _c.user.send(invite.url))];
                                    case 6:
                                        _b = _e.sent();
                                        return [3 /*break*/, 8];
                                    case 7:
                                        _b = null;
                                        _e.label = 8;
                                    case 8:
                                        _b;
                                        (_d = message.member) === null || _d === void 0 ? void 0 : _d.kick();
                                        return [3 /*break*/, 10];
                                    case 9:
                                        embedActual.edit({ embeds: [EmbedImagenFallo] });
                                        _e.label = 10;
                                    case 10: return [2 /*return*/];
                                }
                            });
                        }); }, 1700);
                        return [2 /*return*/];
                }
            });
        }); };
        this.client = new discord_js_1.Client({
            intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildMessages, discord_js_1.GatewayIntentBits.MessageContent]
        });
        this.db = new Database_1.DB();
        this.buscando_afinidad = new Array();
        this.buscando_media = new Array();
    }
    BOT.prototype.iniciar = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.on("ready", function () { return console.log("BOT preparado!"); });
                this.on("messageCreate", function (message) { return __awaiter(_this, void 0, void 0, function () {
                    var mensaje, comando, args, mContent;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!message)
                                    return [2 /*return*/];
                                if (message.author.bot)
                                    return [2 /*return*/];
                                if (!message.guild)
                                    return [2 /*return*/];
                                if (!message.guild.id)
                                    return [2 /*return*/];
                                mensaje = new Mensaje_1.Mensaje(message);
                                comando = mensaje.getComando();
                                args = mensaje.getArgumentos();
                                if (!(comando == "!anime")) return [3 /*break*/, 2];
                                return [4 /*yield*/, this.obra(message, "ANIME", args, false)];
                            case 1: return [2 /*return*/, _a.sent()];
                            case 2:
                                if (!(comando == "!animeb")) return [3 /*break*/, 4];
                                return [4 /*yield*/, this.obra(message, "ANIME", args, true)];
                            case 3: return [2 /*return*/, _a.sent()];
                            case 4:
                                if (!(comando == "!manga")) return [3 /*break*/, 6];
                                return [4 /*yield*/, this.obra(message, "MANGA", args, false)];
                            case 5: return [2 /*return*/, _a.sent()];
                            case 6:
                                if (!(comando == "!mangab")) return [3 /*break*/, 8];
                                return [4 /*yield*/, this.obra(message, "MANGA", args, true)];
                            case 7: return [2 /*return*/, _a.sent()];
                            case 8:
                                if (!(comando === "!color")) return [3 /*break*/, 10];
                                return [4 /*yield*/, this.color(message, args[0])];
                            case 9: return [2 /*return*/, _a.sent()];
                            case 10:
                                if (!(comando == "!user")) return [3 /*break*/, 12];
                                return [4 /*yield*/, this.user(message, args[0])];
                            case 11: return [2 /*return*/, _a.sent()];
                            case 12:
                                if (!(comando == "!setup")) return [3 /*break*/, 14];
                                return [4 /*yield*/, this.setup(message, args[0])];
                            case 13: return [2 /*return*/, _a.sent()];
                            case 14:
                                if (!(comando == "!unsetup")) return [3 /*break*/, 16];
                                return [4 /*yield*/, this.unsetup(message)];
                            case 15: return [2 /*return*/, _a.sent()];
                            case 16:
                                if (!(comando == "!afinidad")) return [3 /*break*/, 18];
                                return [4 /*yield*/, this.afinidad(message, args)];
                            case 17: return [2 /*return*/, _a.sent()];
                            case 18:
                                if (comando == "!help") {
                                    return [2 /*return*/, this.enviarEmbed(message, Embeds_1.Embeds.EmbedInformacionHelp())];
                                }
                                if (!(comando === "!ruleta")) return [3 /*break*/, 20];
                                return [4 /*yield*/, this.ruleta(message)];
                            case 19: return [2 /*return*/, _a.sent()];
                            case 20:
                                mContent = message.content.toLowerCase()
                                    .split("é").join("e");
                                if (comando === "Hola") {
                                    message.reply("".concat(message.client.emojis.cache.find((function (e) { return e.name === "pala"; }))));
                                }
                                ;
                                if (mContent.endsWith(" que") || mContent.endsWith(" que?")) {
                                    return [2 /*return*/, this.responder(message, "so")];
                                }
                                if (message.content.endsWith("13") || message.content.endsWith("trece")) {
                                    this.responder(message, "¿Dijiste 13? Aquí tiene pa' que me la bese, entre más me la beses más me crece, busca un cura pa' que me la rese, y trae un martillo pa' que me la endereces, por el chiquito se te aparece toas las veces y cuando te estreses aquí te tengo éste pa' que te desestreses, con este tallo el jopo se te esflorece, se cumple el ciclo hasta que anochece, to' los días y toas las veces, de tanto entablar la raja del jopo se te desaparece, porque este sable no se compadece, si pides ñapa se te ofrece, y si repites se te agradece, no te hace rico pero tampoco te empobrece, no te hace inteligente pero tampoco te embrutece, y no paro aquí compa que éste nuevamente se endurece, hasta que amanece, cambie esa cara que parece que se entristece, si te haces viejo éste te rejuvenece, no te hago bulla porque depronto te ensordece, y ese cuadro no te favorece, pero tranquilo que éste te abastece, porque allá abajo se te humedece, viendo como el que me cuelga resplandece, si a ti te da miedo a mí me enorgullece, y así toas las vece ¿que te parece?, y tranquilo mijo que aquí éste reaparece, no haga fuerza porque éste se sobrecrece, una fresadora te traigo pa' que me la freses, así se fortalece y de nuevo la historia se establece, que no se te nuble la vista porque éste te la aclarece, y sino le entendiste nuevamente la explicación se te ofrece, pa' que por el chiquito éste de nuevo te empiece... Aquí tienes para que me la beses, entre más me la beses más me crece, busca un cura para que me la rece, un martillo para que me la endereces, un chef para que me la aderece, 8000 mondas por el culo se te aparecen, si me la sobas haces que se me espese, si quieres la escaneas y te la llevas para que en tu hoja de vida la anexes, me culeo a tu maldita madre y qué te parece le meti la monda a tú mamá hace 9 meses y después la puse a escuchar René de Calle 13 Te la meto por debajo del agua como los peces, y aquella flor de monda que en tu culo crece, reposa sobre tus nalgas a veces y una vez más...");
                                }
                                ;
                                if (message.content.endsWith("12") || message.content.endsWith("doce")) {
                                    this.responder(message, "las de doce son goood");
                                }
                                ;
                                if (message.content.endsWith(" 5") || message.content.endsWith("cinco")) {
                                    this.responder(message, "por el culo te la hinco");
                                }
                                if (message.content.endsWith("contexto")) {
                                    this.responder(message, "Espera dijiste contexto? Te la tragas sin pretexto, así no estés dispuesto, pero tal vez alguna vez te lo has propuesto, y te seré honesto te haré el favor y te lo presto, tan fuerte que tal vez me den arresto, ya no aguantas ni el sexto, así que lo dejamos pospuesto, pero te falta afecto y te lo dejo otra vez puesto, te aplastó en la pared como insecto tan duro que sale polvo de asbesto, llamo al arquitecto Alberto y al modesto Ernesto, y terminas más abierto que portón de asentamiento, ya no tenes más almacenamiento así que necesitas asesoramiento y a tu madre llamamos para darle su afecto así hasta el agotamiento y al siguiente día repetimos y así terminó y te la meto sin pretexto, así no estés dispuesto, pero tal vez alguna vez te lo has propuesto, y te seré honesto te haré el favor y te lo presto, tan fuerte que tal vez me den arresto, ya no aguantas ni el sexto, así que lo dejamos pospuesto, pero te falta afecto y te lo dejo otra vez puesto, te aplastó en la pared como insecto tan duro que sale polvo de asbesto, llamo al arquitecto Alberto y al modesto Ernesto, y terminas más abierto que portón de asentamiento, ya no tenes más almacenamiento así que necesitas asesoramiento y a tu madre llamamos para darle su afecto así hasta el agotamiento y al siguiente día repetimos pero ya estás descompuesto así que para mí continuar sería incorrecto y me voy sin mostrar algún gesto, dispuesto a seguir apenas y ya estés compuesto voy y te doy el impuesto pero no sin antes avisarte que este es el contexto 👍.");
                                }
                                return [2 /*return*/];
                        }
                    });
                }); });
                this.db.conectar(process.env.DB);
                this.client.login(process.env.TOKEN);
                return [2 /*return*/];
            });
        });
    };
    BOT.prototype.responder = function (message, text) {
        message.reply(text);
    };
    BOT.prototype.enviarEmbed = function (message, embed) {
        message.channel.send({ embeds: [embed] });
    };
    BOT.prototype.buscarMedia = function (tipo, args) {
        return __awaiter(this, void 0, void 0, function () {
            var media, media;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(isNaN(+args) || isNaN(parseFloat(args)))) return [3 /*break*/, 2];
                        return [4 /*yield*/, Media_1.Media.BuscarMedia(tipo, args)];
                    case 1:
                        media = _a.sent();
                        return [2 /*return*/, media == null ? null : new Obra_1.Obra(media)];
                    case 2: return [4 /*yield*/, Media_1.Media.BuscarMediaID(tipo, args)];
                    case 3:
                        media = _a.sent();
                        return [2 /*return*/, media == null ? null : new Obra_1.Obra(media)];
                }
            });
        });
    };
    BOT.prototype.buscarMediaUsuario = function (userID, mediaID) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Usuarios_1.Usuarios.GetStatsMedia(userID, mediaID)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    BOT.prototype.usuario = function (serverID, args) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Usuarios_1.Usuarios.BuscarUsuario(serverID, args)];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, user == null ? null : new Usuario_1.Usuario(user)];
                }
            });
        });
    };
    BOT.prototype.setup = function (message, username) {
        return __awaiter(this, void 0, void 0, function () {
            var reaccionEspera, resultado;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, message.react("🔄")];
                    case 1:
                        reaccionEspera = _a.sent();
                        return [4 /*yield*/, Setup_1.Setup.SetupUsuario(username, message)];
                    case 2:
                        resultado = _a.sent();
                        if (!resultado) {
                            reaccionEspera.remove();
                            message.react("❌");
                            return [2 /*return*/];
                        }
                        reaccionEspera.remove();
                        message.react("✅");
                        return [2 /*return*/];
                }
            });
        });
    };
    BOT.prototype.unsetup = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var reaccionEspera, resultado;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, message.react("🔄")];
                    case 1:
                        reaccionEspera = _a.sent();
                        return [4 /*yield*/, Setup_1.Setup.UnsetupUsuario(message)];
                    case 2:
                        resultado = _a.sent();
                        if (!resultado) {
                            reaccionEspera.remove();
                            message.react("❌");
                            return [2 /*return*/];
                        }
                        reaccionEspera.remove();
                        message.react("✅");
                        return [2 /*return*/];
                }
            });
        });
    };
    return BOT;
}());
exports["default"] = BOT;
