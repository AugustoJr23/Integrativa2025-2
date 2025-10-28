// Módulo de integração com Google Sheets para o projeto "Ponto Focal"
// Responsável por gerenciar tickets e dados na planilha do Google

const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

// =============================================================================
// CONFIGURAÇÕES E CREDENCIAIS
// =============================================================================

// IDs e configurações da planilha (serão carregados do .env)
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID || 'PLACEHOLDER_SPREADSHEET_ID';
const SHEET_NAME = process.env.GOOGLE_SHEET_NAME || 'Tickets';

// Credenciais do Service Account (carregadas do .env)
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || 'PLACEHOLDER_EMAIL';
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY || 'PLACEHOLDER_PRIVATE_KEY';

// Configuração da autenticação JWT
const serviceAccountAuth = new JWT({
    email: SERVICE_ACCOUNT_EMAIL,
    key: PRIVATE_KEY.replace(/\\n/g, '\n'), // Converter quebras de linha
    scopes: [
        'https://www.googleapis.com/auth/spreadsheets'
    ]
});

// =============================================================================
// FUNÇÃO: INICIALIZAR CONEXÃO COM GOOGLE SHEETS
// =============================================================================
async function initializeGoogleSheets() {
    try {
        console.log('Inicializando conexão com Google Sheets...');
        
        // Criar instância do documento da planilha
        const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
        
        // Carregar informações do documento
        await doc.loadInfo();
        console.log(`Conectado à planilha: ${doc.title}`);
        
        // Verificar se a aba 'Tickets' existe, senão criar
        let sheet = doc.sheetsByTitle[SHEET_NAME];
        
        if (!sheet) {
            console.log(`Aba '${SHEET_NAME}' não encontrada. Criando nova aba...`);
            sheet = await doc.addSheet({ 
                title: SHEET_NAME,
                headerValues: [
                    'ID',
                    'Canal',
                    'Nome Cliente',
                    'Contato',
                    'Mensagem',
                    'Status',
                    'Prioridade',
                    'Classificação',
                    'Sugestão IA',
                    'Atendente',
                    'Data Criação',
                    'Data Atualização'
                ]
            });
            console.log(`Aba '${SHEET_NAME}' criada com sucesso!`);
        }
        
        return { doc, sheet };
        
    } catch (error) {
        console.error('Erro ao inicializar Google Sheets:', error);
        throw new Error(`Falha na conexão com Google Sheets: ${error.message}`);
    }
}

// =============================================================================
// FUNÇÃO: ADICIONAR NOVO TICKET À PLANILHA
// =============================================================================
async function addTicket(ticketData) {
    try {
        console.log('Adicionando novo ticket ao Google Sheets...');
        console.log('Dados do ticket:', JSON.stringify(ticketData, null, 2));
        
        // Inicializar conexão com a planilha
        const { doc, sheet } = await initializeGoogleSheets();
        
        // Preparar dados do ticket para inserção
        const rowData = {
            'ID': ticketData.id || `TICKET_${Date.now()}`,
            'Canal': ticketData.channel || 'unknown',
            'Nome Cliente': ticketData.clientName || 'Cliente Anônimo',
            'Contato': ticketData.clientContact || ticketData.clientPhone || 'N/A',
            'Mensagem': ticketData.message || ticketData.content || '',
            'Status': ticketData.status || 'open',
            'Prioridade': ticketData.priority || 'medium',
            'Classificação': ticketData.classification || 'pending',
            'Sugestão IA': ticketData.aiSuggestion || 'Aguardando análise...',
            'Atendente': ticketData.assignedTo || 'Não atribuído',
            'Data Criação': ticketData.createdAt || new Date().toISOString(),
            'Data Atualização': ticketData.updatedAt || new Date().toISOString()
        };
        
        // Adicionar linha à planilha
        const addedRow = await sheet.addRow(rowData);
        
        console.log(`Ticket ${rowData.ID} adicionado com sucesso na linha ${addedRow.rowNumber}`);
        
        return {
            success: true,
            message: 'Ticket adicionado com sucesso',
            ticketId: rowData.ID,
            rowNumber: addedRow.rowNumber,
            timestamp: new Date().toISOString()
        };
        
    } catch (error) {
        console.error('Erro ao adicionar ticket:', error);
        
        return {
            success: false,
            message: 'Erro ao adicionar ticket',
            error: error.message,
            timestamp: new Date().toISOString()
        };
    }
}

// =============================================================================
// FUNÇÃO: BUSCAR TODOS OS TICKETS DA PLANILHA
// =============================================================================
async function getTickets(filters = {}) {
    try {
        console.log('Buscando tickets do Google Sheets...');
        console.log('Filtros aplicados:', filters);
        
        // Inicializar conexão com a planilha
        const { doc, sheet } = await initializeGoogleSheets();
        
        // Carregar todas as linhas da planilha
        const rows = await sheet.getRows();
        
        // Converter linhas em objetos de ticket
        let tickets = rows.map(row => ({
            id: row.get('ID'),
            channel: row.get('Canal'),
            clientName: row.get('Nome Cliente'),
            clientContact: row.get('Contato'),
            message: row.get('Mensagem'),
            status: row.get('Status'),
            priority: row.get('Prioridade'),
            classification: row.get('Classificação'),
            aiSuggestion: row.get('Sugestão IA'),
            assignedTo: row.get('Atendente'),
            createdAt: row.get('Data Criação'),
            updatedAt: row.get('Data Atualização'),
            rowNumber: row.rowNumber // Para futuras atualizações
        }));
        
        // Aplicar filtros se fornecidos
        if (filters.status) {
            tickets = tickets.filter(ticket => ticket.status === filters.status);
        }
        
        if (filters.channel) {
            tickets = tickets.filter(ticket => ticket.channel === filters.channel);
        }
        
        if (filters.priority) {
            tickets = tickets.filter(ticket => ticket.priority === filters.priority);
        }
        
        if (filters.assignedTo) {
            tickets = tickets.filter(ticket => ticket.assignedTo === filters.assignedTo);
        }
        
        // Aplicar limite se especificado
        if (filters.limit) {
            tickets = tickets.slice(0, parseInt(filters.limit));
        }
        
        console.log(`Retornando ${tickets.length} tickets do Google Sheets`);
        
        return {
            success: true,
            message: 'Tickets recuperados com sucesso',
            total: tickets.length,
            filters: filters,
            data: tickets,
            timestamp: new Date().toISOString()
        };
        
    } catch (error) {
        console.error('Erro ao buscar tickets:', error);
        
        return {
            success: false,
            message: 'Erro ao buscar tickets',
            error: error.message,
            data: [],
            timestamp: new Date().toISOString()
        };
    }
}

// =============================================================================
// FUNÇÃO: ATUALIZAR TICKET EXISTENTE
// =============================================================================
async function updateTicket(ticketId, updateData) {
    try {
        console.log(`Atualizando ticket ${ticketId}...`);
        console.log('Dados de atualização:', updateData);
        
        // Inicializar conexão com a planilha
        const { doc, sheet } = await initializeGoogleSheets();
        
        // Carregar todas as linhas para encontrar o ticket
        const rows = await sheet.getRows();
        
        // Encontrar a linha do ticket pelo ID
        const targetRow = rows.find(row => row.get('ID') === ticketId);
        
        if (!targetRow) {
            throw new Error(`Ticket com ID ${ticketId} não encontrado`);
        }
        
        // Atualizar campos especificados
        if (updateData.status) targetRow.set('Status', updateData.status);
        if (updateData.priority) targetRow.set('Prioridade', updateData.priority);
        if (updateData.classification) targetRow.set('Classificação', updateData.classification);
        if (updateData.aiSuggestion) targetRow.set('Sugestão IA', updateData.aiSuggestion);
        if (updateData.assignedTo) targetRow.set('Atendente', updateData.assignedTo);
        
        // Sempre atualizar timestamp
        targetRow.set('Data Atualização', new Date().toISOString());
        
        // Salvar mudanças
        await targetRow.save();
        
        console.log(`Ticket ${ticketId} atualizado com sucesso`);
        
        return {
            success: true,
            message: 'Ticket atualizado com sucesso',
            ticketId: ticketId,
            updatedFields: Object.keys(updateData),
            timestamp: new Date().toISOString()
        };
        
    } catch (error) {
        console.error('Erro ao atualizar ticket:', error);
        
        return {
            success: false,
            message: 'Erro ao atualizar ticket',
            error: error.message,
            timestamp: new Date().toISOString()
        };
    }
}

// =============================================================================
// FUNÇÃO: TESTAR CONEXÃO COM GOOGLE SHEETS
// =============================================================================
async function testConnection() {
    try {
        console.log('Testando conexão com Google Sheets...');
        
        const { doc, sheet } = await initializeGoogleSheets();
        
        // Verificar se consegue acessar informações básicas
        const info = {
            spreadsheetTitle: doc.title,
            sheetTitle: sheet.title,
            rowCount: sheet.rowCount,
            columnCount: sheet.columnCount,
            timestamp: new Date().toISOString()
        };
        
        console.log('Conexão testada com sucesso:', info);
        
        return {
            success: true,
            message: 'Conexão com Google Sheets funcionando',
            info: info
        };
        
    } catch (error) {
        console.error('Erro no teste de conexão:', error);
        
        return {
            success: false,
            message: 'Erro na conexão com Google Sheets',
            error: error.message
        };
    }
}

// =============================================================================
// EXPORTAÇÕES
// =============================================================================
module.exports = {
    addTicket,
    getTickets,
    updateTicket,
    testConnection,
    initializeGoogleSheets
};

// =============================================================================
// EXEMPLO DE USO (COMENTADO)
// =============================================================================
/*
// Adicionar um novo ticket
const novoTicket = {
    id: 'TICKET_001',
    channel: 'whatsapp',
    clientName: 'João Silva',
    clientContact: '+5511999999999',
    message: 'Preciso de ajuda com meu pedido',
    status: 'open',
    priority: 'high',
    classification: 'suporte'
};

addTicket(novoTicket).then(result => {
    console.log('Resultado:', result);
});

// Buscar tickets com filtros
getTickets({ status: 'open', limit: 10 }).then(result => {
    console.log('Tickets encontrados:', result.data);
});

// Atualizar um ticket
updateTicket('TICKET_001', {
    status: 'closed',
    classification: 'resolvido'
}).then(result => {
    console.log('Atualização:', result);
});

// Testar conexão
testConnection().then(result => {
    console.log('Teste de conexão:', result);
});
*/