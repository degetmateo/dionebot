"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Button_1 = __importDefault(require("../../components/Button"));
const CommandInteraction_1 = __importDefault(require("../CommandInteraction"));
class AfinidadInteractionController {
    constructor(interaction, embeds) {
        this.interaction = interaction;
        this.embeds = embeds;
        this.index = 0;
        this.lastIndex = this.embeds.length - 1;
        this.nextPageButton = Button_1.default.CreateNext();
        this.previousPageButton = Button_1.default.CreatePrevious();
        this.row = new discord_js_1.ActionRowBuilder()
            .addComponents(this.previousPageButton, this.nextPageButton);
    }
    async execute() {
        const res = await this.interaction.edit({
            embeds: [this.embeds[0]],
            components: [this.row]
        });
        try {
            const collector = res.createMessageComponentCollector({
                time: CommandInteraction_1.default.TIEMPO_ESPERA_INTERACCION
            });
            collector.on('collect', async (button) => {
                await button.deferUpdate();
                if (button.customId === Button_1.default.PreviousButtonID) {
                    this.index--;
                    if (this.index < 0)
                        this.index = this.lastIndex;
                }
                if (button.customId === Button_1.default.NextButtonID) {
                    this.index++;
                    if (this.index > this.lastIndex)
                        this.index = 0;
                }
                await this.updateInteraction(button);
            });
        }
        catch (error) {
            await this.interaction.edit({ components: [] });
            console.error(error);
        }
    }
    async updateInteraction(button) {
        try {
            await button.editReply({ embeds: [this.embeds[this.index]], components: [this.row] });
        }
        catch (error) {
            console.error(error);
            await button.editReply({ embeds: [this.embeds[this.index]], components: [] });
        }
    }
}
exports.default = AfinidadInteractionController;
