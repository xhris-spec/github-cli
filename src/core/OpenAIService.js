import axios from "axios";
import { ConfigService } from "./ConfigService.js";
import { I18n } from "../i18n/index.js";

export class OpenAIService {
  static async generateCommitMessage(diffText) {
    const t = I18n.t.bind(I18n);

    const apiKey = ConfigService.getApiKey();

    if (!apiKey) {
      throw new Error(
        t("OpenAI.error")
      );
    }

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              t("OpenAI.system"),
          },
          {
            role: "user",
            content: t("OpenAI.user") + diffText,
          },
        ],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  }
}
