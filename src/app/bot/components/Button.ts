import { ButtonBuilder, ButtonStyle, ComponentType } from "discord.js";

export default class Button extends ButtonBuilder {
    public static readonly LabelNextButton: string = '→';
    public static readonly LabelPreviousButton: string = '←';

    public static readonly NextButtonID: string = 'nextButton';
    public static readonly PreviousButtonID: string = 'previousButton';

    private constructor () {
        super({
            type: ComponentType.Button,
            style: ButtonStyle.Primary,
        });
    }

    public static CreateNext () {
        return new Button()
            .setLabel(Button.LabelNextButton)
            .setCustomId(Button.NextButtonID);
    }

    public static CreatePrevious () {
        return new Button()
            .setLabel(Button.LabelPreviousButton)
            .setCustomId(Button.PreviousButtonID);
    }
}