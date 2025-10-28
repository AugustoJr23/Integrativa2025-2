// Módulo de integração Evolution API para WhatsApp
// Responsável por enviar e receber mensagens via Evolution

const axios = require('axios');

// Endpoint Evolution API (definido no .env)
const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || 'https://api.evolution.com.br/v1/messages';
const EVOLUTION_TOKEN = process.env.EVOLUTION_TOKEN || '';

// Enviar mensagem para Evolution WhatsApp
async function sendWhatsAppMessage({ to, message }) {
    try {
        const response = await axios.post(EVOLUTION_API_URL, {
            to,
            message
        }, {
            headers: {
                'Authorization': `Bearer ${EVOLUTION_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao enviar mensagem Evolution:', error);
        return { success: false, error: error.message };
    }
}

// Receber mensagens (webhook)
// Função para processar payload recebido do Evolution
function processIncomingMessage(payload) {
    // Adapte conforme o formato do Evolution
    return {
        from: payload.from,
        message: payload.body,
        timestamp: payload.timestamp,
        channel: 'whatsapp',
        evolutionId: payload.id
    };
}

module.exports = {
    sendWhatsAppMessage,
    processIncomingMessage
};
