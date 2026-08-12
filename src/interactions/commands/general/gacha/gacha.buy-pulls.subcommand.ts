import SuccessEmbed from "../../../../embeds/successEmbed";
import GenericError from "../../../../errors/genericError";
import GuildChatInputCommandInteraction from "../../../../extensions/guildChatInputCommandInteraction.extension";
import membersRepository from "../../../../repositories/members/members.repository";

export const gachaBuyPullsSubcommand = async (interaction: GuildChatInputCommandInteraction) => {
    const pulls = interaction.options.getNumber('pulls', true);
    const price = pulls * 10;

    const user: any = await membersRepository.findsert(interaction.user.id, interaction.guild.id);

    if (user.renas < price) throw new GenericError(`No tienes suficientes \`renas\` para comprar \`${pulls} pulls\` (necesitas \`$${price}\`).`);
    
    await membersRepository.buyPulls(user._id, pulls, price);
    
    await interaction.reply({
        flags: "Ephemeral",
        embeds: [new SuccessEmbed(`Has comprado \`${pulls} pulls\`.`)]
    });
};