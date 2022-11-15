"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("color")
        .setDescription("Crea un rol con tu nombre y el color especificado y te lo otorga.")
        .addStringOption(option => option
        .setName("hex-code")
        .setDescription("Código hexadecimal del color.")
        .setRequired(true)),
    execute: async (interaction) => {
        var _a, _b, _c, _d, _e;
        await interaction.deferReply({ ephemeral: true });
        const colorCode = (_a = interaction.options.getString("hex-code")) === null || _a === void 0 ? void 0 : _a.toLowerCase().split("0x").join("").split("#").join("");
        const color = ("0x" + (colorCode === null || colorCode === void 0 ? void 0 : colorCode.toUpperCase()));
        if (!color) {
            return interaction.editReply({
                content: "Ha ocurrido un error.",
            });
        }
        const memberRolesManager = (_b = interaction.member) === null || _b === void 0 ? void 0 : _b.roles;
        const memberColorRole = memberRolesManager.cache.find(r => { var _a; return r.name === ((_a = interaction.member) === null || _a === void 0 ? void 0 : _a.user.username); });
        if (!memberColorRole) {
            const guildColorRole = (_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.roles.cache.find(r => { var _a; return r.name === ((_a = interaction.member) === null || _a === void 0 ? void 0 : _a.user.username); });
            if (!guildColorRole) {
                const newRole = await ((_d = interaction.guild) === null || _d === void 0 ? void 0 : _d.roles.create({
                    name: (_e = interaction.member) === null || _e === void 0 ? void 0 : _e.user.username,
                    color: color
                }));
                if (!newRole) {
                    return interaction.editReply({
                        content: "Ha ocurrido un error.",
                    });
                }
                memberRolesManager.add(newRole);
            }
            else {
                guildColorRole.setColor(color);
                memberRolesManager.add(guildColorRole);
            }
        }
        else {
            const newMemberRole = await memberColorRole.setColor(color);
            if (!newMemberRole) {
                return interaction.editReply({
                    content: "Ha ocurrido un error.",
                });
            }
        }
        return interaction.editReply({
            content: "Listo!",
        });
    }
};
