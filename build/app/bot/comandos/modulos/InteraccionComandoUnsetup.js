"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InteraccionComando_1 = __importDefault(require("./InteraccionComando"));
const Embed_1 = __importDefault(require("../../embeds/Embed"));
const Aniuser_1 = __importDefault(require("../../../database/modelos/Aniuser"));
const ErrorSinResultados_1 = __importDefault(require("../../../errores/ErrorSinResultados"));
class InteraccionComandoUnsetup extends InteraccionComando_1.default {
    constructor(interaction) {
        super();
        this.interaction = interaction;
    }
    static async execute(interaction) {
        const modulo = new InteraccionComandoUnsetup(interaction);
        await modulo.execute(interaction);
    }
    async execute(interaction) {
        var _a;
        await interaction.deferReply({ ephemeral: true });
        const bot = interaction.client;
        const serverID = ((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id) != null ? interaction.guild.id : "";
        const userID = interaction.user.id;
        await InteraccionComandoUnsetup.UnsetupUsuario(serverID, userID);
        bot.usuarios.eliminar(serverID, userID);
        const embed = Embed_1.default.Crear()
            .establecerColor(Embed_1.default.COLOR_VERDE)
            .establecerDescripcion('Listo! Se ha eliminado tu cuenta.')
            .obtenerDatos();
        interaction.editReply({
            embeds: [embed]
        });
    }
    static async UnsetupUsuario(serverID, userID) {
        const uRegistrado = await Aniuser_1.default.findOne({ serverId: serverID, discordId: userID });
        if (!uRegistrado)
            throw new ErrorSinResultados_1.default('No estas registrado en la base de datos.');
        try {
            await (uRegistrado === null || uRegistrado === void 0 ? void 0 : uRegistrado.deleteOne());
        }
        catch (err) {
            throw err;
        }
    }
}
exports.default = InteraccionComandoUnsetup;
