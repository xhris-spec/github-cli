import fs from "fs";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";

const SUPPORTED_LANGUAGES = ["es", "en"];
const DEFAULT_LANG = "en";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class I18n {
    static _messages = null;

    static getUserLang() {
        const configPath = path.join(os.homedir(), ".ghcli-config.json");

        if (fs.existsSync(configPath)) {
            const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
            if (config.lang && SUPPORTED_LANGUAGES.includes(config.lang)) {
                return config.lang;
            }
        }

        const systemLang = process.env.LANG || process.env.LANGUAGE || "";
        const matchedLang = SUPPORTED_LANGUAGES.find((lang) =>
            systemLang.startsWith(lang)
        );

        return matchedLang || DEFAULT_LANG;
    }

    static loadMessages() {
        if (this._messages) return this._messages;

        const lang = this.getUserLang();
        const filePath = path.resolve(__dirname, `../i18n/${lang}.json`);
        this._messages = JSON.parse(fs.readFileSync(filePath, "utf8"));
        return this._messages;
    }

    static t(key) {
        const messages = this.loadMessages();
        const keys = key.split(".");
        return keys.reduce((acc, k) => acc?.[k], messages) || key;
    }
}
