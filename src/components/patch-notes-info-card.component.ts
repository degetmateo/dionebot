import { ButtonStyle, ContainerBuilder, SectionBuilder, SeparatorBuilder, SeparatorSpacingSize, TextDisplayBuilder } from "discord.js";
import { RGB_COLORS } from "../static/rgb-colors";

export default class PathNotesInfoCardComponent extends ContainerBuilder {
    constructor (avatarURL: string) {
        super();
        
        this.setAccentColor(RGB_COLORS.ORANGE);

        this.addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent(`### Últimos cambios...`)
        );

        this.addSeparatorComponents(
            new SeparatorBuilder()
                .setDivider(true)
                .setSpacing(SeparatorSpacingSize.Small)
        );

        this.addSectionComponents(
            new SectionBuilder()
                .setThumbnailAccessory(builder =>
                    builder
                        .setURL(avatarURL)
                )
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(
                            `\`08-08-2026\` Puedes usar \`/gacha trade\` para intercambiar personajes con un usuario.\n`+
                            `\`06-08-2026\` Puedes usar \`/gacha inventory (user)\` para ver todos los personajes de un usuario.\n`+
                            `\`03-08-2026\` Cuando se use \`/ch\` o \`/character\`, podrás indicar que deseas ese personaje.\n`+
                            `▸ Al usar \`/ch\`, si un personaje es deseado por alguien se va mencionará a ese usuario.\n`+
                            `▸ Si un personaje que ya está reclamado aparece en \`/ch\`, usando el botón \`recompensa\` se podrá reclamar una recompensa que se dividirá entre el dueño del personaje y la persona que presionó el botón.\n`+
                            `▸ El tiempo para reclamar un personaje ha aumentado a \`1 minuto\`.\n`+
                            `\`01-08-2026\` ¡Hemos reiniciado el gacha!\n`+
                            `▸ Ahora puedes presionar el botón de los personajes ya reclamados para obtener \`renas\`.\n`+
                            `\`29-07-2026\` Ahora puedes comprar \`pulls\` y \`claims\` en \`/gacha buy\`\n`+
                            `▸ Ahora hay usos limitados del comando \`/ch\`. Estos usos se reestablecen cada hora o puedes comprarlos.\n`+
                            `▸ Ahora hay \`claims\` limitados. Se reestablecen por hora o puedes comprarlos.\n`+
                            `\`27-07-2026\` Busca un personaje: \`/character\`\n`+
                            `\`27-07-2026\` ¡Reclama personajes en tus servidores! \`/ch\`\n`+
                            `\`26-07-2026\` Este comando.\n`+
                            `\`25-07-2026\` Customización de perfil en \`/setup\`.\n`+
                            `\`25-07-2026\` Ahora se pueden vincular cuentas de \`VNDB\`.`
                        )
                )
        );

        this.addSeparatorComponents(
            new SeparatorBuilder()
                .setDivider(true)
                .setSpacing(SeparatorSpacingSize.Small)
        );


        this.addSectionComponents(
            new SectionBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(
                            `Dione v4.1.3`
                        )
                )
                .setButtonAccessory((button) =>
                    button
                        .setLabel('¡Invítame a tu servidor!')
                        .setStyle(ButtonStyle.Link)
                        .setURL('https://discord.com/oauth2/authorize?client_id=705972499367591953')
                )
        )   
    };
};