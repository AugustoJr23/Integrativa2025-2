// Arquivo de configuração centralizada do projeto "Ponto Focal"
// Carrega e organiza todas as variáveis de ambiente do arquivo .env

// Carregar variáveis de ambiente do arquivo .env
require('dotenv').config();

// =============================================================================
// CONFIGURAÇÕES DO SERVIDOR
// =============================================================================

// Porta onde o servidor Express irá rodar
// Padrão: 3000 para desenvolvimento local
const PORT = process.env.PORT || 3000;

// Porta específica para Socket.IO (se diferente do servidor principal)
// Usado para separar tráfego HTTP do WebSocket em alguns cenários
const SOCKET_PORT = process.env.SOCKET_PORT || PORT;

// =============================================================================
// CONFIGURAÇÕES DO GOOGLE SHEETS
// =============================================================================

// ID da planilha do Google Sheets que serve como banco de dados
// Extraído da URL: https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/
const GOOGLE_SHEETS_ID = process.env.GOOGLE_SHEETS_ID || '';

// Nome da aba na planilha onde os tickets são armazenados
const GOOGLE_SHEET_NAME = process.env.GOOGLE_SHEET_NAME || 'Tickets';

// Email da conta de serviço (Service Account) do Google Cloud
// Necessário para autenticação com a API do Google Sheets
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '';

// Chave privada da conta de serviço (formato PEM)
// Geralmente vem do arquivo JSON baixado do Google Cloud Console
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY || '';

// =============================================================================
// CONFIGURAÇÕES DE INTEGRAÇÃO COM IA (N8N)
// =============================================================================

// URL do webhook do n8n que processa mensagens com ChatGPT/IA
// Usado para enviar mensagens para classificação automática
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || '';

// Timeout para requisições para o n8n (em milissegundos)
// Evita travamentos se o n8n demorar para responder
const AI_REQUEST_TIMEOUT = parseInt(process.env.AI_REQUEST_TIMEOUT) || 30000;

// =============================================================================
// CONFIGURAÇÕES DE CANAIS DE COMUNICAÇÃO
// =============================================================================

// Configurações do WhatsApp Business API (se usado diretamente)
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN || '';
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID || '';

// Evolution API (WhatsApp)
const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || '';
const EVOLUTION_TOKEN = process.env.EVOLUTION_TOKEN || '';

// Configurações do Instagram Basic Display API
const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN || '';

// Configurações de email (SMTP para envio de respostas)
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT) || 587;
const EMAIL_USER = process.env.EMAIL_USER || '';
const EMAIL_PASS = process.env.EMAIL_PASS || '';

// =============================================================================
// CONFIGURAÇÕES DE SEGURANÇA
// =============================================================================

// Chave secreta para JWT (se implementado futuramente)
const JWT_SECRET = process.env.JWT_SECRET || 'ponto-focal-secret-key';

// Configuração de CORS - domínios permitidos
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

// =============================================================================
// CONFIGURAÇÕES DE AMBIENTE
// =============================================================================

// Ambiente de execução (development, production, test)
const NODE_ENV = process.env.NODE_ENV || 'development';

// Nível de log (error, warn, info, debug)
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

// =============================================================================
// VALIDAÇÃO DE CONFIGURAÇÕES OBRIGATÓRIAS
// =============================================================================

// Função para validar se configurações críticas estão presentes
function validateConfig() {
    const requiredConfigs = [];
    
    // Verificar configurações obrigatórias em produção
    if (NODE_ENV === 'production') {
        if (!GOOGLE_SHEETS_ID) requiredConfigs.push('GOOGLE_SHEETS_ID');
        if (!GOOGLE_SERVICE_ACCOUNT_EMAIL) requiredConfigs.push('GOOGLE_SERVICE_ACCOUNT_EMAIL');
        if (!GOOGLE_PRIVATE_KEY) requiredConfigs.push('GOOGLE_PRIVATE_KEY');
        if (!N8N_WEBHOOK_URL) requiredConfigs.push('N8N_WEBHOOK_URL');
    }
    
    if (requiredConfigs.length > 0) {
        console.error('⚠️  Configurações obrigatórias não encontradas:');
        requiredConfigs.forEach(config => {
            console.error(`   - ${config}`);
        });
        console.error('   Verifique o arquivo .env');
        
        // Em produção, parar a aplicação se configurações críticas estiverem faltando
        if (NODE_ENV === 'production') {
            process.exit(1);
        }
    }
}

// =============================================================================
// FUNÇÃO PARA EXIBIR CONFIGURAÇÕES (sem dados sensíveis)
// =============================================================================

function displayConfig() {
    console.log('===========================================');
    console.log('🔧 CONFIGURAÇÕES DO PONTO FOCAL');
    console.log('===========================================');
    console.log(`🌍 Ambiente: ${NODE_ENV}`);
    console.log(`🚀 Servidor: localhost:${PORT}`);
    console.log(`📊 Google Sheets: ${GOOGLE_SHEETS_ID ? '✅ Configurado' : '❌ Não configurado'}`);
    console.log(`🤖 n8n Webhook: ${N8N_WEBHOOK_URL ? '✅ Configurado' : '❌ Não configurado'}`);
    console.log(`📱 WhatsApp: ${WHATSAPP_TOKEN ? '✅ Configurado' : '❌ Não configurado'}`);
    console.log(`📧 Email: ${EMAIL_USER ? '✅ Configurado' : '❌ Não configurado'}`);
    console.log(`📸 Instagram: ${INSTAGRAM_ACCESS_TOKEN ? '✅ Configurado' : '❌ Não configurado'}`);
    console.log('===========================================');
}

// =============================================================================
// EXPORTAÇÕES
// =============================================================================

module.exports = {
    // Servidor
    PORT,
    SOCKET_PORT,
    
    // Google Sheets
    GOOGLE_SHEETS_ID,
    GOOGLE_SHEET_NAME,
    GOOGLE_SERVICE_ACCOUNT_EMAIL,
    GOOGLE_PRIVATE_KEY,
    
    // IA/n8n
    N8N_WEBHOOK_URL,
    AI_REQUEST_TIMEOUT,
    
    // Canais de comunicação
    WHATSAPP_TOKEN,
    WHATSAPP_PHONE_ID,
    INSTAGRAM_ACCESS_TOKEN,
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USER,
    EMAIL_PASS,
    EVOLUTION_API_URL,
    EVOLUTION_TOKEN,
    
    // Segurança
    JWT_SECRET,
    CORS_ORIGIN,
    
    // Ambiente
    NODE_ENV,
    LOG_LEVEL,
    
    // Funções utilitárias
    validateConfig,
    displayConfig
};

// =============================================================================
// EXEMPLO DE ARQUIVO .env
// =============================================================================
/*
# Arquivo .env de exemplo para o projeto Ponto Focal
# Copie este conteúdo para um arquivo .env na raiz do projeto

# Servidor
PORT=3000
SOCKET_PORT=3000

# Google Sheets
GOOGLE_SHEETS_ID=1abc123def456ghi789jkl
GOOGLE_SHEET_NAME=Tickets
GOOGLE_SERVICE_ACCOUNT_EMAIL=ponto-focal@projeto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"

# n8n/IA
N8N_WEBHOOK_URL=https://seu-n8n.com/webhook/ponto-focal
AI_REQUEST_TIMEOUT=30000

# WhatsApp Business API
WHATSAPP_TOKEN=seu_token_whatsapp
WHATSAPP_PHONE_ID=seu_phone_id

# Instagram
INSTAGRAM_ACCESS_TOKEN=seu_token_instagram

# Email SMTP
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-app

# Segurança
JWT_SECRET=seu-jwt-secret-super-seguro
CORS_ORIGIN=https://seu-dominio.com

# Ambiente
NODE_ENV=development
LOG_LEVEL=info
*/