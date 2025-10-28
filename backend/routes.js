// Arquivo de rotas do projeto "Ponto Focal"
// Define os endpoints da API para integração com canais externos e n8n

const express = require('express');
const router = express.Router();

// =============================================================================
// ROTA: POST /webhook
// Propósito: Receber mensagens de clientes vindas de canais integrados
// Canais suportados: WhatsApp, Instagram, E-mail, Chat Web
// =============================================================================
router.post('/webhook', (req, res) => {
    console.log('=== WEBHOOK - Nova mensagem recebida ===');
    console.log('Headers:', req.headers);
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('Timestamp:', new Date().toISOString());
    console.log('==========================================');
    
    // Estrutura mockada da resposta
    // TODO: Implementar lógica de processamento das mensagens
    // TODO: Integrar com n8n para classificação automática
    // TODO: Armazenar no Google Sheets
    
    const mockResponse = {
        success: true,
        message: 'Mensagem recebida com sucesso',
        ticketId: `TICKET_${Date.now()}`,
        channel: req.body.channel || 'unknown',
        timestamp: new Date().toISOString(),
        status: 'received'
    };
    
    // Emitir evento via Socket.IO para atualização em tempo real
    if (req.io) {
        req.io.to('atendentes').emit('nova-mensagem', {
            ...mockResponse,
            content: req.body
        });
    }
    
    res.status(200).json(mockResponse);
});

// =============================================================================
// ROTA: POST /notify
// Propósito: Receber resposta do n8n com classificação e conteúdo da IA
// Contém: Classificação automática, sugestões de resposta, prioridade, etc.
// =============================================================================
router.post('/notify', (req, res) => {
    console.log('=== N8N NOTIFICATION - Resposta da IA ===');
    console.log('Dados recebidos:', JSON.stringify(req.body, null, 2));
    console.log('Timestamp:', new Date().toISOString());
    console.log('=========================================');
    
    // Estrutura mockada da resposta
    // TODO: Processar classificação da IA
    // TODO: Atualizar ticket no Google Sheets
    // TODO: Notificar atendentes sobre classificação
    
    const mockResponse = {
        success: true,
        message: 'Notificação do n8n processada',
        ticketId: req.body.ticketId || `TICKET_${Date.now()}`,
        classification: req.body.classification || 'pending',
        priority: req.body.priority || 'medium',
        aiSuggestion: req.body.aiSuggestion || 'Análise em andamento...',
        timestamp: new Date().toISOString(),
        processed: true
    };
    
    // Emitir evento via Socket.IO para notificar atendentes
    if (req.io) {
        req.io.to('atendentes').emit('classificacao-ia', {
            ...mockResponse,
            content: req.body
        });
    }
    
    res.status(200).json(mockResponse);
});

// =============================================================================
// ROTA: GET /tickets
// Propósito: Retornar o histórico de tickets armazenados no Google Sheets
// Parâmetros opcionais: ?status=, ?channel=, ?date=, ?limit=
// =============================================================================
router.get('/tickets', (req, res) => {
    console.log('=== TICKETS - Consulta ao histórico ===');
    console.log('Query params:', req.query);
    console.log('Timestamp:', new Date().toISOString());
    console.log('=======================================');
    
    // Parâmetros de filtro da query
    const { status, channel, date, limit } = req.query;
    
    // Dados mockados do histórico de tickets
    // TODO: Implementar consulta real ao Google Sheets
    // TODO: Aplicar filtros baseados nos parâmetros da query
    // TODO: Implementar paginação
    
    const mockTickets = [
        {
            id: 'TICKET_001',
            channel: 'whatsapp',
            clientName: 'João Silva',
            clientPhone: '+5511999999999',
            message: 'Preciso de ajuda com meu pedido',
            status: 'open',
            priority: 'high',
            classification: 'suporte',
            aiSuggestion: 'Cliente relatando problema com pedido. Verificar status no sistema.',
            createdAt: '2025-10-22T10:30:00.000Z',
            updatedAt: '2025-10-22T10:35:00.000Z',
            assignedTo: 'Atendente 1'
        },
        {
            id: 'TICKET_002',
            channel: 'instagram',
            clientName: 'Maria Santos',
            clientPhone: '@maria.santos',
            message: 'Gostaria de saber mais sobre os produtos',
            status: 'closed',
            priority: 'medium',
            classification: 'vendas',
            aiSuggestion: 'Cliente interessado em produtos. Enviar catálogo.',
            createdAt: '2025-10-22T09:15:00.000Z',
            updatedAt: '2025-10-22T09:45:00.000Z',
            assignedTo: 'Atendente 2'
        },
        {
            id: 'TICKET_003',
            channel: 'email',
            clientName: 'Pedro Costa',
            clientPhone: 'pedro@email.com',
            message: 'Solicitação de orçamento para evento corporativo',
            status: 'in_progress',
            priority: 'high',
            classification: 'vendas',
            aiSuggestion: 'Orçamento corporativo. Encaminhar para equipe comercial.',
            createdAt: '2025-10-22T08:00:00.000Z',
            updatedAt: '2025-10-22T10:20:00.000Z',
            assignedTo: 'Atendente 3'
        }
    ];
    
    // Aplicar filtros mockados (em produção, será feito na consulta ao Google Sheets)
    let filteredTickets = mockTickets;
    
    if (status) {
        filteredTickets = filteredTickets.filter(ticket => ticket.status === status);
    }
    
    if (channel) {
        filteredTickets = filteredTickets.filter(ticket => ticket.channel === channel);
    }
    
    if (limit) {
        filteredTickets = filteredTickets.slice(0, parseInt(limit));
    }
    
    const response = {
        success: true,
        message: 'Histórico de tickets recuperado',
        total: filteredTickets.length,
        filters: { status, channel, date, limit },
        data: filteredTickets,
        timestamp: new Date().toISOString()
    };
    
    console.log(`Retornando ${filteredTickets.length} tickets`);
    
    res.status(200).json(response);
});

// =============================================================================
// ROTA: GET /health
// Propósito: Verificar se a API está funcionando (health check)
// =============================================================================
router.get('/health', (req, res) => {
    console.log('=== HEALTH CHECK ===');
    console.log('API funcionando normalmente');
    console.log('Timestamp:', new Date().toISOString());
    console.log('====================');
    
    res.status(200).json({
        success: true,
        message: 'API Ponto Focal funcionando',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// =============================================================================
// MIDDLEWARE DE TRATAMENTO DE ERROS
// =============================================================================
router.use((err, req, res, next) => {
    console.error('Erro na API:', err);
    
    res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Erro interno',
        timestamp: new Date().toISOString()
    });
});

// Exportar o router para uso no server.js
module.exports = router;


// ROTA: POST /send-whatsapp
// Propósito: Enviar mensagem para cliente via Evolution WhatsApp
router.post('/send-whatsapp', async (req, res) => {
    const { to, message } = req.body;
    if (!to || !message) {
        return res.status(400).json({ success: false, message: 'Parâmetros obrigatórios: to, message' });
    }
    try {
        const result = await require('./evolution').sendWhatsAppMessage({ to, message });
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
