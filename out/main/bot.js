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
exports.BOT = void 0;
const discord_js_1 = require("discord.js");
const Obra_1 = require("../modelos/Obra");
const Usuario_1 = require("../modelos/Usuario");
const Database_1 = require("./Database");
const User_1 = require("../modelos_db/User");
const Mensaje_1 = require("../modelos/Mensaje");
const Media_1 = require("../modulos/Media");
const Usuarios_1 = require("../modulos/Usuarios");
const Afinidad_1 = require("../modulos/Afinidad");
const Setup_1 = require("../modulos/Setup");
const Embeds_1 = require("../modulos/Embeds");
class BOT {
    constructor() {
        this.client = new discord_js_1.Client({
            intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildMessages, discord_js_1.GatewayIntentBits.MessageContent]
        });
        this.db = new Database_1.DB();
    }
    iniciar() {
        return __awaiter(this, void 0, void 0, function* () {
            this.on("ready", () => console.log("BOT preparado!"));
            this.on("messageCreate", (message) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                if (!message)
                    return;
                if (message.author.bot)
                    return;
                if (!message.guild)
                    return;
                const mensaje = new Mensaje_1.Mensaje(message);
                const comando = mensaje.getComando();
                const args = mensaje.getArgumentos();
                if (comando === "Hola") {
                    message.reply(`${message.client.emojis.cache.find((e => e.name === "pala"))}`);
                }
                ;
                if (comando == "!anime") {
                    const anime = yield this.anime(args.join(" "));
                    if (!anime) {
                        return message.react("❌");
                    }
                    else {
                        message.react("✅");
                    }
                    const embedInformacion = yield Embeds_1.Embeds.EmbedInformacionMedia(message, anime, false);
                    this.enviarEmbed(message, embedInformacion);
                }
                if (comando == "!animeb") {
                    const anime = yield this.anime(args.join(" "));
                    if (!anime) {
                        return message.react("❌");
                    }
                    else {
                        message.react("✅");
                    }
                    const embedInformacion = yield Embeds_1.Embeds.EmbedInformacionMedia(message, anime, true);
                    this.enviarEmbed(message, embedInformacion);
                }
                if (comando == "!manga") {
                    const manga = yield this.manga(args.join(" "));
                    if (!manga) {
                        return message.react("❌");
                    }
                    else {
                        message.react("✅");
                    }
                    const embedInformacion = yield Embeds_1.Embeds.EmbedInformacionMedia(message, manga, false);
                    this.enviarEmbed(message, embedInformacion);
                }
                if (comando == "!mangab") {
                    const manga = yield this.manga(args.join(" "));
                    if (!manga) {
                        return message.react("❌");
                    }
                    else {
                        message.react("✅");
                    }
                    const embedInformacion = yield Embeds_1.Embeds.EmbedInformacionMedia(message, manga, true);
                    this.enviarEmbed(message, embedInformacion);
                }
                if (comando == "!user") {
                    let usuario;
                    if (!args[0] || args[0].length <= 0) {
                        usuario = yield this.usuario(message.guild.id, message.author.id);
                    }
                    else {
                        const usuarioMencionado = (_a = message.mentions.members) === null || _a === void 0 ? void 0 : _a.first();
                        if (usuarioMencionado) {
                            usuario = yield this.usuario(message.guild.id, usuarioMencionado.id);
                        }
                        else {
                            usuario = yield this.usuario(message.guild.id, args[0]);
                        }
                    }
                    if (!usuario) {
                        return message.react("❌");
                    }
                    else {
                        message.react("✅");
                    }
                    const embed = Embeds_1.Embeds.EmbedInformacionUsuario(usuario);
                    this.enviarEmbed(message, embed);
                }
                if (comando == "!setup") {
                    const result = yield this.setup(args[0], message);
                    if (result) {
                        message.react("✅");
                    }
                    else {
                        message.react("❌");
                    }
                }
                if (comando == "!unsetup") {
                    const result = yield this.unsetup(message);
                    if (result) {
                        message.react("✅");
                    }
                    else {
                        message.react("❌");
                    }
                }
                if (comando == "!afinidad") {
                    const serverID = message.guildId == null ? "" : message.guildId;
                    if (!args[0]) {
                        this.EnviarAfinidad(message, message.author.id, serverID);
                    }
                    else {
                        if ((_b = message.mentions.members) === null || _b === void 0 ? void 0 : _b.first()) {
                            const uMencionado = message.mentions.members.first();
                            const userID = uMencionado == null ? "" : uMencionado.id;
                            this.EnviarAfinidad(message, userID, serverID);
                        }
                        else {
                            const username = args[0];
                            const user = yield User_1.User.findOne({ anilistUsername: username });
                            const userID = (user === null || user === void 0 ? void 0 : user.discordId) == undefined ? "" : user === null || user === void 0 ? void 0 : user.discordId;
                            this.EnviarAfinidad(message, userID, serverID);
                        }
                    }
                }
                if (comando == "!help") {
                    this.enviarEmbed(message, Embeds_1.Embeds.EmbedInformacionHelp());
                }
                const mContent = message.content.toLowerCase()
                    .split("é").join("e");
                if (mContent.endsWith("que") || mContent.endsWith("que?")) {
                    return this.responder(message, "so");
                }
                if (message.content.endsWith("13") || message.content.endsWith("trece")) {
                    this.responder(message, "¿Dijiste 13? Aquí tiene pa' que me la bese, entre más me la beses más me crece, busca un cura pa' que me la rese, y trae un martillo pa' que me la endereces, por el chiquito se te aparece toas las veces y cuando te estreses aquí te tengo éste pa' que te desestreses, con este tallo el jopo se te esflorece, se cumple el ciclo hasta que anochece, to' los días y toas las veces, de tanto entablar la raja del jopo se te desaparece, porque este sable no se compadece, si pides ñapa se te ofrece, y si repites se te agradece, no te hace rico pero tampoco te empobrece, no te hace inteligente pero tampoco te embrutece, y no paro aquí compa que éste nuevamente se endurece, hasta que amanece, cambie esa cara que parece que se entristece, si te haces viejo éste te rejuvenece, no te hago bulla porque depronto te ensordece, y ese cuadro no te favorece, pero tranquilo que éste te abastece, porque allá abajo se te humedece, viendo como el que me cuelga resplandece, si a ti te da miedo a mí me enorgullece, y así toas las vece ¿que te parece?, y tranquilo mijo que aquí éste reaparece, no haga fuerza porque éste se sobrecrece, una fresadora te traigo pa' que me la freses, así se fortalece y de nuevo la historia se establece, que no se te nuble la vista porque éste te la aclarece, y sino le entendiste nuevamente la explicación se te ofrece, pa' que por el chiquito éste de nuevo te empiece... Aquí tienes para que me la beses, entre más me la beses más me crece, busca un cura para que me la rece, un martillo para que me la endereces, un chef para que me la aderece, 8000 mondas por el culo se te aparecen, si me la sobas haces que se me espese, si quieres la escaneas y te la llevas para que en tu hoja de vida la anexes, me culeo a tu maldita madre y qué te parece le meti la monda a tú mamá hace 9 meses y después la puse a escuchar René de Calle 13 Te la meto por debajo del agua como los peces, y aquella flor de monda que en tu culo crece, reposa sobre tus nalgas a veces y una vez más...");
                }
                ;
                if (message.content.endsWith("12") || message.content.endsWith("doce")) {
                    this.responder(message, "las de doce son goood");
                }
                ;
                if (message.content.endsWith("5") || message.content.endsWith("cinco")) {
                    this.responder(message, "por el culo te la hinco");
                }
                if (message.content.endsWith("contexto")) {
                    this.responder(message, "Espera dijiste contexto? Te la tragas sin pretexto, así no estés dispuesto, pero tal vez alguna vez te lo has propuesto, y te seré honesto te haré el favor y te lo presto, tan fuerte que tal vez me den arresto, ya no aguantas ni el sexto, así que lo dejamos pospuesto, pero te falta afecto y te lo dejo otra vez puesto, te aplastó en la pared como insecto tan duro que sale polvo de asbesto, llamo al arquitecto Alberto y al modesto Ernesto, y terminas más abierto que portón de asentamiento, ya no tenes más almacenamiento así que necesitas asesoramiento y a tu madre llamamos para darle su afecto así hasta el agotamiento y al siguiente día repetimos y así terminó y te la meto sin pretexto, así no estés dispuesto, pero tal vez alguna vez te lo has propuesto, y te seré honesto te haré el favor y te lo presto, tan fuerte que tal vez me den arresto, ya no aguantas ni el sexto, así que lo dejamos pospuesto, pero te falta afecto y te lo dejo otra vez puesto, te aplastó en la pared como insecto tan duro que sale polvo de asbesto, llamo al arquitecto Alberto y al modesto Ernesto, y terminas más abierto que portón de asentamiento, ya no tenes más almacenamiento así que necesitas asesoramiento y a tu madre llamamos para darle su afecto así hasta el agotamiento y al siguiente día repetimos pero ya estás descompuesto así que para mí continuar sería incorrecto y me voy sin mostrar algún gesto, dispuesto a seguir apenas y ya estés compuesto voy y te doy el impuesto pero no sin antes avisarte que este es el contexto 👍.");
                }
            }));
            this.db.conectar(process.env.DB);
            this.client.login(process.env.TOKEN);
        });
    }
    on(event, func) {
        this.client.on(event, func);
    }
    responder(message, text) {
        message.reply(text);
    }
    enviar(message, text) {
        message.channel.send(text);
    }
    enviarEmbed(message, embed) {
        message.channel.send({ embeds: [embed] });
    }
    anime(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.buscarMedia("ANIME", args);
        });
    }
    manga(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.buscarMedia("MANGA", args);
        });
    }
    buscarMedia(tipo, args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (isNaN(+args) || isNaN(parseFloat(args))) {
                const media = yield Media_1.Media.BuscarMedia(tipo, args);
                return media == null ? null : new Obra_1.Obra(media);
            }
            else {
                const media = yield Media_1.Media.BuscarMediaID(tipo, args);
                return media == null ? null : new Obra_1.Obra(media);
            }
        });
    }
    buscarMediaUsuario(userID, mediaID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Usuarios_1.Usuarios.GetStatsMedia(userID, mediaID);
        });
    }
    usuario(serverID, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield Usuarios_1.Usuarios.BuscarUsuario(serverID, args);
            return user == null ? null : new Usuario_1.Usuario(user);
        });
    }
    setup(username, message) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Setup_1.Setup.SetupUsuario(username, message);
        });
    }
    unsetup(message) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Setup_1.Setup.UnsetupUsuario(message);
        });
    }
    EnviarAfinidad(message, userID, serverID) {
        return __awaiter(this, void 0, void 0, function* () {
            const uRegistrados = yield User_1.User.find({ serverId: serverID });
            const usuario = uRegistrados.find(u => u.discordId == userID);
            if (!usuario) {
                message.react("❌");
                return;
            }
            message.channel.sendTyping();
            const aniuser1 = yield this.usuario(message.guildId == null ? "" : message.guildId, (usuario === null || usuario === void 0 ? void 0 : usuario.anilistUsername) || "");
            if (!aniuser1) {
                message.react("❌");
                return;
            }
            const afinidades = yield Afinidad_1.Afinidad.GetAfinidadUsuario(aniuser1, uRegistrados);
            this.enviarEmbed(message, Embeds_1.Embeds.EmbedAfinidad(aniuser1, afinidades));
            message.react("✅");
        });
    }
}
exports.BOT = BOT;
