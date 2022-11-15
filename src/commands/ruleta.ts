import { ChannelType, ChatInputCommandInteraction, EmbedBuilder, InteractionResponse, SlashCommandBuilder } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ruleta")
        .setDescription("Tira una ruleta para saber si continuarás vivo..."),
    
    execute: async (interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply();
        
        const number = Math.floor(Math.random() * 6);

        const ImagenCargando = "https://media.discordapp.net/attachments/712773186336456766/1040413408199180328/ruletaCargando.gif";
        const ImagenDisparo = "https://media.discordapp.net/attachments/712773186336456766/1040418304797462568/ruletaDisparo.gif";
        const ImagenFallo = "https://media.discordapp.net/attachments/712773186336456766/1040418327052423288/ruletaFallogif.gif";

        const EmbedImagenCargando = new EmbedBuilder()
            .setImage(ImagenCargando)
            .setFooter({ text: "..." });

        const EmbedImagenDisparo = new EmbedBuilder()
            .setImage(ImagenDisparo)

        const EmbedImagenFallo = new EmbedBuilder()
            .setImage(ImagenFallo)
            .setFooter({ text: "Uf..." });

        await interaction.editReply({ embeds: [EmbedImagenCargando] });

        setTimeout(async () => {
            if (number === 1) {        
                const channel = await interaction.channel?.fetch();

                if (!channel) {
                    return interaction.editReply({
                        content: "Ha ocurrido un error.",
                    })
                }

                const invite = channel.type === ChannelType.GuildText ? await channel.createInvite() : null;
                
                await interaction.editReply({ embeds: [EmbedImagenDisparo] });

                invite ? await interaction.user.send(invite.url) : null;
                interaction.guild?.members.cache.find(m => m.user.id === interaction.user.id)?.kick();
            } else {
                interaction.editReply({ embeds: [EmbedImagenFallo] });
            }
        }, 1700);
    }
}