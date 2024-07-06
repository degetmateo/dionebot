import { ChatInputCommandInteraction, CacheType, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, InteractionResponse, TextInputBuilder, ModalBuilder, TextInputStyle, ModalSubmitInteraction } from "discord.js";
import CommandInteraction from "../CommandInteraction";
import GenericException from "../../../errors/GenericException";
import AnilistAPI from "../../apis/anilist/AnilistAPI";
import Embed from "../../embeds/Embed";
import Postgres from "../../../database/postgres";

export default class SetupCommandInteraction extends CommandInteraction {
    private static readonly MAX_USERS = 20;
    protected interaction: ChatInputCommandInteraction<CacheType>;
    
    constructor (interaction: ChatInputCommandInteraction<CacheType>) {
        super();
        this.interaction = interaction;
    }

    public async execute (): Promise<void> {
        const queryMembership = await Postgres.query() `
            SELECT * FROM
                membership
            WHERE
                id_user = ${this.interaction.user.id} and
                id_server = ${this.interaction.guild.id};
        `;

        if (queryMembership[0]) {
            throw new GenericException ('Ya te encuentras registrado. Si deseas actualizar tu informacion de anilist, primero utiliza \`/unsetup\`.');
        }

        const queryServer = await Postgres.query() `
            SELECT * FROM
                discord_server
            WHERE
                id_server = ${this.interaction.guild.id};
        `;

        if (queryServer[0].user_count >= SetupCommandInteraction.MAX_USERS) {
            throw new GenericException ('Se ha alcanzado el número máximo de usuarios registrados en este servidor.');
        }

        try {
            const res = await this.interaction.reply ({
                embeds: [this.createInstructionsEmbed()],
                components: [this.createInstructionsRow()],
                ephemeral: true,
            })
    
            await this.createCollector(res);            
        } catch (error) {
            throw error;   
        }
    }

    private createInstructionsEmbed (): EmbedBuilder {
        return new EmbedBuilder()            
            .setColor(0xff8c00)
            .setTitle("Instrucciones")
            .setDescription(EMBED_INSTRUCTIONS_DESCRIPTION)
            .setFooter({ text: "No compartas los códigos con nadie." });
    }

    private createInstructionsRow (): ActionRowBuilder<ButtonBuilder> {
        const buttonURL = new ButtonBuilder({
            style: ButtonStyle.Link,
            url: process.env.ANILIST_AUTH_URL,
            label: 'Autorizar',
        })

        const buttonCode = new ButtonBuilder({
            style: ButtonStyle.Primary,
            custom_id: 'buttonCode',
            label: 'Ingresar código',
        })

        return new ActionRowBuilder<ButtonBuilder>().addComponents(buttonURL, buttonCode);
    }

    private async createCollector (res: InteractionResponse<boolean>) {
        const collector = res.createMessageComponentCollector({
            time: CommandInteraction.TIEMPO_ESPERA_INTERACCION
        });

        collector.on('collect', async button => {
            if (button.customId === 'buttonCode') {
                let modal: ModalSubmitInteraction<CacheType>;
                try {
                    await button.showModal(this.createModal());
                    modal = await button.awaitModalSubmit({ time: CommandInteraction.TIEMPO_ESPERA_INTERACCION });
                    await modal.deferReply({ ephemeral: true });
                    await this.validateToken(modal);
                } catch (error) {
                    console.error(error);
                    if (modal) {
                        modal.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(Embed.COLOR_RED)
                                    .setDescription('Ha ocurrido un error. Intentalo de nuevo mas tarde.')
                            ]
                        })
                    }
                }
            }
        })
    }

    private createModal () {
        const codeInput = new TextInputBuilder()
            .setCustomId('inputCode')
            .setLabel('Tu código')
            .setStyle(TextInputStyle.Paragraph);

        const row = new ActionRowBuilder<TextInputBuilder>().addComponents(codeInput);

        const modal = new ModalBuilder()
            .setCustomId('modalCode')
            .setTitle('Pega tu código aquí');

        return modal.addComponents(row);
    }

    private async validateToken (modal: ModalSubmitInteraction<CacheType>) {
        const token = modal.fields.getTextInputValue('inputCode');

        const query = `
            query {
                Viewer {
                    id
                    name
                    siteUrl
                }
            }
        `;

        const results = await AnilistAPI.authorizedFetch(token, query);

        if (results.errors || !results.data) {
            await modal.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Embed.COLOR_RED)
                        .setDescription('Token ingresado invalido. Verifica que lo hayas copiado bien.')
                ]
            })

            console.error(results.errors);
            return;
        }

        try {
            await this.saveUser(results.data.Viewer, token);

            const desc = `
Autentificación completada correctamente como [${results.data.Viewer.name}](${results.data.Viewer.siteUrl})
▸ Puedes utilizar \`/usuario\` para comprobar tu perfil.                
▸ Si lo deseas o cambias de cuenta de anilist, deberás utilizar \`/unsetup\` para desvincular tu cuenta y luego realizar este proceso nuevamente.
▸ Para conocer otros comandos, utiliza \`/help\`.
`

            const embedAuthorization = new EmbedBuilder()
                .setDescription(desc)
                .setColor(Embed.COLOR_GREEN)

            await modal.editReply ({
                embeds: [embedAuthorization]
            })
        } catch (error) {
            console.error(error);
            await modal.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Embed.COLOR_RED)
                        .setDescription('Ha ocurrido al intentar guardar el usuario. Intentalo de nuevo mas tarde.')
                ]
            })

            return;
        }
    }

    private async saveUser (viewer: Viewer, token: string) {
        await Postgres.query().begin(async sql => {
            await sql `
                DELETE FROM 
                    discord_user
                WHERE
                    id_user != ${this.interaction.user.id} and
                    id_anilist = ${viewer.id};
            `;

            await sql ` 
                SELECT insert_user (
                    ${this.interaction.user.id},
                    ${viewer.id},
                    ${token}
                );
            `;

            await sql `
                SELECT insert_membership (
                    ${this.interaction.user.id},
                    ${this.interaction.guild.id}
                );
            `;
        });
    }
}

const EMBED_INSTRUCTIONS_DESCRIPTION = `
▸ Haz click en el botón **Autorizar**.
▸ Una vez dentro de la página web, debes presionar en **Authorize**.
▸ Se generará tu código de autentificación, debes copiarlo.
▸ Cierra la página web y vuelve aquí, haz click en el botón **Ingresar código**.
▸ Pega el código en el formulario y envíalo.
`;

export type Viewer = {
    id: number,
    name: string,
    siteUrl: string
}