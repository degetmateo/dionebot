import { ChatInputCommandInteraction, CacheType } from "discord.js";
import CommandInteraction from "../CommandInteraction";

export default class SuggestionCommandInteraction extends CommandInteraction {
    protected interaction: ChatInputCommandInteraction<CacheType>;

    constructor (interaction: ChatInputCommandInteraction<CacheType>) {
        super();
        this.interaction = interaction;
    }

    public async execute (): Promise<void> {
        const suggestion = this.interaction.options.getString('suggestion');

        await this.interaction.reply({
            content: 'test completed: ' + suggestion
        })
    }
}