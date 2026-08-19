import path from 'path';
import fs from 'fs';
import Bot from "../bot/bot";

const load = (bot: Bot) => {
    const buttonsDir = path.join(__dirname, '../interactions/buttons');
    const buttonsFolders = fs.readdirSync(buttonsDir);

    
    for (const buttonFolder of buttonsFolders) {
        const buttonsPath = path.join(buttonsDir, buttonFolder);
        const buttonsFiles = fs.readdirSync(buttonsPath).filter(file => file.endsWith('.js') || file.endsWith('.ts'));
        
        for (const buttonFile of buttonsFiles) {
            const buttonDir = path.join(buttonsPath, buttonFile);
            const button = require(buttonDir);
    
            if ('id' in button && 'execute' in button) {
                bot.buttons.set(button.id, button);
            } else {
                console.log(`🟧 | The command at ${buttonDir} is missing a required "id" or "execute" property.`);
            };
        };
    };
};

const buttonsHandler = {
    load
};

export default buttonsHandler;