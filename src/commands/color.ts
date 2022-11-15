import { ChatInputCommandInteraction, ColorResolvable, GuildMemberRoleManager, SlashCommandBuilder } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("color")
        .setDescription("Crea un rol con tu nombre y el color especificado y te lo otorga.")
        .addStringOption(option =>
            option
                .setName("hex-code")
                .setDescription("Código hexadecimal del color.")
                .setRequired(true)),

    execute: async (interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply({ ephemeral: true });
        
        const colorCode = interaction.options.getString("hex-code")
            ?.toLowerCase()
            .split("0x").join("")
            .split("#").join("");

        const color = ("0x" + colorCode?.toUpperCase()) as ColorResolvable;

        if (!color) {
            return interaction.editReply({
                content: "Ha ocurrido un error.",
            })
        }

        const memberRolesManager = interaction.member?.roles as GuildMemberRoleManager;
        const memberColorRole = memberRolesManager.cache.find(r => r.name === interaction.member?.user.username);

        if (!memberColorRole) {
            const guildColorRole = interaction.guild?.roles.cache.find(r => r.name === interaction.member?.user.username);

            if (!guildColorRole) {
                const newRole = await interaction.guild?.roles.create({
                    name: interaction.member?.user.username,
                    color: color
                });

                if (!newRole) {
                    return interaction.editReply({
                        content: "Ha ocurrido un error.",
                    })
                }

                memberRolesManager.add(newRole);
            } else {
                guildColorRole.setColor(color);
                memberRolesManager.add(guildColorRole);
            }
        } else {
            const newMemberRole = await memberColorRole.setColor(color);

            if (!newMemberRole) {
                return interaction.editReply({
                    content: "Ha ocurrido un error.",
                })
            }
        }

        return interaction.editReply({
            content: "Listo!",
        })
    }
}