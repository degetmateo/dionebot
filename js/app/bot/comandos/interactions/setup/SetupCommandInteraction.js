"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommandInteraction_1 = __importDefault(require("../CommandInteraction"));
const IllegalArgumentException_1 = __importDefault(require("../../../../errores/IllegalArgumentException"));
const GenericException_1 = __importDefault(require("../../../../errores/GenericException"));
const AnilistAPI_1 = __importDefault(require("../../../apis/anilist/AnilistAPI"));
const Helpers_1 = __importDefault(require("../../../Helpers"));
const ServerModel_1 = __importDefault(require("../../../../database/modelos/ServerModel"));
const Embed_1 = __importDefault(require("../../../embeds/Embed"));
class SetupCommandInteraction extends CommandInteraction_1.default {
    constructor(interaction) {
        super();
        this.interaction = interaction;
    }
    async execute() {
        await this.interaction.deferReply({ ephemeral: true });
        const platform = this.interaction.options.getString('plataforma');
        const query = this.interaction.options.getString('nombre-o-id');
        if (platform === 'MyAnimeList' || platform === 'VisualNovelDatabase') {
            throw new IllegalArgumentException_1.default('La plataforma que has elegido no se encuentra disponible.');
        }
        const bot = this.interaction.client;
        const serverId = this.interaction.guildId;
        const userId = this.interaction.user.id;
        const registeredUsers = bot.servers.getUsers(serverId);
        if (registeredUsers.length >= 30) {
            throw new GenericException_1.default('Se ha alcanzado la cantidad máxima de usuarios registrados en este servidor.');
        }
        if (registeredUsers.find(user => user.discordId === userId)) {
            throw new GenericException_1.default('Ya te encuentras registrado.');
        }
        const anilistUser = Helpers_1.default.isNumber(query) ?
            await AnilistAPI_1.default.fetchUserById(parseInt(query)) : await AnilistAPI_1.default.fetchUserByName(query);
        let server = await ServerModel_1.default.findOne({ id: serverId });
        if (!server)
            server = new ServerModel_1.default({
                id: serverId,
                premium: false,
                users: []
            });
        server.users.push({ discordId: userId, anilistId: anilistUser.getId() });
        await server.save();
        await bot.loadServers();
        const embed = Embed_1.default.Crear()
            .establecerColor(Embed_1.default.COLOR_VERDE)
            .establecerDescripcion('Listo! Te has registrado con éxito.')
            .obtenerDatos();
        await this.interaction.editReply({
            embeds: [embed]
        });
    }
}
exports.default = SetupCommandInteraction;
