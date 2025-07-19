import { EmbedBuilder } from "discord.js";

export default class SetupInstructionsEmbed extends EmbedBuilder {
     constructor () {
        super();

        this
            .setTitle('Instrucciones')
            .setColor(0xff8c00)
            .setFooter({ text: "No compartas los códigos con nadie." })
            .setDescription((`
                ▸ Haz click en el botón **Autorizar**.
                ▸ Una vez dentro de la página web, debes presionar en **Authorize**.
                ▸ Se generará tu código de autentificación, debes copiarlo.
                ▸ Cierra la página web y vuelve aquí, haz click en el botón **Ingresar código**.
                ▸ Pega el código en el formulario y envíalo.
            `).trim());
     };
};