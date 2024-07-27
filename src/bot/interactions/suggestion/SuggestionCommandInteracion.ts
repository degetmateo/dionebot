import { ChatInputCommandInteraction, CacheType, ThreadOnlyChannel, EmbedBuilder } from "discord.js";
import CommandInteraction from "../CommandInteraction";
import Postgres from "../../../database/postgres";
import IllegalArgumentException from "../../../errors/IllegalArgumentException";
import Embed from "../../embeds/Embed";

export default class SuggestionCommandInteraction extends CommandInteraction {
    protected interaction: ChatInputCommandInteraction<CacheType>;

    constructor (interaction: ChatInputCommandInteraction<CacheType>) {
        super();
        this.interaction = interaction;
    }

    public async execute (): Promise<void> {
        await this.interaction.deferReply({ ephemeral: true });
        const suggestion = this.interaction.options.getString('suggestion');
    
        const queryUser = await Postgres.query() `
            SELECT * FROM
                discord_user
            WHERE 
                id_user = ${this.interaction.user.id};
        `;

        if (!queryUser[0]) {
            throw new IllegalArgumentException ('Para enviar una sugerencia, primero debes vincular tu cuenta de anilist con ``/setup``.');
        }

        await Postgres.query().begin(async sql => {
            await sql `
                SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
            `;

            await sql `
                SELECT insert_suggestion (
                    ${this.interaction.user.id},
                    ${suggestion}
                );
            `;
        });

        const embed = new EmbedBuilder()
            .setColor(Embed.COLOR_GREEN)
            .setDescription(
                'Hemos recibido satisfactoriamente tu sugerencia. Evaluaremos lo antes posible su viabilidad.\n\n'+
                `▸ \`${suggestion}\``
            );

        await this.interaction.editReply({
            embeds: [embed]
        })
    }
}