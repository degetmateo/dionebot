import { InteractionContextType, SlashCommandBuilder} from "discord.js";
import userExecute from "./execute/user/user.execute";

module.exports = {
    cooldown: 25,
    data: new SlashCommandBuilder()
        .setName('user')
        .setContexts(InteractionContextType.Guild)
        .setNSFW(false)
        .setDescription('All the information related to an user.')
        .setDescriptionLocalization('es-ES', 'Toda la información relacionada a un usuario.')
        .setDescriptionLocalization('es-419', 'Toda la información relacionada a un usuario.')
        .addUserOption(option => 
            option
                .setName('member')
                .setDescription('The user to get information for.')
                .setDescriptionLocalization('es-ES', 'El usuario del que obtener información.')
                .setDescriptionLocalization('es-419', 'El usuario del que obtener información.')
                .setRequired(false)),
    execute: userExecute
};