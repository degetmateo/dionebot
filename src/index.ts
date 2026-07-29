/// <reference path="../env.d.ts" />

import Bot from './extensions/bot.extension';
import mongo from "./database/mongo";
import SettingsModule from './modules/settings.module';
import GachaSchedulerModule from './modules/gacha.scheduler.module';

const init = async () => {
    await mongo.init();
    GachaSchedulerModule.SCHEDULE_PULLS_RESET();
    const settings = await SettingsModule.read();
    new Bot(settings).login(process.env.TOKEN);
};

init();