"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InteraccionComando_1 = __importDefault(require("./InteraccionComando"));
const AnilistAPI_1 = __importDefault(require("../../apis/anilist/AnilistAPI"));
const UsuarioAnilist_1 = __importDefault(require("../../apis/anilist/modelos/UsuarioAnilist"));
const Aniuser_1 = __importDefault(require("../../../database/modelos/Aniuser"));
const ErrorArgumentoInvalido_1 = __importDefault(require("../../../errores/ErrorArgumentoInvalido"));
const ErrorGenerico_1 = __importDefault(require("../../../errores/ErrorGenerico"));
const Embed_1 = __importDefault(require("../../embeds/Embed"));
class InteraccionComandoSetup extends InteraccionComando_1.default {
    constructor(interaction) {
        super();
        this.interaction = interaction;
    }
    static async execute(interaction) {
        const modulo = new InteraccionComandoSetup(interaction);
        await modulo.execute();
    }
    async execute() {
        var _a;
        await this.interaction.deferReply({ ephemeral: true });
        const plataforma = this.interaction.options.getString('plataforma');
        const criterio = this.interaction.options.getString('nombre-o-id');
        if (plataforma === 'MyAnimeList' || plataforma === 'VisualNovelDatabase')
            throw new ErrorArgumentoInvalido_1.default('La plataforma que has elegido no se encuentra disponible.');
        const bot = this.interaction.client;
        const serverID = (_a = this.interaction.guild) === null || _a === void 0 ? void 0 : _a.id;
        const userID = this.interaction.user.id;
        const uRegistrados = bot.usuarios.obtenerUsuariosRegistrados(serverID);
        const uRegistrado = uRegistrados.find(u => u.discordId === userID);
        if (uRegistrado)
            throw new ErrorGenerico_1.default('Ya te encuentras registrado.');
        const usuario = new UsuarioAnilist_1.default(await AnilistAPI_1.default.buscarUsuario(criterio));
        await InteraccionComandoSetup.SetupUsuario(usuario, serverID, userID);
        const newUsuarioRegistrado = {
            discordId: userID,
            serverId: serverID,
            anilistUsername: usuario.obtenerNombre(),
            anilistId: usuario.obtenerID().toString()
        };
        bot.usuarios.insertar(newUsuarioRegistrado);
        const embed = Embed_1.default.Crear()
            .establecerColor(Embed_1.default.COLOR_VERDE)
            .establecerDescripcion('Listo! Te has registrado con éxito.')
            .obtenerDatos();
        await this.interaction.editReply({
            embeds: [embed]
        });
    }
    static async SetupUsuario(usuario, serverID, discordID) {
        const aniuser = new Aniuser_1.default({
            serverId: serverID,
            discordId: discordID,
            anilistId: usuario.obtenerID(),
            anilistUsername: usuario.obtenerNombre()
        });
        try {
            await aniuser.save();
        }
        catch (err) {
            throw err;
        }
    }
}
exports.default = InteraccionComandoSetup;
