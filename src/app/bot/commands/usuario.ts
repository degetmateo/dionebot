import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import CommandInterface from "../interfaces/CommandInterface";
import UsuarioCommandInteraction from "./interactions/usuario/UsuarioCommandInteraction";

export default class CommandUsuario implements CommandInterface {
    public readonly name: string = 'usuario';
    public readonly cooldown: number = 10;

    public readonly data = new SlashCommandBuilder()
        .setName('usuario')
        .setDescription("Muestra la información del perfil de Anilist de un usuario.")
        .setDMPermission(false)
        .addUserOption(option => 
            option
                .setName("usuario")
                .setDescription("El usuario del que se solicita la información."));
    
    public async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        const commandInteraction = new UsuarioCommandInteraction(interaction);
        await commandInteraction.execute();
    }
}