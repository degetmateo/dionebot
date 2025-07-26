import { EmbedBuilder } from "discord.js";

export default class LoadingEmbed extends EmbedBuilder {
    constructor () {
        super();
        this.setDescription('Espere...');
        this.setImage('https://media.discordapp.net/attachments/1398528876195348591/1398528920126619708/bar.gif?ex=6885b10d&is=68845f8d&hm=d0930e56b0ab10b8a140fb70c3df1b8d43ebd75b6455413fad741fb0ffd28acb&=&width=645&height=40');
        this.setColor("Green");
    };
};