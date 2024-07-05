"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommandInteraction_1 = __importDefault(require("../CommandInteraction"));
const Embed_1 = __importDefault(require("../../embeds/Embed"));
const NoResultsException_1 = __importDefault(require("../../../errors/NoResultsException"));
const postgres_1 = __importDefault(require("../../../database/postgres"));
class AdminUnsetupCommandInteraction extends CommandInteraction_1.default {
    constructor(interaction) {
        super();
        this.interaction = interaction;
    }
    async execute() {
        const user = this.interaction.options.getUser('usuario');
        const userId = user.id;
        const serverId = this.interaction.guild.id;
        const queryUser = await postgres_1.default.query() `
            SELECT * FROM
                membership
            WHERE
                id_user = ${userId} and
                id_server = ${serverId};
        `;
        if (!queryUser[0])
            throw new NoResultsException_1.default('El usuario proporcionado no se encuentra registrado.');
        await postgres_1.default.query().begin(async (sql) => {
            await sql `
                DELETE FROM
                    membership
                WHERE
                    id_user = ${userId} and
                    id_server = ${serverId};
            `;
        });
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
