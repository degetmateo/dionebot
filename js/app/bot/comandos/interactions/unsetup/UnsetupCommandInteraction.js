"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommandInteraction_1 = __importDefault(require("../CommandInteraction"));
const NoResultsException_1 = __importDefault(require("../../../../errores/NoResultsException"));
const ServerModel_1 = __importDefault(require("../../../../database/modelos/ServerModel"));
const Embed_1 = __importDefault(require("../../../embeds/Embed"));
class UnsetupCommandInteraction extends CommandInteraction_1.default {
    constructor(interaction) {
        super();
        this.interaction = interaction;
    }
    async execute() {
        await this.interaction.deferReply({ ephemeral: true });
        const bot = this.interaction.client;
        const server = bot.servers.get(this.interaction.guildId);
        const user = server.users.find(u => u.discordId === this.interaction.user.id);
        if (!user)
            throw new NoResultsException_1.default('No estas registrado.');
        await ServerModel_1.default.updateOne({ id: this.interaction.guildId }, { $pull: { users: { discordId: this.interaction.user.id } } });
        await bot.loadServers();
        const embed = Embed_1.default.Crear()
            .establecerColor(Embed_1.default.COLOR_VERDE)
            .establecerDescripcion('Listo! Se ha eliminado tu cuenta.')
            .obtenerDatos();
        this.interaction.editReply({
            embeds: [embed]
        });
    }
}
exports.default = UnsetupCommandInteraction;
