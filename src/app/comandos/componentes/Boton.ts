import { ButtonBuilder, ButtonStyle, ComponentType } from "discord.js";

export default class Boton extends ButtonBuilder {
    public static readonly BotonSiguienteLabel: string = '→';
    public static readonly BotonPrevioLabel: string = '←';

    public static readonly BotonSiguienteID: string = 'botonSiguiente';
    public static readonly BotonPrevioID: string = 'botonPrevio';

    private constructor () {
        super({
            type: ComponentType.Button,
            style: ButtonStyle.Primary,
        });
    }

    public static CrearSiguiente () {
        return new Boton()
            .setLabel(Boton.BotonSiguienteLabel)
            .setCustomId(Boton.BotonSiguienteID);
    }

    public static CrearPrevio () {
        return new Boton()
            .setLabel(Boton.BotonPrevioLabel)
            .setCustomId(Boton.BotonPrevioID);
    }
}