import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CacheType, ChatInputCommandInteraction, EmbedBuilder, ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import CommandInteraction from "../interactions/CommandInteraction";
import AnilistAPI from "../apis/anilist/AnilistAPI";
import Embed from "../embeds/Embed";
import Postgres from "../../database/postgres";

module.exports = {
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Enlaza tu cuenta de anilist.')
        .setDMPermission(false),
    execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
        const queryMembership = await Postgres.query() `
            SELECT * FROM
                membership
            WHERE
                id_user = ${interaction.user.id} and
                id_server = ${interaction.guild.id};
        `;

        if (queryMembership[0]) {
            const errorEmbed = new EmbedBuilder()
                .setColor(Embed.COLOR_RED)
                .setDescription('Ya te encuentras registrado. Si deseas actualizar tu informacion de anilist, primero utiliza \`/unsetup\`.');

            return interaction.reply ({
                ephemeral: true,
                embeds: [errorEmbed]
            })
        }

        const embed = new EmbedBuilder()
            .setColor(0xff8c00)
            .setTitle("Instrucciones")
            .setDescription(EMBED_DESCRIPTION)
            .setFooter({ text: "No compartas los códigos con nadie." });

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

        const res = await interaction.reply ({
            embeds: [embed],
            components: [new ActionRowBuilder<ButtonBuilder>().addComponents(buttonURL, buttonCode)],
            ephemeral: true,
        })

        const collector = res.createMessageComponentCollector({
            time: CommandInteraction.TIEMPO_ESPERA_INTERACCION
        });
        
        try {
            collector.on('collect', async (button) => {            
                if (button.customId === 'buttonCode') {                
                    const modal = new ModalBuilder()
                        .setCustomId('modalCode')
                        .setTitle('Pega tu código aquí');
    
                    const codeInput = new TextInputBuilder()
                        .setCustomId('inputCode')
                        .setLabel('Tu código')
                        .setStyle(TextInputStyle.Paragraph);
    
                    const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(codeInput);
                    modal.addComponents(actionRow);
    
                    await button.showModal(modal);
                    const resModal = await button.awaitModalSubmit({ time: CommandInteraction.TIEMPO_ESPERA_INTERACCION });
                    await resModal.deferReply({ ephemeral: true });
                    const token = resModal.fields.getTextInputValue('inputCode');
    
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
                        throw new Error(results.errors[0].message);
                    }
    
                    await Postgres.query().begin(async sql => {
                        await sql `
                            DELETE FROM 
                                discord_user
                            WHERE
                                id_user != ${interaction.user.id} and
                                id_anilist = ${results.data.Viewer.id};
                        `;
                    })
    
                    await Postgres.query().begin(async sql => {
                        await sql ` 
                            SELECT insert_user (
                                ${interaction.user.id},
                                ${results.data.Viewer.id},
                                ${token}
                            );
                        `;
            
                        await sql `
                            SELECT insert_membership (
                                ${interaction.user.id},
                                ${interaction.guild.id}
                            );
                        `;
                    });
    
                    const desc = `
Autentificación completada correctamente como [${results.data.Viewer.name}](${results.data.Viewer.siteUrl})
▸ Puedes utilizar \`/usuario\` para comprobar tu perfil.                
▸ Si lo deseas o cambias de cuenta de anilist, deberás utilizar \`/unsetup\` para desvincular tu cuenta y luego realizar este proceso nuevamente.
▸ Para conocer otros comandos, utiliza \`/help\`.
`
    
                    const embedAuthorization = new EmbedBuilder()
                        .setDescription(desc)
                        .setColor(Embed.COLOR_GREEN)
    
                    await resModal.editReply ({
                        embeds: [embedAuthorization]
                    })
                }
    
                collector.stop();
            })    
        } catch (error) {
            console.error(error);
        }
    }
}

const EMBED_DESCRIPTION = `
▸ Haz click en el botón **Autorizar**.
▸ Una vez dentro de la página web, debes presionar en **Authorize**.
▸ Se generará tu código de autentificación, debes copiarlo.
▸ Cierra la página web y vuelve aquí, haz click en el botón **Ingresar código**.
▸ Pega el código en el formulario y envíalo.
`;