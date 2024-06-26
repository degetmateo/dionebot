"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommandInteraction_1 = __importDefault(require("../CommandInteraction"));
const NoResultsException_1 = __importDefault(require("../../../errors/NoResultsException"));
const AnilistAPI_1 = __importDefault(require("../../apis/anilist/AnilistAPI"));
const EmbedUser_1 = __importDefault(require("../../embeds/EmbedUser"));
class UsuarioCommandInteraction extends CommandInteraction_1.default {
    constructor(interaction) {
        super();
        this.interaction = interaction;
    }
    async execute() {
        // await this.interaction.deferReply();
        var _a;
        const bot = this.interaction.client;
        const user = this.interaction.options.getUser("usuario");
        const userId = user ? user.id : this.interaction.user.id;
        const serverId = (_a = this.interaction.guild) === null || _a === void 0 ? void 0 : _a.id;
        const registeredUsers = bot.servers.getUsers(serverId);
        const registeredUser = registeredUsers.find(u => u.discordId === userId);
        if (!registeredUser)
            throw new NoResultsException_1.default('El usuario especificado no esta registrado.');
        let anilistUser;
        try {
            anilistUser = await AnilistAPI_1.default.fetchUserById(parseInt(registeredUser.anilistId));
        }
        catch (error) {
            if (error instanceof NoResultsException_1.default) {
                throw new NoResultsException_1.default('El usuario registrado ya no se encuentra en anilist.');
            }
            else {
                throw error;
            }
        }
        const embed = EmbedUser_1.default.Create(anilistUser);
        try {
            this.interaction.reply({
                embeds: [embed]
            });
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = UsuarioCommandInteraction;
