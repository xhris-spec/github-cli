import fs from 'fs';
import path from 'path';
import os from 'os';

export class ConfigService {
    static configPath = path.join(os.homedir(), '.ghcli-config.json');

    static saveApiKey(apiKey) {
        const config = { openai_api_key: apiKey };
        fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2));
    }

    static getApiKey() {
        if (!fs.existsSync(this.configPath)) return null;
        const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
        return config.openai_api_key || null;
    }

    static hasApiKey() {
        return !!this.getApiKey();
    }
}
