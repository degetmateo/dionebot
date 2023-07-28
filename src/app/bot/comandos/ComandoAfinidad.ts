import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import InterfazComando from "../interfaces/InterfazComando";
import Bot from "../Bot";
import ErrorDemasiadasPeticiones from "../../errores/ErrorDemasiadasPeticiones";
import InteraccionComandoAfinidad from "./modulos/InteraccionComandoAfinidad";

export default class ComandoAfinidad implements InterfazComando {
    public readonly cooldown: number = 10;

    public readonly datos = new SlashCommandBuilder()
        .setName("afinidad")
        .setDescription("Calcula la afinidad entre vos (u otro usuario) y los demás miembros registrados del servidor.")
        .addUserOption(option => 
            option
                .setName("usuario")
                .setDescription("Usuario del que quieres calcular la afinidad."));

    public async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        await InteraccionComandoAfinidad.execute(interaction);
    }
}