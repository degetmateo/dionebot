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
        var _a, _b, _c, _d, _e, _f, _g, _h;
        await interaction.deferReply({ ephemeral: true });
        const colorCode = (_a = interaction.options.getString("hex-code")) === null || _a === void 0 ? void 0 : _a.toLowerCase().split("0x").join("").split("#").join("");
        const color = ("0x" + (colorCode === null || colorCode === void 0 ? void 0 : colorCode.toUpperCase()));
        const memberRolesManager = (_b = interaction.member) === null || _b === void 0 ? void 0 : _b.roles;
        // const memberColorRole = memberRolesManager.cache.find(r => r.name === "Color - " + interaction.member?.user.username);
        const memberColorRole = await memberRolesManager.cache.find(r => r.name.startsWith("Color"));
        if (!memberColorRole) {
            const guildColorRole = (_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.roles.cache.find(r => { var _a; return r.name === ((_a = interaction.member) === null || _a === void 0 ? void 0 : _a.user.username); });
            if (!guildColorRole) {
                try {
                    const newRole = await ((_d = interaction.guild) === null || _d === void 0 ? void 0 : _d.roles.create({
                        name: "Color - " + ((_e = interaction.member) === null || _e === void 0 ? void 0 : _e.user.username),
                        color: color
                    }));
                    if (!newRole) {
                        throw new Error("Ha ocurrido un error al intentar crear el nuevo rol.");
                    }
                    memberRolesManager.add(newRole);
                }
                catch (err) {
                    console.error(err);
                    return interaction.editReply({
                        content: "Ha ocurrido un error inesperado. Inténtalo de nuevo más tarde."
                    });
                }
            }
            else {
                try {
                    guildColorRole.setColor(color);
                    memberRolesManager.add(guildColorRole);
                }
                catch (err) {
                    console.error(err);
                    return interaction.editReply({
                        content: "Ha ocurrido un error inesperado. Inténtalo de nuevo más tarde."
                    });
                }
            }
        }
        else {
            try {
                if ((memberColorRole === null || memberColorRole === void 0 ? void 0 : memberColorRole.name) != "Color - " + ((_f = interaction.member) === null || _f === void 0 ? void 0 : _f.user.username)) {
                    await memberRolesManager.remove(memberColorRole);
                    const newRole = await ((_g = interaction.guild) === null || _g === void 0 ? void 0 : _g.roles.create({
                        name: "Color - " + ((_h = interaction.member) === null || _h === void 0 ? void 0 : _h.user.username),
                        color: color
                    }));
                    if (!newRole) {
                        throw new Error("Ha ocurrido un error al intentar crear el nuevo rol.");
                    }
                    memberRolesManager.add(newRole);
                }
                else {
                    const newMemberRole = await memberColorRole.setColor(color);
                    if (!newMemberRole) {
                        throw new Error("Ha ocurrido un error al intentar modificar el color del rol.");
                    }
                }
            }
            catch (err) {
                console.error(err);
                return interaction.editReply({
                    content: "Ha ocurrido un error inesperado. Inténtalo de nuevo más tarde."
                });
            }
        }
        return interaction.editReply({
            content: "Listo!",
        });
    }
};
