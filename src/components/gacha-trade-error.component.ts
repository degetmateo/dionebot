import { ContainerBuilder, SectionBuilder, TextDisplayBuilder, ThumbnailBuilder } from "discord.js";
import { RGB_COLORS } from "../static/rgb-colors";

export default class GachaTradeErrorComponent extends ContainerBuilder {
    constructor (cname: string, cimage: string) {
        super();
        this.setAccentColor(RGB_COLORS.RED)
        this.addSectionComponents(
            new SectionBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(`¡No has reclamado a \`${cname}\` en este servidor!`)
                )
                .setThumbnailAccessory(
                    new ThumbnailBuilder()
                        .setURL(cimage)
                )
        );
    };
};