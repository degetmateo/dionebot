import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, CacheType, ChatInputCommandInteraction } from "discord.js";
import Anime from "../../../apis/anilist/modelos/media/Anime";
import EmbedAnime from "../../../embeds/EmbedAnime";
import Button from "../../components/Button";
import AnilistAPI from "../../../apis/anilist/AnilistAPI";
import Bot from "../../../Bot";
import EmbedScores from "../../../embeds/EmbedScores";
import CommandInteraction from "../CommandInteraction";

export default class InteractionController {
    private page: number;
    private lastPage: number;

    private interaction: ChatInputCommandInteraction<CacheType>;
    private animes: Array<Anime>;
    private embeds: Array<EmbedAnime>;

    private bot: Bot;

    private readonly buttonPreviousPage = Button.CreatePrevious();
    private readonly buttonNextPage = Button.CreateNext();
    private readonly row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(this.buttonPreviousPage, this.buttonNextPage);

    constructor (interaction: ChatInputCommandInteraction<CacheType>, animes: Array<Anime>, embeds: Array<EmbedAnime>) {
        this.page = 0;
        this.lastPage = animes.length - 1;

        this.interaction = interaction;
        this.animes = animes;
        this.embeds = embeds;
        this.bot = interaction.client as Bot;
    }

    public async execute (): Promise<void> {
        const serverId = this.interaction.guildId;
        const users = this.bot.servers.getUsers(serverId);

        const anime = this.animes[this.page];
        const scores = await AnilistAPI.fetchUsersScores(anime.obtenerID() + '', users.map(u => u.anilistId));

        const embedAnime = this.embeds[this.page];
        const embedScores = EmbedScores.Create(scores).setColor(anime.obtenerColor());

        const embeds = (!scores.isEmpty()) ?
            [embedAnime, embedScores] : [embedAnime];

        const res = await this.interaction.editReply({
            embeds: embeds,
            components: [this.row]
        })

        try {
            const collector = res.createMessageComponentCollector({
                time: CommandInteraction.TIEMPO_ESPERA_INTERACCION
            });
            
            collector.on('collect', async (button: ButtonInteraction) => {
                await button.deferUpdate();

                if (button.customId === Button.PreviousButtonID) {
                    this.page--;
                    if (this.page < 0) this.page = this.lastPage;  
                }

                if (button.customId === Button.NextButtonID) {
                    this.page++;
                    if (this.page > this.lastPage) this.page = 0;
                }

                await this.updateInteraction(button);
            })
        } catch (error) {
            await this.interaction.editReply({ components: [] });
            console.error(error);
        }
    }

    private async updateInteraction (button: ButtonInteraction): Promise<void> {
        const users = this.bot.servers.getUsers(button.guildId);

        try {
            const anime = this.animes[this.page];
            const scores = await AnilistAPI.fetchUsersScores(anime.obtenerID() + '', users.map(u => u.anilistId));

            if (scores.isEmpty()) {
                await button.editReply({ embeds: [this.embeds[this.page]], components: [this.row] });
            } else {
                const embedScores = EmbedScores.Create(scores).setColor(anime.obtenerColor());
                await button.editReply({ embeds: [this.embeds[this.page], embedScores], components: [this.row] }); 
            }
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.toLowerCase().includes('too many requests')) {
                    await button.editReply({ embeds: [this.embeds[this.page]], components: [] });
                    return;
                }
            }

            await button.editReply({ embeds: [this.embeds[this.page]], components: [this.row] });
            console.error(error);
        }
    }
}