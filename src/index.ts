/// <reference path="../env.d.ts" />

import Bot from './extensions/bot.extension';
import mongo from "./database/mongo";
import GachaSchedulerModule from './modules/gacha.scheduler.module';
import { TOKEN } from './consts';

const init = async () => {
    await mongo.init();
    GachaSchedulerModule.SCHEDULE_PULLS_RESET();
    const bot = new Bot();
    await bot.login(TOKEN);
};

init();