"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class ComandoInformacion {
    constructor() {
        this.cooldown = 5;
        this.datos = new discord_js_1.SlashCommandBuilder()
            .setName("informacion")
            .setDescription("Obtén información acerca de mi!");
        this.DESCRIPCION = `
Mi nombre es Dione y soy un bot de Discord que está siendo desarrollado en TypeScript.\n
Mis funciones principales incluyen buscar y mostrar información acerca de animes, mangas y novelas visuales en tu servidor.\n
Aunque aún no poseo demasiadas opciones, en el futuro se irán implementando muchas más.\n
Si lo deseas, puedes invitarme a tu servidor presionando el enlace que se encuentra debajo.\n
https://dionebot.onrender.com/
    `;
    }
    async execute(interaction) {
        var _a;
        await interaction.deferReply();
        const bot = interaction.client;
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle("Información")
            .setDescription(this.DESCRIPCION)
            .setColor(0xff8c00)
            .setFooter({ text: `Dione v${bot.obtenerVersion()}` });
        ((_a = bot.user) === null || _a === void 0 ? void 0 : _a.avatarURL()) ? embed.setThumbnail(bot.user.avatarURL()) : null;
        await interaction.editReply({
            embeds: [embed]
        });
    }
}
exports.default = ComandoInformacion;
