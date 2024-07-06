"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const CommandInteraction_1 = __importDefault(require("../interactions/CommandInteraction"));
const AnilistAPI_1 = __importDefault(require("../apis/anilist/AnilistAPI"));
const Embed_1 = __importDefault(require("../embeds/Embed"));
const postgres_1 = __importDefault(require("../../database/postgres"));
module.exports = {
    cooldown: 0,
    data: new discord_js_1.SlashCommandBuilder()
        .setName('setup')
        .setDescription('Enlaza tu cuenta de anilist.')
        .setDMPermission(false),
    execute: async (interaction) => {
        const queryMembership = await postgres_1.default.query() `
            SELECT * FROM
                membership
            WHERE
                id_user = ${interaction.user.id} and
                id_server = ${interaction.guild.id};
        `;
        if (queryMembership[0]) {
            const errorEmbed = new discord_js_1.EmbedBuilder()
                .setColor(Embed_1.default.COLOR_RED)
                .setDescription('Ya te encuentras registrado. Si deseas actualizar tu informacion de anilist, primero utiliza \`/unsetup\`.');
            return interaction.reply({
                ephemeral: true,
                embeds: [errorEmbed]
            });
        }
        const embed = new discord_js_1.EmbedBuilder()
            .setColor(0xff8c00)
            .setTitle("Instrucciones")
            .setDescription(EMBED_DESCRIPTION)
            .setFooter({ text: "No compartas los códigos con nadie." });
        const buttonURL = new discord_js_1.ButtonBuilder({
            style: discord_js_1.ButtonStyle.Link,
            url: process.env.ANILIST_AUTH_URL,
            label: 'Autorizar',
        });
        const buttonCode = new discord_js_1.ButtonBuilder({
            style: discord_js_1.ButtonStyle.Primary,
            custom_id: 'buttonCode',
            label: 'Ingresar código',
        });
        const res = await interaction.reply({
            embeds: [embed],
            components: [new discord_js_1.ActionRowBuilder().addComponents(buttonURL, buttonCode)],
            ephemeral: true,
        });
        const collector = res.createMessageComponentCollector({
            time: CommandInteraction_1.default.TIEMPO_ESPERA_INTERACCION
        });
        try {
            collector.on('collect', async (button) => {
                if (button.customId === 'buttonCode') {
                    const modal = new discord_js_1.ModalBuilder()
                        .setCustomId('modalCode')
                        .setTitle('Pega tu código aquí');
                    const codeInput = new discord_js_1.TextInputBuilder()
                        .setCustomId('inputCode')
                        .setLabel('Tu código')
                        .setStyle(discord_js_1.TextInputStyle.Paragraph);
                    const actionRow = new discord_js_1.ActionRowBuilder().addComponents(codeInput);
                    modal.addComponents(actionRow);
                    await button.showModal(modal);
                    const resModal = await button.awaitModalSubmit({ time: CommandInteraction_1.default.TIEMPO_ESPERA_INTERACCION });
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
                    const results = await AnilistAPI_1.default.authorizedFetch(token, query);
                    if (results.errors || !results.data) {
                        throw new Error(results.errors[0].message);
                    }
                    await postgres_1.default.query().begin(async (sql) => {
                        await sql `
                            DELETE FROM 
                                discord_user
                            WHERE
                                id_user != ${interaction.user.id} and
                                id_anilist = ${results.data.Viewer.id};
                        `;
                    });
                    await postgres_1.default.query().begin(async (sql) => {
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
`;
                    const embedAuthorization = new discord_js_1.EmbedBuilder()
                        .setDescription(desc)
                        .setColor(Embed_1.default.COLOR_GREEN);
                    await resModal.editReply({
                        embeds: [embedAuthorization]
                    });
                }
                collector.stop();
            });
        }
        catch (error) {
            console.error(error);
        }
    }
};
const EMBED_DESCRIPTION = `
▸ Haz click en el botón **Autorizar**.
▸ Una vez dentro de la página web, debes presionar en **Authorize**.
▸ Se generará tu código de autentificación, debes copiarlo.
▸ Cierra la página web y vuelve aquí, haz click en el botón **Ingresar código**.
▸ Pega el código en el formulario y envíalo.
`;
