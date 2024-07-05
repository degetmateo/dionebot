"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommandInteraction_1 = __importDefault(require("../CommandInteraction"));
const NoResultsException_1 = __importDefault(require("../../../errors/NoResultsException"));
const AnilistAPI_1 = __importDefault(require("../../apis/anilist/AnilistAPI"));
const EmbedUser_1 = __importDefault(require("../../embeds/EmbedUser"));
const postgres_1 = __importDefault(require("../../../database/postgres"));
class UsuarioCommandInteraction extends CommandInteraction_1.default {
    constructor(interaction) {
        super();
        this.interaction = interaction;
    }
    async execute() {
        const user = this.interaction.options.getUser("usuario");
        const userId = user ? user.id : this.interaction.user.id;
        const serverId = this.interaction.guild.id;
        const queryMembership = await postgres_1.default.query() `
            SELECT * FROM
                membership
            WHERE
                id_user = ${userId} and
                id_server = ${serverId};
        `;
        if (!queryMembership[0])
            throw new NoResultsException_1.default('El usuario especificado no esta registrado.');
        const queryUser = await postgres_1.default.query() `
            SELECT * FROM
                discord_user
            WHERE
                id_user = ${userId};
        `;
        let anilistUser;
        try {
            anilistUser = await AnilistAPI_1.default.fetchUserById(parseInt(queryUser[0].id_anilist));
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
