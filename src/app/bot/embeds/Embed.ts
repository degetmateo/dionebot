import { ColorResolvable, EmbedBuilder, EmbedField, EmbedFooterData } from "discord.js";

export default class Embed {
    public static readonly COLOR_ROJO: ColorResolvable = ('#FF0000') as ColorResolvable;
    public static readonly COLOR_VERDE: ColorResolvable = ('#00FF44') as ColorResolvable;

    private embed: EmbedBuilder;

    private constructor () {
        this.embed = new EmbedBuilder();
    }

    public static Crear (): Embed {
        return new Embed();
    }

    public establecerDescripcion (texto: string): Embed {
        this.embed.setDescription(texto);
        return this;
    }

    public establecerColor (color: ColorResolvable): Embed {
        this.embed.setColor(color);
        return this;
    }

    public establecerTitulo (titulo: string): Embed {
        this.embed.setTitle(titulo);
        return this;
    }

    public establecerURL (url: string): Embed {
        this.embed.setURL(url);
        return this;
    }

    public establecerBanner (url: string): Embed {
        this.embed.setImage(url);
        return this;
    }

    public establecerPortada (url: string): Embed {
        this.embed.setThumbnail(url);
        return this;
    }

    public establecerFooter (footer: EmbedFooterData) {
        this.embed.setFooter(footer);
        return this;
    }

    public establecerCampo (campo: EmbedField) {
        this.embed.addFields(campo);
        return this;
    }

    public obtenerDatos (): any {
        return this.embed.toJSON();
    }
}