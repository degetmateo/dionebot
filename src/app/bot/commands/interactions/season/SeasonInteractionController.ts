import { ChatInputCommandInteraction, CacheType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonInteraction, Message } from "discord.js";
import CommandInteraction from "../CommandInteraction";
import Button from "../../components/Button";

export default class SeasonInteractionController {
    private interaction: ChatInputCommandInteraction<CacheType>;
    private embeds: Array<EmbedBuilder>;

    private page: number;
    private lastPage: number;

    private row: ActionRowBuilder<ButtonBuilder>;

    constructor (interaction: ChatInputCommandInteraction<CacheType>, embeds: Array<EmbedBuilder>) {
        this.interaction = interaction;
        this.embeds = embeds;

        this.page = 0;
        this.lastPage = embeds.length - 1;

        this.row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(Button.CreatePrevious(), Button.CreateNext());
    }

    public async execute (): Promise<void> {
        if (this.embeds.length === 1) {
            await this.interaction.editReply({ embeds: this.embeds });
            return;
        }
        
        const res = await this.interaction.editReply({
            embeds: this.embeds,
            components: [this.row]
        })

        await this.createCollector(res);
    }

    private async createCollector (res: Message<boolean>): Promise<void> {
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
        try {
            await button.editReply({ embeds: [this.embeds[this.page]], components: [this.row] });
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