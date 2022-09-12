require("dotenv").config();

import express from "express";
const app = express();

app.set("port", process.env.PORT || 3000);

app.get("/", (req: any, res: any) => {
    res.send("que lees puta");
});

app.listen(app.get("port"), () => {
    console.log(`Servidor iniciado en el puerto: ${app.get("port")}`);
});

import { Client, GatewayIntentBits, Message } from "discord.js";
import { BOT } from "./Bot";

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const bot = new BOT(client);

bot.on("ready", () => {
    console.log("BOT preparado!");
});

bot.on("messageCreate", async (message: Message) => {
    if (message.content == "") return;

    const contenido = message.content.split(" ");
    const args = contenido.splice(1);

    if (message.content === "Hola") {
        message.reply(`${message.client.emojis.cache.find((e => e.name === "pala"))}`);
    };

    if (message.content.startsWith("!anime")) {
        const anime = await bot.anime(args[0]);

        const respuesta = `ID: ${anime.id}\n\n` +
        `Título: (Romaji: ${anime.title.romaji} | Inglés: ${anime.title.english} | Original: ${anime.title.native})\n\n` +
        `Descripción: ${anime.getDescripcion()}`;

        bot.enviar(message, respuesta);
    }

    if (message.content.startsWith("!manga")) {
        const manga = await bot.manga(args[0]);

        const respuesta = `ID: ${manga.id}\n\n` +
        `Título: (Romaji: ${manga.title.romaji} | Inglés: ${manga.title.english} | Original: ${manga.title.native})\n\n` +
        `Descripción: ${manga.getDescripcion()}`;

        bot.enviar(message, respuesta);
    }

    if (message.content.endsWith("13") || message.content.endsWith("trece")) {
        bot.responder(message, "¿Dijiste 13? Aquí tiene pa' que me la bese, entre más me la beses más me crece, busca un cura pa' que me la rese, y trae un martillo pa' que me la endereces, por el chiquito se te aparece toas las veces y cuando te estreses aquí te tengo éste pa' que te desestreses, con este tallo el jopo se te esflorece, se cumple el ciclo hasta que anochece, to' los días y toas las veces, de tanto entablar la raja del jopo se te desaparece, porque este sable no se compadece, si pides ñapa se te ofrece, y si repites se te agradece, no te hace rico pero tampoco te empobrece, no te hace inteligente pero tampoco te embrutece, y no paro aquí compa que éste nuevamente se endurece, hasta que amanece, cambie esa cara que parece que se entristece, si te haces viejo éste te rejuvenece, no te hago bulla porque depronto te ensordece, y ese cuadro no te favorece, pero tranquilo que éste te abastece, porque allá abajo se te humedece, viendo como el que me cuelga resplandece, si a ti te da miedo a mí me enorgullece, y así toas las vece ¿que te parece?, y tranquilo mijo que aquí éste reaparece, no haga fuerza porque éste se sobrecrece, una fresadora te traigo pa' que me la freses, así se fortalece y de nuevo la historia se establece, que no se te nuble la vista porque éste te la aclarece, y sino le entendiste nuevamente la explicación se te ofrece, pa' que por el chiquito éste de nuevo te empiece... Aquí tienes para que me la beses, entre más me la beses más me crece, busca un cura para que me la rece, un martillo para que me la endereces, un chef para que me la aderece, 8000 mondas por el culo se te aparecen, si me la sobas haces que se me espese, si quieres la escaneas y te la llevas para que en tu hoja de vida la anexes, me culeo a tu maldita madre y qué te parece le meti la monda a tú mamá hace 9 meses y después la puse a escuchar René de Calle 13 Te la meto por debajo del agua como los peces, y aquella flor de monda que en tu culo crece, reposa sobre tus nalgas a veces y una vez más...");
    };

    if (message.content.endsWith("12") || message.content.endsWith("doce")) {
        bot.responder(message, "las de doce son goood");
    };

    if (message.content.endsWith("5") || message.content.endsWith("cinco")) {
        bot.responder(message, "por el culo te la hinco");
    }

    if (message.content.endsWith("contexto")) {
        bot.responder(message, "Espera dijiste contexto? Te la tragas sin pretexto, así no estés dispuesto, pero tal vez alguna vez te lo has propuesto, y te seré honesto te haré el favor y te lo presto, tan fuerte que tal vez me den arresto, ya no aguantas ni el sexto, así que lo dejamos pospuesto, pero te falta afecto y te lo dejo otra vez puesto, te aplastó en la pared como insecto tan duro que sale polvo de asbesto, llamo al arquitecto Alberto y al modesto Ernesto, y terminas más abierto que portón de asentamiento, ya no tenes más almacenamiento así que necesitas asesoramiento y a tu madre llamamos para darle su afecto así hasta el agotamiento y al siguiente día repetimos y así terminó y te la meto sin pretexto, así no estés dispuesto, pero tal vez alguna vez te lo has propuesto, y te seré honesto te haré el favor y te lo presto, tan fuerte que tal vez me den arresto, ya no aguantas ni el sexto, así que lo dejamos pospuesto, pero te falta afecto y te lo dejo otra vez puesto, te aplastó en la pared como insecto tan duro que sale polvo de asbesto, llamo al arquitecto Alberto y al modesto Ernesto, y terminas más abierto que portón de asentamiento, ya no tenes más almacenamiento así que necesitas asesoramiento y a tu madre llamamos para darle su afecto así hasta el agotamiento y al siguiente día repetimos pero ya estás descompuesto así que para mí continuar sería incorrecto y me voy sin mostrar algún gesto, dispuesto a seguir apenas y ya estés compuesto voy y te doy el impuesto pero no sin antes avisarte que este es el contexto 👍.");
    }
});

client.login(process.env.TOKEN);