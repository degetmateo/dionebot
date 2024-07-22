"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const colornames_1 = __importDefault(require("colornames"));
const CommandInteraction_1 = __importDefault(require("../CommandInteraction"));
const GenericException_1 = __importDefault(require("../../../errors/GenericException"));
const AnilistAPI_1 = __importDefault(require("../../apis/anilist/AnilistAPI"));
const Embed_1 = __importDefault(require("../../embeds/Embed"));
const postgres_1 = __importDefault(require("../../../database/postgres"));
class SetupCommandInteraction extends CommandInteraction_1.default {
    constructor(interaction) {
        super();
        this.interaction = interaction;
    }
    async execute() {
        const queryMembership = await postgres_1.default.query() `
            SELECT * FROM
                membership
            WHERE
                id_user = ${this.interaction.user.id} and
                id_server = ${this.interaction.guild.id};
        `;
        if (queryMembership[0]) {
            throw new GenericException_1.default('Ya te encuentras registrado. Si deseas actualizar tu informacion de anilist, primero utiliza \`/unsetup\`.');
        }
        const queryServer = await postgres_1.default.query() `
            SELECT * FROM
                discord_server
            WHERE
                id_server = ${this.interaction.guild.id};
        `;
        if (queryServer[0].user_count >= SetupCommandInteraction.MAX_USERS) {
            throw new GenericException_1.default('Se ha alcanzado el número máximo de usuarios registrados en este servidor.');
        }
        try {
            const res = await this.interaction.reply({
                embeds: [this.createInstructionsEmbed()],
                components: [this.createInstructionsRow()],
                ephemeral: true,
            });
            await this.createCollector(res);
        }
        catch (error) {
            throw error;
        }
    }
    createInstructionsEmbed() {
        return new discord_js_1.EmbedBuilder()
            .setColor(0xff8c00)
            .setTitle("Instrucciones")
            .setDescription(EMBED_INSTRUCTIONS_DESCRIPTION)
            .setFooter({ text: "No compartas los códigos con nadie." });
    }
    createInstructionsRow() {
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
        return new discord_js_1.ActionRowBuilder().addComponents(buttonURL, buttonCode);
    }
    async createCollector(res) {
        const collector = res.createMessageComponentCollector({
            time: CommandInteraction_1.default.TIEMPO_ESPERA_INTERACCION
        });
        collector.on('collect', async (button) => {
            if (button.customId === 'buttonCode') {
                let modal;
                try {
                    await button.showModal(this.createModal());
                    modal = await button.awaitModalSubmit({ time: CommandInteraction_1.default.TIEMPO_ESPERA_INTERACCION });
                    await modal.deferReply({ ephemeral: true });
                    await this.validateToken(modal);
                }
                catch (error) {
                    console.error(error);
                    if (modal) {
                        modal.editReply({
                            embeds: [
                                new discord_js_1.EmbedBuilder()
                                    .setColor(Embed_1.default.COLOR_RED)
                                    .setDescription('Ha ocurrido un error. Intentalo de nuevo mas tarde.')
                            ]
                        });
                    }
                }
            }
        });
    }
    createModal() {
        const codeInput = new discord_js_1.TextInputBuilder()
            .setCustomId('inputCode')
            .setLabel('Tu código')
            .setStyle(discord_js_1.TextInputStyle.Paragraph);
        const row = new discord_js_1.ActionRowBuilder().addComponents(codeInput);
        const modal = new discord_js_1.ModalBuilder()
            .setCustomId('modalCode')
            .setTitle('Pega tu código aquí');
        return modal.addComponents(row);
    }
    async validateToken(modal) {
        const token = modal.fields.getTextInputValue('inputCode');
        const query = `
            query {
                Viewer {
                    id
                    name
                    siteUrl
                    avatar {
                        large
                    }
                    options {
                        profileColor                    
                    }   
                }
            }
        `;
        const results = await AnilistAPI_1.default.authorizedFetch(token, query);
        if (results.errors || !results.data) {
            await modal.editReply({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setColor(Embed_1.default.COLOR_RED)
                        .setDescription('Token ingresado invalido. Verifica que lo hayas copiado bien.')
                ]
            });
            console.error(results.errors);
            return;
        }
        try {
            await this.saveUser(results.data.Viewer, token);
            const desc = `
Autentificación completada correctamente como [${results.data.Viewer.name}](${results.data.Viewer.siteUrl}).

▸ Ahora puedes utilizar </usuario:1259062709849296896> para comprobar tu perfil.
▸ Ahora tus notas se mostrarán al buscar un anime o manga (si lo tienes agregado).                
▸ Si lo deseas, puedes usar </unsetup:1259062709647839302> para desvincular tu cuenta actual.
▸ Para conocer otros comandos, utiliza </help:1259062709647839296>.
`;
            const embedAuthorization = new discord_js_1.EmbedBuilder()
                .setDescription(desc)
                .setColor((0, colornames_1.default)(results.data.Viewer.options.profileColor))
                .setThumbnail(results.data.Viewer.avatar.large);
            await modal.editReply({
                embeds: [embedAuthorization]
            });
        }
        catch (error) {
            console.error(error);
            await modal.editReply({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setColor(Embed_1.default.COLOR_RED)
                        .setDescription('Ha ocurrido al intentar guardar el usuario. Intentalo de nuevo mas tarde.')
                ]
            });
            return;
        }
    }
    async saveUser(viewer, token) {
        await postgres_1.default.query().begin(async (sql) => {
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
SetupCommandInteraction.MAX_USERS = 20;
exports.default = SetupCommandInteraction;
const EMBED_INSTRUCTIONS_DESCRIPTION = `
▸ Haz click en el botón **Autorizar**.
▸ Una vez dentro de la página web, debes presionar en **Authorize**.
▸ Se generará tu código de autentificación, debes copiarlo.
▸ Cierra la página web y vuelve aquí, haz click en el botón **Ingresar código**.
▸ Pega el código en el formulario y envíalo.
`;
