import axios from 'axios';
import { ConfigService } from './ConfigService.js';

export class OpenAIService {
    static async generateCommitMessage(diffText) {
        const apiKey = ConfigService.getApiKey();

        if (!apiKey) {
            throw new Error('No se ha configurado la clave de OpenAI. Usa "gh config set-key <API_KEY>"');
        }

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4',
                messages: [
                    { role: 'system', content: 'Eres un generador de mensajes de commit concisos y claros para proyectos de desarrollo.' },
                    { role: 'user', content: `Genera un mensaje de commit para este cambio:\n\n${diffText}` }
                ],
                temperature: 0.3,
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data.choices[0].message.content.trim();
    }
}
