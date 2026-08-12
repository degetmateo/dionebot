import SuccessEmbed from "../../../../embeds/successEmbed";
import GenericError from "../../../../errors/genericError";
import GuildChatInputCommandInteraction from "../../../../extensions/guildChatInputCommandInteraction.extension";
import membersRepository from "../../../../repositories/members/members.repository";

export const gachaBuyClaimsSubcommand = async (interaction: GuildChatInputCommandInteraction) => {
    const claims = interaction.options.getNumber('claims', true);
    const price = claims * 100;

    const user: any = await membersRepository.findsert(interaction.user.id, interaction.guild.id);

    if (user.renas < price) throw new GenericError(`No tienes suficientes \`renas\` para comprar \`${claims} claims\` (necesitas \`$${price})\`.`);
    
    await membersRepository.buyClaims(user._id, claims, price);
    
    await interaction.reply({
        flags: "Ephemeral",
        embeds: [new SuccessEmbed(`Has comprado \`${claims} claims\`.`)]
    });
};