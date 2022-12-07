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

        const memberRolesManager = interaction.member?.roles as GuildMemberRoleManager;
        const memberColorRole = memberRolesManager.cache.find(r => r.name === interaction.member?.user.username);

        if (!memberColorRole) {
            const guildColorRole = interaction.guild?.roles.cache.find(r => r.name === interaction.member?.user.username);

            if (!guildColorRole) {
                try {
                    const newRole = await interaction.guild?.roles.create({
                        name: interaction.member?.user.username,
                        color: color
                    });
                    
                    if (!newRole) {
                        throw new Error("Ha ocurrido un error al intentar crear el nuevo rol.");
                    }
    
                    memberRolesManager.add(newRole);
                } catch (err) {
                    console.error(err);
                    throw err;
                }
            } else {
                try {
                    guildColorRole.setColor(color);
                    memberRolesManager.add(guildColorRole);   
                } catch (err) {
                    console.error(err);
                    throw err;
                }
            }
        } else {
            try {
                const newMemberRole = await memberColorRole.setColor(color);

                if (!newMemberRole) {
                    throw new Error("Ha ocurrido un error al intentar modificar el color del rol.");
                }   
            } catch (err) {
                console.error(err);
                throw err;
            }
        }

        return interaction.editReply({
            content: "Listo!",
        })
    }
}