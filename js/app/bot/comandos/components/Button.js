"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class Button extends discord_js_1.ButtonBuilder {
    constructor() {
        super({
            type: discord_js_1.ComponentType.Button,
            style: discord_js_1.ButtonStyle.Primary,
        });
    }
    static CreateNext() {
        return new Button()
            .setLabel(Button.LabelNextButton)
            .setCustomId(Button.NextButtonID);
    }
    static CreatePrevious() {
        return new Button()
            .setLabel(Button.LabelPreviousButton)
            .setCustomId(Button.PreviousButtonID);
    }
}
Button.LabelNextButton = '→';
Button.LabelPreviousButton = '←';
Button.NextButtonID = 'nextButton';
Button.PreviousButtonID = 'previousButton';
exports.default = Button;
