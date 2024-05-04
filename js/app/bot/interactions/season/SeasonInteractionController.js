"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const CommandInteraction_1 = __importDefault(require("../CommandInteraction"));
const Button_1 = __importDefault(require("../../components/Button"));
class SeasonInteractionController {
    constructor(interaction, embeds) {
        this.interaction = interaction;
        this.embeds = embeds;
        this.page = 0;
        this.lastPage = embeds.length - 1;
        this.row = new discord_js_1.ActionRowBuilder()
            .addComponents(Button_1.default.CreatePrevious(), Button_1.default.CreateNext());
    }
    async execute() {
        if (this.embeds.length === 1) {
            await this.interaction.editReply({ embeds: this.embeds });
            return;
        }
        const res = await this.interaction.editReply({
            embeds: this.embeds,
            components: [this.row]
        });
        await this.createCollector(res);
    }
    async createCollector(res) {
        try {
            const collector = res.createMessageComponentCollector({
                time: CommandInteraction_1.default.TIEMPO_ESPERA_INTERACCION
            });
            collector.on('collect', async (button) => {
                await button.deferUpdate();
                if (button.customId === Button_1.default.PreviousButtonID) {
                    this.page--;
                    if (this.page < 0)
                        this.page = this.lastPage;
                }
                if (button.customId === Button_1.default.NextButtonID) {
                    this.page++;
                    if (this.page > this.lastPage)
                        this.page = 0;
                }
                await this.updateInteraction(button);
            });
        }
        catch (error) {
            await this.interaction.editReply({ components: [] });
            console.error(error);
        }
    }
    async updateInteraction(button) {
        try {
            await button.editReply({ embeds: [this.embeds[this.page]], components: [this.row] });
        }
        catch (error) {
            if (error.message.toLowerCase().includes('too many requests')) {
                await button.editReply({ embeds: [this.embeds[this.page]], components: [] });
                return;
            }
            throw error;
        }
    }
}
exports.default = SeasonInteractionController;
