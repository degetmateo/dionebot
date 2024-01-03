import { ChatInputCommandInteraction, CacheType } from "discord.js";
import Bot from "../../Bot";
import { MediaColeccion } from "../../apis/anilist/TiposAnilist";
import AnilistAPI from "../../apis/anilist/AnilistAPI";
import Helpers from "../../Helpers";
import EmbedAnime from "../../embeds/EmbedAnime";
import CommandInteraction from "../interactions/CommandInteraction";

export default class InteraccionComandoRandom extends CommandInteraction {
    protected interaction: ChatInputCommandInteraction<CacheType>;

    private bot: Bot;
    private server_id: string;

    constructor (interaction: ChatInputCommandInteraction<CacheType>) {
        super();
        this.interaction = interaction;
        this.bot = this.interaction.client as Bot;
        this.server_id = this.interaction.guild.id;
    }

    public async execute (): Promise<void> {
        await this.interaction.deferReply();

        const serverUsers = this.bot.servers.getUsers(this.server_id);
        const user = serverUsers.find(u => u.discordId === this.interaction.user.id);

        const res = await this.getUserPTW(user.anilistId); 
        const entries = res.lists[0].entries;

        const random = Helpers.obtenerElementoAlAzar(entries);
        const anime = await AnilistAPI.fetchAnimeById(random.mediaId);
        const embed = EmbedAnime.Create(anime);

        try {
            await this.interaction.editReply( {embeds: [embed] });
        } catch (error) {
            throw error;
        }
    }   

    private async getUserPTW (userId: string): Promise<MediaColeccion> {
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

        const res = await AnilistAPI.peticion(request, {});
        return res.MediaListCollection as MediaColeccion;
    }
}