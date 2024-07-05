"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const CommandInteraction_1 = __importDefault(require("../CommandInteraction"));
const AfinidadInteractionController_1 = __importDefault(require("./AfinidadInteractionController"));
const NoResultsException_1 = __importDefault(require("../../../errors/NoResultsException"));
const Helpers_1 = __importDefault(require("../../Helpers"));
const AnilistAPI_1 = __importDefault(require("../../apis/anilist/AnilistAPI"));
const postgres_1 = __importDefault(require("../../../database/postgres"));
class AfinidadCommandInteraction extends CommandInteraction_1.default {
    constructor(interaction) {
        super();
        this.zip = (a, b) => a.map((k, i) => [k, b[i]]);
        this.interaction = interaction;
    }
    async execute() {
        await this.interaction.deferReply();
        const inputUser = this.interaction.options.getUser('usuario');
        const userId = inputUser ? inputUser.id : this.interaction.user.id;
        const serverId = this.interaction.guild.id;
        const queryUser = await postgres_1.default.query() `
            SELECT * FROM
                discord_user
            WHERE
                id_user 
            IN (
                SELECT id_user FROM
                    membership
                WHERE
                    id_user = ${userId} and
                    id_server = ${serverId}
            );
        `;
        if (!queryUser[0])
            throw new NoResultsException_1.default('Tu o el usuario especificado no están registrados.');
        const anilistUser = await AnilistAPI_1.default.fetchUserById(parseInt(queryUser[0].id_anilist));
        if (!anilistUser)
            throw new NoResultsException_1.default('Tu o el usuario especificado no se encuentran en Anilist.');
        const queryUsers = await postgres_1.default.query() `
            SELECT * FROM
                discord_user
            WHERE
                id_user 
            IN (
                SELECT id_user FROM
                    membership
                WHERE
                    id_server = ${serverId}
            );
        `;
        const affinities = await this.getUserAffinities(anilistUser, queryUsers);
        if (!affinities || affinities.length <= 0)
            throw new NoResultsException_1.default('No hay afinidades disponibles.');
        const embeds = this.createEmbeds(anilistUser, affinities);
        const interactionController = new AfinidadInteractionController_1.default(this.interaction, embeds);
        await interactionController.execute();
    }
    async getUserAffinities(user, registeredUsers) {
        const usersCompletedLists = await AnilistAPI_1.default.fetchUsersCompletedLists(user, registeredUsers.map(u => u.id_anilist + ''));
        const mainUserCollection = usersCompletedLists.user.lists[0];
        const mainUserCompletedMedia = mainUserCollection.entries;
        if (!mainUserCollection || mainUserCompletedMedia.length <= 0)
            throw new NoResultsException_1.default('El usuario especificado no tiene animes completados.');
        const usersCollection = usersCompletedLists.users;
        const affinities = [];
        for (const iterativeUser of registeredUsers) {
            if (iterativeUser.id_anilist + '' === user.getId() + '')
                continue;
            const iterativeUserDiscord = await this.interaction.client.users.fetch(iterativeUser.id_user + '');
            if (!iterativeUserDiscord)
                continue;
            const iterativeUserUsername = iterativeUserDiscord.username;
            if (iterativeUserUsername.toLowerCase().includes('deleted user')) {
                await postgres_1.default.query().begin(async (sql) => {
                    await sql `
                        DELETE FROM
                            membership
                        WHERE
                            id_user = ${iterativeUser.id_user} and
                            id_server = ${this.interaction.guild.id}
                    `;
                });
                continue;
            }
            const iterativeUserCompletedCollection = usersCollection.find(u => u.user.id === parseInt(iterativeUser.id_anilist + '')).lists[0];
            if (!iterativeUserCompletedCollection)
                continue;
            const iterativeUserCompletedMedia = iterativeUserCompletedCollection.entries;
            if (!iterativeUserCompletedMedia || iterativeUserCompletedMedia.length <= 0)
                continue;
            const affinity = await this.handleAffinity(mainUserCompletedMedia, iterativeUserCompletedMedia);
            affinities.push({ name: iterativeUserUsername, affinity: parseFloat(affinity.toFixed(2)) });
        }
        return this.sortAffinities(affinities);
    }
    async handleAffinity(mainUserCompletedMedia, secondUserCompletedMedia) {
        const sharedMedia = this.getSharedMedia(mainUserCompletedMedia, secondUserCompletedMedia);
        return this.calculateAffinity(sharedMedia);
    }
    getSharedMedia(mainUserCompletedMedia, secondUserCompletedMedia) {
        const sharedMedia = new Array();
        for (const mainUserMedia of mainUserCompletedMedia) {
            const secondUserMedia = secondUserCompletedMedia.find(media => media.mediaId === mainUserMedia.mediaId);
            if (!secondUserMedia)
                continue;
            sharedMedia.push({ id: mainUserMedia.mediaId, scoreA: mainUserMedia.score, scoreB: secondUserMedia.score });
        }
        return sharedMedia;
    }
    /**
     * Método que calcula el coeficiente de correlación personal entre dos usuarios.
     * Basado en:
     * https://en.wikipedia.org/wiki/Pearson_correlation_coefficient
     *
     * https://github.com/AlexanderColen/Annie-May-Discord-Bot/blob/default/Annie/Utility/AffinityUtility.cs
     * @param sharedMedia Arreglo con la media compartida por los dos usuarios.
     * @returns Porcentaje de la afinidad.
     */
    calculateAffinity(sharedMedia) {
        const scoresA = sharedMedia.map(media => media.scoreA);
        const scoresB = sharedMedia.map(media => media.scoreB);
        const ma = Helpers_1.default.calculateAverage(scoresA);
        const mb = Helpers_1.default.calculateAverage(scoresB);
        const am = scoresA.map(score => score - ma);
        const bm = scoresB.map(score => score - mb);
        const sa = am.map(x => Math.pow(x, 2));
        const sb = bm.map(x => Math.pow(x, 2));
        const numerator = Helpers_1.default.addElements(this.zip(am, bm).map(tupla => tupla[0] * tupla[1]));
        const denominator = Math.sqrt(Helpers_1.default.addElements(sa) * Helpers_1.default.addElements(sb));
        return (numerator <= 0 || denominator <= 0 ? 0 : numerator / denominator) * 100;
    }
    sortAffinities(affinities) {
        return affinities.sort((a, b) => {
            if (a.affinity < b.affinity)
                return 1;
            if (a.affinity > b.affinity)
                return -1;
            return 0;
        });
    }
    createEmbeds(user, affinities) {
        const embeds = Array();
        const numEmbeds = parseInt((affinities.length / 10) + '') + 1;
        for (let i = 0; i < numEmbeds; i++) {
            let actualPart = affinities.slice(i * 10, (i * 10) + 10);
            let actualCheckedPart = new Array();
            for (const p of actualPart) {
                if (p)
                    actualCheckedPart.push(p);
            }
            if (actualCheckedPart.length <= 0)
                continue;
            const embed = new discord_js_1.EmbedBuilder();
            const information = actualCheckedPart.map((a, e) => `**\`(${e + 1 + (i * 10)})\`** **[${a.affinity}%]** ▸ ${a.name}`).join('\n');
            embed.setDescription(information);
            const avatar = user.getAvatarURL();
            avatar ? embed.setThumbnail(avatar) : null;
            embed.setColor(user.getColor());
            embed.setTitle('Afinidad de ' + user.getName());
            embed.setFooter({ text: `Pagina ${i + 1} de ${(numEmbeds).toFixed(0)}` });
            embeds.push(embed);
        }
        return embeds;
    }
}
exports.default = AfinidadCommandInteraction;
