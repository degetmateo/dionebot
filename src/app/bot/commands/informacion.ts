import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, CacheType } from "discord.js";
import CommandInterface from "../interfaces/CommandInterface";
import Bot from "../Bot";

export default class CommandInformacion implements CommandInterface {
    public readonly name: string = 'informacion';
    public readonly cooldown: number = 5;

    public readonly data: SlashCommandBuilder = new SlashCommandBuilder()
        .setName('informacion')
        .setDescription("Obtén información acerca de mi!");

    private readonly DESCRIPCION: string = `
Mi nombre es Dione y soy un bot de Discord que está siendo desarrollado en TypeScript.\n
Mis funciones principales incluyen buscar y mostrar información acerca de animes, mangas y novelas visuales en tu servidor.\n
Aunque aún no poseo demasiadas opciones, en el futuro se irán implementando muchas más.\n
Si lo deseas, puedes invitarme a tu servidor presionando el enlace que se encuentra debajo.\n
https://dionebot.onrender.com/
    `;

    public async execute (interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {        
        await interaction.deferReply();

        const bot: Bot = interaction.client as Bot;
                
        const embed = new EmbedBuilder()
            .setTitle("Información")
            .setDescription(this.DESCRIPCION)
            .setColor(0xff8c00)
            .setFooter({ text: `Dione v${bot.getVersion()}` });

        bot.user?.avatarURL() ? embed.setThumbnail(bot.user.avatarURL()) : null;

        await interaction.editReply({
            embeds: [embed]
        })
    }
}