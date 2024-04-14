import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import CommandInterface from "../interfaces/CommandInterface";
import AfinidadCommandInteraction from "./interactions/afinidad/AfinidadCommandInteraction";

export default class CommandAfinidad implements CommandInterface {
    public readonly name: string = 'afinidad';
    public readonly cooldown: number = 20;

    public readonly data = new SlashCommandBuilder()
        .setName('afinidad')
        .setDescription("Calcula la afinidad entre ti (u otro usuario) y los demás miembros registrados del servidor.")
        .setDMPermission(false)
        .addUserOption(option => 
            option
                .setName("usuario")
                .setDescription("Usuario del que quieres calcular la afinidad."));

    public async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        const commandInteraction = new AfinidadCommandInteraction(interaction);
        await commandInteraction.execute();
    }
}

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('afinidad')
//         .setDescription("Calcula la afinidad entre vos (u otro usuario) y los demás miembros registrados del servidor.")
//         .addUserOption(option => 
//             option
//                 .setName("usuario")
//                 .setDescription("Usuario del que quieres calcular la afinidad.")),
//     execute: async (interaction: ChatInputCommandInteraction<CacheType>): Promise<void> => {
//         const commandInteraction = new AfinidadCommandInteraction(interaction);
//         await commandInteraction.execute();
//     }
// }