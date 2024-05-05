import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, CacheType, ChatInputCommandInteraction, EmbedBuilder, InteractionResponse } from "discord.js";
import Button from "../../components/Button";
import CommandInteraction from "../CommandInteraction";

export default class AfinidadInteractionController {
    private interaction: InteractionResponse<boolean>;
    private embeds: Array<EmbedBuilder>;

    private index: number;
    private lastIndex: number;

    private nextPageButton: Button;
    private previousPageButton: Button;

    private row: ActionRowBuilder<ButtonBuilder>;

    constructor (interaction: InteractionResponse<boolean>, embeds: Array<EmbedBuilder>) {
        this.interaction = interaction;
        this.embeds = embeds;

        this.index = 0;
        this.lastIndex = this.embeds.length - 1;

        this.nextPageButton = Button.CreateNext();
        this.previousPageButton = Button.CreatePrevious();

        this.row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(this.previousPageButton, this.nextPageButton);
    }

    public async execute () {
        const res = await this.interaction.edit({
            embeds: [this.embeds[0]],
            components: [this.row]
        })

        try {
            const collector = res.createMessageComponentCollector({
                time: CommandInteraction.TIEMPO_ESPERA_INTERACCION
            });

            
            collector.on('collect', async (button: ButtonInteraction) => {
                await button.deferUpdate();

                if (button.customId === Button.PreviousButtonID) {
                    this.index--;
                    if (this.index < 0) this.index = this.lastIndex;  
                }

                if (button.customId === Button.NextButtonID) {
                    this.index++;
                    if (this.index > this.lastIndex) this.index = 0;
                }

                await this.updateInteraction(button);
            })
        } catch (error) {
            await this.interaction.edit({ components: [] });
            console.error(error);
        }
    }

    private async updateInteraction (button: ButtonInteraction<CacheType>) {
        try {
            await button.editReply({ embeds: [this.embeds[this.index]], components: [this.row] }); 
        } catch (error) {            
            console.error(error);
            await button.editReply({ embeds: [this.embeds[this.index]], components: [] });
        }
    }
}