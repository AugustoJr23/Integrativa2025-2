// Módulo de integração com IA/ChatGPT via n8n para o projeto "Ponto Focal"
// Responsável por enviar mensagens para análise e classificação automática

const axios = require('axios');

// =============================================================================
// CONFIGURAÇÕES E ENDPOINTS
// =============================================================================

// URL do webhook do n8n (será carregada do .env)
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'PLACEHOLDER_N8N_WEBHOOK_URL';

// Timeout para requisições (em milissegundos)
const REQUEST_TIMEOUT = parseInt(process.env.AI_REQUEST_TIMEOUT) || 30000;

// =============================================================================
// FUNÇÃO: ENVIAR MENSAGEM PARA IA VIA N8N
// =============================================================================
/**
 * Envia mensagem para o workflow do n8n que processa com IA/ChatGPT
 * 
 * @param {string} message - Mensagem do cliente a ser analisada
 * @param {Array} history - Histórico de conversas anteriores (opcional)
 * @param {Object} metadata - Metadados adicionais (canal, cliente, etc.)
 * @returns {Object} Resposta da IA com classificação e sugestões
 */
async function sendMessageToAI(message, history = [], metadata = {}) {
    try {
        console.log('=== ENVIANDO MENSAGEM PARA IA (via n8n) ===');
        console.log('Mensagem:', message);
        console.log('Histórico:', history.length, 'mensagens anteriores');
        console.log('Metadados:', metadata);
        console.log('===============================================');
        
        // Preparar payload para o n8n
        const payload = {
            message: message,
            history: history,
            metadata: {
                channel: metadata.channel || 'unknown',
                clientId: metadata.clientId || 'anonymous',
                clientName: metadata.clientName || 'Cliente',
                timestamp: new Date().toISOString(),
                ticketId: metadata.ticketId || `TICKET_${Date.now()}`,
                ...metadata
            },
            // Configurações de análise
            analysis: {
                classify: true,           // Classificar tipo de atendimento
                sentiment: true,          // Análise de sentimento
                priority: true,           // Definir prioridade
                suggestResponse: true,    // Sugerir resposta
                extractInfo: true         // Extrair informações relevantes
            }
        };
        
        // TODO: Quando o n8n estiver configurado, descomente a linha abaixo
        // const response = await axios.post(N8N_WEBHOOK_URL, payload, {
        //     timeout: REQUEST_TIMEOUT,
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'User-Agent': 'PontoFocal-Backend/1.0'
        //     }
        // });
        
        // MOCK: Simulação da resposta enquanto o n8n não está configurado
        console.log('⚠️  USANDO RESPOSTA MOCKADA - Configure o n8n para usar IA real');
        
        const mockResponse = {
            data: {
                success: true,
                ticketId: payload.metadata.ticketId,
                analysis: {
                    // Classificação automática baseada em palavras-chave
                    classification: classifyMessage(message),
                    
                    // Análise de sentimento simulada
                    sentiment: analyzeSentiment(message),
                    
                    // Prioridade baseada em urgência detectada
                    priority: determinePriority(message),
                    
                    // Sugestão de resposta mockada
                    suggestedResponse: generateMockResponse(message),
                    
                    // Informações extraídas
                    extractedInfo: extractKeyInfo(message),
                    
                    // Confiança da análise (mock)
                    confidence: Math.random() * 0.3 + 0.7, // Entre 70-100%
                    
                    // Timestamp da análise
                    processedAt: new Date().toISOString()
                },
                
                // Dados originais
                originalMessage: message,
                metadata: payload.metadata
            }
        };
        
        console.log('Resposta da IA:', JSON.stringify(mockResponse.data, null, 2));
        
        return {
            success: true,
            message: 'Análise de IA concluída',
            data: mockResponse.data,
            timestamp: new Date().toISOString()
        };
        
    } catch (error) {
        console.error('Erro ao enviar mensagem para IA:', error);
        
        return {
            success: false,
            message: 'Erro na análise de IA',
            error: error.message,
            timestamp: new Date().toISOString()
        };
    }
}

// =============================================================================
// FUNÇÕES AUXILIARES PARA SIMULAÇÃO (MOCK)
// =============================================================================

/**
 * Classifica a mensagem em categorias (versão mockada)
 */
function classifyMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    // Palavras-chave para classificação
    const keywords = {
        'suporte': ['problema', 'erro', 'bug', 'não funciona', 'ajuda', 'dúvida'],
        'vendas': ['comprar', 'preço', 'valor', 'orçamento', 'produto', 'serviço'],
        'reclamacao': ['reclamar', 'insatisfeito', 'ruim', 'péssimo', 'cancelar'],
        'elogio': ['parabéns', 'excelente', 'ótimo', 'bom', 'gostei'],
        'informacao': ['horário', 'endereço', 'localização', 'contato', 'como']
    };
    
    for (const [category, words] of Object.entries(keywords)) {
        if (words.some(word => lowerMessage.includes(word))) {
            return category;
        }
    }
    
    return 'geral';
}

/**
 * Analisa sentimento da mensagem (versão mockada)
 */
function analyzeSentiment(message) {
    const lowerMessage = message.toLowerCase();
    
    const positiveWords = ['bom', 'ótimo', 'excelente', 'gostei', 'obrigado', 'parabéns'];
    const negativeWords = ['ruim', 'péssimo', 'problema', 'erro', 'reclamar', 'cancelar'];
    
    const positiveCount = positiveWords.filter(word => lowerMessage.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerMessage.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
}

/**
 * Determina prioridade baseada na urgência (versão mockada)
 */
function determinePriority(message) {
    const lowerMessage = message.toLowerCase();
    
    const urgentWords = ['urgente', 'emergência', 'imediato', 'agora', 'rápido'];
    const highWords = ['importante', 'problema', 'erro', 'não funciona'];
    
    if (urgentWords.some(word => lowerMessage.includes(word))) return 'urgent';
    if (highWords.some(word => lowerMessage.includes(word))) return 'high';
    return 'medium';
}

/**
 * Gera resposta sugerida mockada
 */
function generateMockResponse(message) {
    const classification = classifyMessage(message);
    
    const responses = {
        'suporte': 'Olá! Entendi que você está com uma dificuldade. Vou encaminhar para nossa equipe de suporte técnico que irá te ajudar o mais rápido possível.',
        'vendas': 'Oi! Que bom saber do seu interesse! Vou conectar você com nossa equipe comercial para apresentar as melhores opções para você.',
        'reclamacao': 'Lamento muito pelo inconveniente. Sua satisfação é muito importante para nós. Vou encaminhar sua questão para resolvermos rapidamente.',
        'elogio': 'Muito obrigado pelo feedback positivo! Ficamos felizes em saber que você está satisfeito. Continuaremos trabalhando para manter essa qualidade.',
        'informacao': 'Olá! Vou te passar todas as informações que você precisa. Um momento, por favor.',
        'geral': 'Olá! Obrigado por entrar em contato. Como posso te ajudar hoje?'
    };
    
    return responses[classification] || responses['geral'];
}

/**
 * Extrai informações importantes da mensagem (versão mockada)
 */
function extractKeyInfo(message) {
    const info = {
        hasContact: /\b\d{4,}\b/.test(message), // Detectar números (telefone, etc.)
        hasEmail: /@/.test(message),            // Detectar email
        hasName: /[A-Z][a-z]+/.test(message),   // Detectar nomes próprios
        wordCount: message.split(' ').length,
        hasQuestion: message.includes('?'),
        hasExclamation: message.includes('!')
    };
    
    return info;
}

// =============================================================================
// FUNÇÃO: PROCESSAR RESPOSTA DO N8N
// =============================================================================
/**
 * Processa resposta recebida do n8n e formata para o sistema
 * 
 * @param {Object} n8nResponse - Resposta raw do n8n
 * @returns {Object} Dados formatados para o sistema
 */
function processN8NResponse(n8nResponse) {
    try {
        // TODO: Implementar processamento real quando n8n estiver ativo
        console.log('Processando resposta do n8n:', n8nResponse);
        
        return {
            success: true,
            processed: true,
            data: n8nResponse,
            timestamp: new Date().toISOString()
        };
        
    } catch (error) {
        console.error('Erro ao processar resposta do n8n:', error);
        
        return {
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        };
    }
}

// =============================================================================
// FUNÇÃO: TESTAR CONECTIVIDADE COM N8N
// =============================================================================
async function testN8NConnection() {
    try {
        console.log('Testando conexão com n8n...');
        
        // TODO: Implementar teste real quando n8n estiver configurado
        // const response = await axios.get(N8N_WEBHOOK_URL + '/health');
        
        console.log('⚠️  Teste mockado - Configure n8n para teste real');
        
        return {
            success: true,
            message: 'Conexão com n8n testada (mock)',
            endpoint: N8N_WEBHOOK_URL,
            timestamp: new Date().toISOString()
        };
        
    } catch (error) {
        console.error('Erro no teste de conexão n8n:', error);
        
        return {
            success: false,
            message: 'Erro na conexão com n8n',
            error: error.message,
            timestamp: new Date().toISOString()
        };
    }
}

// =============================================================================
// EXPORTAÇÕES
// =============================================================================
module.exports = {
    sendMessageToAI,
    processN8NResponse,
    testN8NConnection,
    // Exportar funções auxiliares para testes
    classifyMessage,
    analyzeSentiment,
    determinePriority
};

// =============================================================================
// EXEMPLO DE USO (COMENTADO)
// =============================================================================
/*
// Enviar mensagem para análise
const message = "Oi, estou com problema no meu pedido, podem me ajudar?";
const history = [
    { role: 'user', content: 'Olá!' },
    { role: 'assistant', content: 'Oi! Como posso ajudar?' }
];
const metadata = {
    channel: 'whatsapp',
    clientName: 'João Silva',
    clientId: 'client_123'
};

sendMessageToAI(message, history, metadata).then(result => {
    console.log('Resultado da análise:', result);
});

// Testar conexão
testN8NConnection().then(result => {
    console.log('Teste de conexão:', result);
});
*/