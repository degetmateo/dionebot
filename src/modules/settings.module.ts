import fs from 'node:fs/promises';
import path from 'path';

export interface Settings {
    maintenance: boolean;
    renas_per_reclaim: number;
    devs: Array<string>;
    character_claim_cooldown: number;
};

const SETTINGS_PATH = path.join(process.cwd(), 'settings.json');

const DEFAULT_SETTINGS: Settings = {
    maintenance: false,
    renas_per_reclaim: 10,
    devs: ['523216917620850719'],
    character_claim_cooldown: 300
};

const read = async (): Promise<Settings> => {
    try {
        const fileContent = await fs.readFile(SETTINGS_PATH, 'utf-8');
        return JSON.parse(fileContent) as Settings;
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            console.log("Archivo de configuración no encontrado. Creando uno nuevo...");
            await save(DEFAULT_SETTINGS);
            return DEFAULT_SETTINGS;
        };
        
        console.error("Error al leer el archivo JSON:", error);
        return DEFAULT_SETTINGS;
    }
};

const save = async (settings: Settings): Promise<void> => {
    try {
        const jsonString = JSON.stringify(settings, null, 2);
        await fs.writeFile(SETTINGS_PATH, jsonString, 'utf-8');
    } catch (error) {
        console.error("Error al guardar la configuración:", error);
    };
};

const SettingsModule = {
    read,
    save
};

export default SettingsModule;