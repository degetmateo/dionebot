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
                `\`06-08-2026\` Puedes usar \`/gacha inventory (user)\` para ver todos los personajes de un usuario.\n`+
                `\`03-08-2026\` Cuando se use \`/ch\` o \`/character\`, podrás indicar que deseas ese personaje.\n`+
                `▸ Al usar \`/ch\`, si un personaje es deseado por alguien se va mencionará a ese usuario.\n`+
                `▸ Si un personaje que ya está reclamado aparece en \`/ch\`, usando el botón \`recompensa\` se podrá reclamar una recompensa que se dividirá entre el dueño del personaje y la persona que presionó el botón.\n`+
                `▸ El tiempo para reclamar un personaje ha aumentado a \`1 minuto\`.\n`+
                `\`01-08-2026\` ¡Hemos reiniciado el gacha!\n`+
                `▸ Ahora puedes presionar el botón de los personajes ya reclamados para obtener \`renas\`.\n`+
                `\`29-07-2026\` Ahora puedes comprar \`pulls\` y \`claims\` en \`/gacha buy\`\n`+
                `▸ Ahora hay usos limitados del comando \`/ch\`. Estos usos se reestablecen cada hora o puedes comprarlos.\n`+
                `▸ Ahora hay \`claims\` limitados. Se reestablecen por hora o puedes comprarlos.\n`+
                `\`27-07-2026\` Busca un personaje: \`/character\`\n`+
                `\`27-07-2026\` ¡Reclama personajes en tus servidores! \`/ch\`\n`+
                `\`26-07-2026\` Este comando.\n`+
                `\`25-07-2026\` Customización de perfil en \`/setup\`.\n`+
                `\`25-07-2026\` Ahora se pueden vincular cuentas de \`VNDB\`.\n\n`+
                `[¡Invítame a tu servidor!](https://discord.com/oauth2/authorize?client_id=705972499367591953)`
            )
            .setFooter({ text: 'Dione v4.1.2' });
        
        return await interaction.reply({
            embeds: [embed]
        });
    }
};