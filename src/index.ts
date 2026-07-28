/// <reference path="../env.d.ts" />

import Bot from './extensions/bot.extension';
import mongo from "./database/mongo";
import SettingsModule from './modules/settings.module';

const init = async () => {
    await mongo.init();
    const settings = await SettingsModule.read();
    new Bot(settings).login(process.env.TOKEN);
};

init();