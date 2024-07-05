import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, CacheType, ChatInputCommandInteraction, EmbedBuilder, Message } from "discord.js";
import Button from "../components/Button";
import CommandInteraction from "./CommandInteraction";
import Bot from "../Bot";
import AnilistAPI from "../apis/anilist/AnilistAPI";
import ScoreCollection from "../apis/anilist/ScoreCollection";
import EmbedScores from "../embeds/EmbedScores";
import Media from "../apis/anilist/modelos/media/Media";
import TooManyRequestsException from "../../errors/TooManyRequestsException";
import Postgres from "../../database/postgres";

export default abstract class InteractionController {
    protected page: number;
    protected lastPage: number;

    protected interaction: ChatInputCommandInteraction<CacheType>;
    protected media: Array<Media>;
    protected embeds: Array<EmbedBuilder>;

    protected bot: Bot;

    protected readonly buttonPreviousPage = Button.CreatePrevious();
    protected readonly buttonNextPage = Button.CreateNext();
    protected readonly row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(this.buttonPreviousPage, this.buttonNextPage);

    constructor (interaction: ChatInputCommandInteraction<CacheType>, media: Array<Media>) {
        this.page = 0;
        this.lastPage = media.length - 1;

        this.interaction = interaction;
        this.media = media;
        this.bot = interaction.client as Bot;
    }

    public abstract execute (): Promise<void>;

    protected async createCollector (res: Message<boolean>): Promise<void> {
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
            throw error;
        }
    }

    protected async updateInteraction (button: ButtonInteraction): Promise<void> {
        const serverId = button.guild.id;
        
        const queryUsers: Array<{ id_user: number, id_server: number, id_anilist: number }> = await Postgres.query() `
            SELECT * FROM
                discord_user
            WHERE
                id_server = ${serverId};
        `;

        try {
            const media = this.media[this.page];
            const scores = await this.fetchUsersUsernames(await AnilistAPI.fetchUsersScores(media.getId() + '', queryUsers.map(u => u.id_anilist+'')));

            if (scores.isEmpty()) {
                await button.editReply({ embeds: [this.embeds[this.page]], components: [this.row] });
            } else {
                const embedScores = EmbedScores.Create(scores).setColor(media.getColor());
                await button.editReply({ embeds: [this.embeds[this.page], embedScores], components: [this.row] }); 
            }
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.toLowerCase().includes('too many requests')) {
                    throw new TooManyRequestsException('Se han realizado demasiadas peticiones al servidor. Inténtalo más tarde.');
                }
            }

            throw error;
        }
    }

    protected async fetchUsersUsernames (scores: ScoreCollection): Promise<ScoreCollection> {
        const serverId = this.interaction.guild.id;
        
        const queryUsers =  await Postgres.query() `
            SELECT * FROM
                discord_user du
            JOIN
                membership mem
            ON
                mem.id_server = ${serverId} and
                mem.id_user = du.id_user;
        `;

        for (const score of scores.getMediaList()) {
            const discordUser = queryUsers.find(u => u.id_anilist == score.user.id);
            score.user.name = (await this.bot.fetchUser(discordUser.id_user)).username;
        }

        return scores;
    }
}