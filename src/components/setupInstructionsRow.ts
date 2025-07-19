import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { ANILIST_AUTH_URL } from "../consts";

export default class SetupInstructionsRow extends ActionRowBuilder<ButtonBuilder> {
    public static readonly buttonId: string = 'buttonCode';
    
    constructor () {
        super();

        const buttonURL = new ButtonBuilder({
            style: ButtonStyle.Link,
            url: ANILIST_AUTH_URL,
            label: 'Autorizar',
        });

        const buttonCode = new ButtonBuilder({
            style: ButtonStyle.Primary,
            custom_id: SetupInstructionsRow.buttonId,
            label: 'Ingresar código',
        });

        this.addComponents(buttonURL, buttonCode);
    };
};