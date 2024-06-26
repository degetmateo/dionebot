"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommandInteraction_1 = __importDefault(require("../CommandInteraction"));
const DB_1 = __importDefault(require("../../../database/DB"));
const GenericException_1 = __importDefault(require("../../../errors/GenericException"));
const NoResultsException_1 = __importDefault(require("../../../errors/NoResultsException"));
const Helpers_1 = __importDefault(require("../../Helpers"));
const AnilistAPI_1 = __importDefault(require("../../apis/anilist/AnilistAPI"));
const Embed_1 = __importDefault(require("../../embeds/Embed"));
class SetupCommandInteraction extends CommandInteraction_1.default {
    constructor(interaction) {
        super();
        this.interaction = interaction;
    }
    async execute() {
        const query = this.interaction.options.getString('nombre-o-id');
        const bot = this.interaction.client;
        const serverId = this.interaction.guildId;
        const userId = this.interaction.user.id;
        const registeredUsers = bot.servers.getUsers(serverId);
        if (registeredUsers.length >= SetupCommandInteraction.MAX_USERS) {
            throw new GenericException_1.default('Se ha alcanzado la cantidad máxima de usuarios registrados en este servidor.');
        }
        if (registeredUsers.find(user => user.discordId === userId)) {
            throw new GenericException_1.default('Ya te encuentras registrado.');
        }
        let anilistUser;
        try {
            anilistUser = Helpers_1.default.isNumber(query) ?
                await AnilistAPI_1.default.fetchUserById(parseInt(query)) : await AnilistAPI_1.default.fetchUserByName(query);
        }
        catch (error) {
            if (error instanceof NoResultsException_1.default) {
                throw new NoResultsException_1.default('No se ha encontrado el usuario proporcionado en anilist.');
            }
        }
        await DB_1.default.createUser(serverId, userId, anilistUser.getId() + '');
        await bot.loadServers();
        const embed = Embed_1.default.Crear()
            .establecerColor(Embed_1.default.COLOR_VERDE)
            .establecerDescripcion('Te has registrado con éxito.')
            .obtenerDatos();
        try {
            await this.interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        }
        catch (error) {
            throw error;
        }
    }
}
SetupCommandInteraction.MAX_USERS = 15;
exports.default = SetupCommandInteraction;
