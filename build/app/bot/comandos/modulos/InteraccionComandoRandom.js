"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InteraccionComando_1 = __importDefault(require("./InteraccionComando"));
const AnilistAPI_1 = __importDefault(require("../../apis/anilist/AnilistAPI"));
const Helpers_1 = __importDefault(require("../../Helpers"));
const EmbedAnime_1 = __importDefault(require("../../embeds/EmbedAnime"));
const Anime_1 = __importDefault(require("../../apis/anilist/modelos/media/Anime"));
class InteraccionComandoRandom extends InteraccionComando_1.default {
    constructor(interaction) {
        super();
        this.interaction = interaction;
        this.bot = this.interaction.client;
        this.server_id = this.interaction.guild.id;
    }
    static async execute(interaction) {
        const modulo = new InteraccionComandoRandom(interaction);
        await modulo.execute();
    }
    async execute() {
        await this.interaction.deferReply();
        const serverUsers = this.bot.usuarios.obtenerUsuariosRegistrados(this.server_id);
        const user = serverUsers.find(u => u.discordId === this.interaction.user.id);
        const res = await this.getUserPTW(user);
        const entries = res.lists[0].entries;
        const random = Helpers_1.default.obtenerElementoAlAzar(entries);
        const anime = await AnilistAPI_1.default.buscarAnimePorID(random.mediaId);
        const embed = EmbedAnime_1.default.Crear(new Anime_1.default(anime));
        try {
            await this.interaction.editReply({ embeds: [embed] });
        }
        catch (error) {
            throw error;
        }
    }
    async getUserPTW(user) {
        const request = `
            query {                
                MediaListCollection (userId: ${user.anilistId}, type: ANIME, status: PLANNING) {
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
