"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommandInteraction_1 = __importDefault(require("../CommandInteraction"));
const DB_1 = __importDefault(require("../../../database/DB"));
const GenericException_1 = __importDefault(require("../../../errors/GenericException"));
const IllegalArgumentException_1 = __importDefault(require("../../../errors/IllegalArgumentException"));
const NoResultsException_1 = __importDefault(require("../../../errors/NoResultsException"));
const Helpers_1 = __importDefault(require("../../Helpers"));
const AnilistAPI_1 = __importDefault(require("../../apis/anilist/AnilistAPI"));
const Embed_1 = __importDefault(require("../../embeds/Embed"));
class AdminSetupCommandInteraction extends CommandInteraction_1.default {
    constructor(interaction) {
        super();
        this.interaction = interaction;
    }
    async execute() {
        await this.interaction.deferReply({ ephemeral: true });
        const platform = this.interaction.options.getString('plataforma');
        const user = this.interaction.options.getUser('usuario');
        const query = this.interaction.options.getString('nombre-o-id');
        if (platform === 'MyAnimeList' || platform === 'VisualNovelDatabase') {
            throw new IllegalArgumentException_1.default('La plataforma que has elegido no se encuentra disponible.');
        }
        const bot = this.interaction.client;
        const serverId = this.interaction.guildId;
        const registeredUsers = bot.servers.getUsers(serverId);
        if (registeredUsers.find(u => u.discordId === user.id)) {
            throw new GenericException_1.default('El usuario proporcionado ya se encuentra registrado.');
        }
        let anilistUser;
        try {
            anilistUser = Helpers_1.default.isNumber(query) ?
                await AnilistAPI_1.default.fetchUserById(parseInt(query)) : await AnilistAPI_1.default.fetchUserByName(query);
        }
        catch (error) {
            if (error instanceof NoResultsException_1.default) {
                throw new NoResultsException_1.default('No se ha encontrado al usuario proporcionado en anilist.');
            }
        }
        await DB_1.default.createUser(serverId, user.id, anilistUser.getId() + '');
        await bot.loadServers();
        const embed = Embed_1.default.Crear()
            .establecerColor(Embed_1.default.COLOR_VERDE)
            .establecerDescripcion('Se ha registrado al usuario con exito.')
            .obtenerDatos();
        await this.interaction.editReply({
            embeds: [embed]
        });
    }
}
exports.default = AdminSetupCommandInteraction;
