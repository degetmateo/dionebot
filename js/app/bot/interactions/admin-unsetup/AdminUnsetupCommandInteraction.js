"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommandInteraction_1 = __importDefault(require("../CommandInteraction"));
const Embed_1 = __importDefault(require("../../embeds/Embed"));
const DB_1 = __importDefault(require("../../../database/DB"));
const NoResultsException_1 = __importDefault(require("../../../errors/NoResultsException"));
class AdminUnsetupCommandInteraction extends CommandInteraction_1.default {
    constructor(interaction) {
        super();
        this.interaction = interaction;
    }
    async execute() {
        // await this.interaction.deferReply({ ephemeral: true });
        const bot = this.interaction.client;
        const user = this.interaction.options.getUser('usuario');
        const server = bot.servers.get(this.interaction.guildId);
        const registeredUser = server.users.find(u => u.discordId === user.id);
        if (!registeredUser)
            throw new NoResultsException_1.default('El usuario proporcionado no se encuentra registrado.');
        await DB_1.default.removeUser(server.id, user.id);
        await bot.loadServers();
        const embed = Embed_1.default.Crear()
            .establecerColor(Embed_1.default.COLOR_VERDE)
            .establecerDescripcion('Se ha eliminado la cuenta del usuario.')
            .obtenerDatos();
        await this.interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
}
exports.default = AdminUnsetupCommandInteraction;
