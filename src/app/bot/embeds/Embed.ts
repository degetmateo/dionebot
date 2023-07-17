import { ColorResolvable, EmbedBuilder } from "discord.js";

export default class Embed extends EmbedBuilder {
    public static readonly COLOR_ROJO: ColorResolvable = ('#FF0000') as ColorResolvable;
    public static readonly COLOR_VERDE: ColorResolvable = ('#00FF44') as ColorResolvable;

    private constructor () {
        super();
    }

    public static Crear (texto: string): Embed {
        return new Embed().setDescription(texto);
    }

    public static CrearVerde (texto: string): Embed {
        return this.Crear(texto).setColor(this.COLOR_VERDE);
    }

    public static CrearRojo (texto: string): Embed {
        return this.Crear(texto).setColor(this.COLOR_ROJO);
    }
}