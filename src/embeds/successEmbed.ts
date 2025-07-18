import { Colors, EmbedBuilder } from "discord.js";

export default class SuccessEmbed extends EmbedBuilder {
    constructor (message: string) {
        super();

        this.setColor(Colors.Green);
        this.setDescription(message);
    };
};