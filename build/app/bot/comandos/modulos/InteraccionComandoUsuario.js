"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InteraccionComando_1 = __importDefault(require("./InteraccionComando"));
const AnilistAPI_1 = __importDefault(require("../../apis/anilist/AnilistAPI"));
const UsuarioAnilist_1 = __importDefault(require("../../apis/anilist/modelos/UsuarioAnilist"));
const Aniuser_1 = __importDefault(require("../../../database/modelos/Aniuser"));
const ErrorSinResultados_1 = __importDefault(require("../../../errores/ErrorSinResultados"));
const EmbedUsuario_1 = __importDefault(require("../../embeds/EmbedUsuario"));
class InteraccionComandoUsuario extends InteraccionComando_1.default {
    constructor(interaction) {
        super();
        this.interaction = interaction;
        this.embeds = new Array();
    }
    static async execute(interaction) {
        const modulo = new InteraccionComandoUsuario(interaction);
        await modulo.execute();
    }
    async execute() {
        var _a, _b;
        await this.interaction.deferReply();
        const idUsuario = ((_a = this.interaction.options.getUser("usuario")) === null || _a === void 0 ? void 0 : _a.id) || this.interaction.user.id;
        const idServidor = (_b = this.interaction.guild) === null || _b === void 0 ? void 0 : _b.id;
        const usuarioRegistrado = await Aniuser_1.default.findOne({ serverId: idServidor, discordId: idUsuario });
        if (!usuarioRegistrado)
            throw new ErrorSinResultados_1.default('El usuario especificado no esta registrado.');
        const usuario = new UsuarioAnilist_1.default(await AnilistAPI_1.default.buscarUsuario(parseInt(usuarioRegistrado.anilistId)));
        this.embeds.push(await EmbedUsuario_1.default.CrearPrincipal(usuario));
        // const embedFavs = EmbedUsuario.CrearMediaFavorita(usuario);
        // embedFavs ? this.embeds.push(embedFavs) : null;
        await this.interaction.editReply({
            embeds: this.embeds
        });
    }
}
exports.default = InteraccionComandoUsuario;
