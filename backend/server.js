// Servidor principal do projeto "Ponto Focal"
// Este arquivo configura o servidor Express com Socket.IO para comunicação em tempo real

// Importação das dependências necessárias
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

// Importação das rotas customizadas do projeto
const routes = require('./routes');

// Criação da aplicação Express
const app = express();

// Criação do servidor HTTP que será usado pelo Socket.IO
const server = http.createServer(app);

// Configuração do Socket.IO com o servidor HTTP
// Permite comunicação bidirecional em tempo real entre cliente e servidor
const io = socketIo(server, {
    cors: {
        origin: "*", // Em produção, especificar domínios permitidos
        methods: ["GET", "POST"]
    }
});

// Configuração dos middlewares
// CORS - permite requisições de diferentes origens
app.use(cors({
    origin: '*', // Em produção, especificar domínios permitidos
    credentials: true
}));

// Middleware para parsing de JSON nas requisições
app.use(express.json({ limit: '10mb' }));

// Middleware para parsing de dados de formulário
app.use(express.urlencoded({ extended: true }));

// Middleware para servir arquivos estáticos (frontend)
app.use(express.static(path.join(__dirname, '../')));

// Disponibilizar a instância do Socket.IO para as rotas
// Isso permite que as rotas emitam eventos em tempo real
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Configuração das rotas da API
app.use('/api', routes);

// Rota para servir o arquivo principal do frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Configuração dos eventos do Socket.IO
io.on('connection', (socket) => {
    console.log(`Novo cliente conectado: ${socket.id}`);
    
    // Evento quando um cliente se identifica como atendente
    socket.on('join-atendente', () => {
        socket.join('atendentes');
        console.log(`Atendente conectado: ${socket.id}`);
        
        // Enviar confirmação de conexão
        socket.emit('atendente-connected', {
            message: 'Conectado ao painel de atendimento',
            timestamp: new Date().toISOString()
        });
    });
    
    // Evento quando um cliente se identifica como cliente
    socket.on('join-cliente', (clienteInfo) => {
        socket.join('clientes');
        console.log(`Cliente conectado: ${socket.id}`, clienteInfo);
        
        // Notificar atendentes sobre novo cliente
        socket.to('atendentes').emit('novo-cliente', {
            socketId: socket.id,
            ...clienteInfo,
            timestamp: new Date().toISOString()
        });
    });
    
    // Evento para atualizar status do atendimento
    socket.on('atualizar-status', (data) => {
        console.log('Status atualizado:', data);
        
        // Emitir atualização para todos os atendentes
        io.to('atendentes').emit('status-atualizado', {
            ...data,
            timestamp: new Date().toISOString()
        });
    });
    
    // Evento para notificações gerais
    socket.on('notificacao', (data) => {
        console.log('Nova notificação:', data);
        
        // Emitir notificação para todos os atendentes
        io.to('atendentes').emit('nova-notificacao', {
            ...data,
            timestamp: new Date().toISOString()
        });
    });
    
    // Evento de desconexão
    socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${socket.id}`);
        
        // Notificar atendentes sobre cliente desconectado
        io.to('atendentes').emit('cliente-desconectado', {
            socketId: socket.id,
            timestamp: new Date().toISOString()
        });
    });
});

// Configuração da porta do servidor
const PORT = process.env.PORT || 3000;

// Inicialização do servidor
server.listen(PORT, () => {
    console.log('===========================================');
    console.log(`🚀 Servidor "Ponto Focal" iniciado!`);
    console.log(`📡 Rodando na porta: ${PORT}`);
    console.log(`🌐 Acesse: http://localhost:${PORT}`);
    console.log(`⚡ Socket.IO ativo para tempo real`);
    console.log('===========================================');
});

// Tratamento de erros não capturados
process.on('uncaughtException', (err) => {
    console.error('Erro não capturado:', err);
});

process.on('unhandledRejection', (err) => {
    console.error('Promise rejeitada:', err);
});

// Exportar a instância do Socket.IO para uso em outros módulos
module.exports = { app, server, io };