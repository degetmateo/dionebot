import { EmbedBuilder, InteractionContextType, SlashCommandBuilder } from "discord.js";
import GuildChatInputCommandInteraction from "../../extensions/guildChatInputCommandInteraction.extension";

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('patch-notes')
        .setDescription('List of the latest changes.')
        .setContexts(InteractionContextType.Guild)
        .setNSFW(false),
    execute: async (interaction: GuildChatInputCommandInteraction) => {
        const embed = new EmbedBuilder()
            .setTitle('Últimos cambios...')
            .setColor('DarkOrange')
            .setThumbnail(interaction.client.user.avatarURL())
            .setDescription(
                `▸ \`27-07-2026\` Busca un personaje: \`/character\`\n`+
                `▸ \`27-07-2026\` ¡Reclama personajes en tus servidores! \`/ch\`\n`+
                `▸ \`26-07-2026\` Este comando.\n`+
                `▸ \`25-07-2026\` Customización de perfil en \`/setup\`.\n`+
                `▸ \`25-07-2026\` Ahora se pueden vincular cuentas de \`VNDB\`.\n\n`+
                `[¡Invítame a tu servidor!](https://discord.com/oauth2/authorize?client_id=705972499367591953)`
            )
            .setFooter({ text: 'Dione v4.1' });
        
        return await interaction.reply({
            embeds: [embed]
        });
    }
};