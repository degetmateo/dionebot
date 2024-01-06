"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AnilistAPI_1 = __importDefault(require("../../apis/anilist/AnilistAPI"));
const Helpers_1 = __importDefault(require("../../Helpers"));
const EmbedAnime_1 = __importDefault(require("../../embeds/EmbedAnime"));
const CommandInteraction_1 = __importDefault(require("../interactions/CommandInteraction"));
class InteraccionComandoRandom extends CommandInteraction_1.default {
    constructor(interaction) {
        super();
        this.interaction = interaction;
        this.bot = this.interaction.client;
        this.server_id = this.interaction.guild.id;
    }
    async execute() {
        await this.interaction.deferReply();
        const serverUsers = this.bot.servers.getUsers(this.server_id);
        const user = serverUsers.find(u => u.discordId === this.interaction.user.id);
        const res = await this.getUserPTW(user.anilistId);
        const entries = res.lists[0].entries;
        const random = Helpers_1.default.obtenerElementoAlAzar(entries);
        const anime = await AnilistAPI_1.default.fetchAnimeById(random.mediaId);
        const embed = EmbedAnime_1.default.Create(anime);
        try {
            await this.interaction.editReply({ embeds: [embed] });
        }
        catch (error) {
            throw error;
        }
    }
    async getUserPTW(userId) {
        const request = `
            query {                
                MediaListCollection (userId: ${userId}, type: ANIME, status: PLANNING) {
                    ...mediaListCollection
                }
            }

            fragment mediaListCollection on MediaListCollection {
                lists {
                    entries {
                        mediaId
                    }
                }
            }
        `;
        const res = await AnilistAPI_1.default.peticion(request, {});
        return res.MediaListCollection;
    }
}
exports.default = InteraccionComandoRandom;
