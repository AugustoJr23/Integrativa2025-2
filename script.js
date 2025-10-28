/**
 * PONTO FOCAL - Script do Painel
 *
 * JavaScript para atualizar o painel em tempo real com Socket.IO:
 * - Conexão Socket.IO com backend para atualizações em tempo real
 * - Renderização dinâmica de tickets e mensagens
 * - Envio de respostas para diferentes canais
 * - Gerenciamento de estado da interface
 * - Notificações de novos tickets
 *
 * Funcionalidades principais:
 * - Escutar eventos Socket.IO (novos tickets, mensagens, status)
 * - Renderizar lista de tickets dinamicamente
 * - Implementar interface de chat para envio de mensagens
 * - Gerenciar filtros por canal e status
 * - Exibir notificações em tempo real
 */

// TODO: Implementar envio de mensagens via API (exceto WhatsApp)
// TODO: Adicionar sistema de filtros dinâmicos
// TODO: Implementar notificações em tempo real
// TODO: Criar interface de chat responsiva
// TODO: Implementar gerenciamento de estado local
// TODO: Melhorar a identificação do cliente e criação dinâmica de conversas

// ===== VARIÁVEIS GLOBAIS =====
let selectedChannel = 'whatsapp';
let currentClient = 'maria-silva'; // ID inicial, pode precisar ser dinâmico
let isUserScrolling = false; // Controle do scroll automático
let socket; // Variável global para a conexão Socket.IO

const channelConfig = {
    whatsapp: { name: 'WhatsApp', icon: 'fab fa-whatsapp', class: 'whatsapp', color: '#25d366' },
    email: { name: 'E-mail', icon: 'fas fa-envelope', class: 'email', color: '#3b82f6' },
    webchat: { name: 'Chat Web', icon: 'fas fa-comments', class: 'webchat', color: '#7c3aed' },
    instagram: { name: 'Instagram', icon: 'fab fa-instagram', class: 'instagram', color: '#e1306c' },
    unknown: { name: 'Desconhecido', icon: 'fas fa-question-circle', class: 'unknown', color: '#6b7280' } // Canal padrão
};

// Client data structure (Mantendo como exemplo inicial)
const clientsData = {
    'maria-silva': {
        id: 'maria-silva', // Adicionando ID
        name: 'Maria Clara Silva',
        avatar: 'MC',
        avatarColor: '#2563eb',
        email: 'maria.clara@email.com',
        phone: '19999998888', // <-- CORRIGIDO: Número sem formatação para envio
        location: 'Campinas, SP',
        status: 'online',
        activeChannels: ['whatsapp', 'email', 'webchat'],
        messages: [
            { id: 'msg1', content: 'Olá! Gostaria de saber sobre os produtos de vocês', sender: 'client', time: '14:20', channel: 'whatsapp', timestamp: new Date(Date.now() - 3600000).toISOString() },
            { id: 'msg2', content: 'Olá Maria! Claro, temos várias opções disponíveis. Qual tipo de produto você tem interesse?', sender: 'agent', time: '14:22', channel: 'whatsapp', timestamp: new Date(Date.now() - 3500000).toISOString() },
            { id: 'msg3', content: 'Estou procurando algo sustentável para minha empresa', sender: 'client', time: '14:25', channel: 'whatsapp', timestamp: new Date(Date.now() - 3400000).toISOString() },
            { id: 'msg4', content: 'Temos uma linha completa de produtos eco-friendly! Vou te enviar o catálogo.', sender: 'agent', time: '14:27', channel: 'whatsapp', timestamp: new Date(Date.now() - 3300000).toISOString() },
            { id: 'msg5', content: 'Perfeito! E sobre o desconto...', sender: 'client', time: '15:50', channel: 'whatsapp', timestamp: new Date(Date.now() - 1000000).toISOString() }
        ],
        notes: 'Cliente interessado em compra recorrente.\nPrefere contato via WhatsApp.\nEmpresa: Silva & Associados\nDecisor: Própria cliente',
        kpis: { messages: 12, channels: 4, avgTime: '1m 30s', satisfaction: '98%', attendants: 3, transfers: 0 }
    },
    // Adicionar outros clientes aqui se necessário para testes iniciais
    // 'joao-pereira': { ... },
};

// --- FUNÇÕES DE UTILIDADE ---

// Função para formatar timestamp (melhoria)
function formatMessageTime(isoTimestamp) {
    if (!isoTimestamp) return 'agora';
    const date = new Date(isoTimestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Função para obter ID do cliente a partir do número (simplificado)
function getClientIdFromNumber(phoneNumber) {
    // Em um sistema real, isso buscaria no banco de dados
    // Aqui, vamos apenas verificar se o número corresponde a Maria Silva
    if (phoneNumber && clientsData['maria-silva'].phone && phoneNumber.includes(clientsData['maria-silva'].phone)) {
        return 'maria-silva';
    }
    // TODO: Criar/buscar cliente dinamicamente se não for Maria Silva
    return null; // Ou criar um ID temporário
}


// --- FUNÇÕES DO SOCKET.IO ---

function setupSocketIO() {
    // Conecta ao servidor Socket.IO
    socket = io(); // Conecta ao mesmo host/porta que serve a página

    socket.on('connect', () => {
        console.log('✅ Socket.IO conectado ao servidor com ID:', socket.id);
        // **AVISA O BACKEND QUE ESTE É UM PAINEL DE ATENDENTE**
        socket.emit('join-atendente');
    });

    // Ouve por novas mensagens enviadas pelo servidor (via webhook)
    socket.on('nova-mensagem', (mensagemData) => {
        console.log('📨 Nova mensagem recebida via Socket.IO:', mensagemData);

        // Extrai informações relevantes (ajustar conforme estrutura REAL do webhook)
        let senderNumber = null;
        let messageContent = '[Conteúdo não extraído]';
        let messageChannel = 'unknown';

        try {
             // Tenta extrair da estrutura da Evolution API (webhook)
             if (mensagemData.content && mensagemData.content.data) {
                senderNumber = mensagemData.content.sender?.replace('@whatsapp.net', ''); // Pega o número de quem enviou
                messageChannel = 'whatsapp'; // Assumindo que vem da Evolution

                const msg = mensagemData.content.data.message;
                 if (msg?.conversation) {
                    messageContent = msg.conversation;
                 } else if (msg?.extendedTextMessage?.text) {
                    messageContent = msg.extendedTextMessage.text;
                 } else {
                    messageContent = `[${mensagemData.content.data.type || 'Tipo não suportado'}]`;
                 }
             } else if (mensagemData.content) { // Fallback genérico
                messageContent = JSON.stringify(mensagemData.content);
                senderNumber = mensagemData.senderId || null; // Tenta pegar um ID do remetente
                messageChannel = mensagemData.channel || 'unknown';
             }
        } catch (e) {
            console.error("Erro ao processar conteúdo da mensagem:", e, mensagemData);
            messageContent = "[Erro ao processar mensagem]";
        }


        // Identifica para qual cliente é a mensagem
        const targetClientId = getClientIdFromNumber(senderNumber);

        if (targetClientId) {
             // Adiciona a mensagem aos dados do cliente (para persistência na sessão)
             const newMessage = {
                 id: `msg_${Date.now()}`, // ID único
                 content: messageContent,
                 sender: 'client', // Mensagens do webhook são do cliente
                 time: formatMessageTime(mensagemData.timestamp || new Date().toISOString()),
                 channel: messageChannel,
                 timestamp: mensagemData.timestamp || new Date().toISOString()
             };
             clientsData[targetClientId].messages.push(newMessage);

             // Se o cliente da mensagem for o que está ativo na tela, renderiza
             if (targetClientId === currentClient) {
                 adicionarMensagemAoChat(newMessage);
                 scrollToBottomIfNeeded(); // Rola se necessário
             } else {
                 // TODO: Atualizar contador de não lidas para o cliente inativo
                 console.log(`Nova mensagem para ${targetClientId} (inativo). Atualizar badge.`);
                 // Exemplo: incrementarBadgeNaoLidas(targetClientId);
             }
              // Atualiza preview na barra lateral
             updateConversationPreview(targetClientId, messageContent, messageChannel);

        } else {
            // TODO: Lidar com mensagens de números desconhecidos (criar novo cliente/conversa)
            console.warn(`Mensagem recebida de número desconhecido: ${senderNumber}. Criar nova conversa.`);
            // Exemplo: criarNovaConversa(senderNumber, messageContent, messageChannel);
        }
    });

    socket.on('atendente-connected', (data) => {
        console.log('✅ Confirmação do servidor:', data.message);
    });

    socket.on('connect_error', (err) => {
        console.error('❌ Erro de conexão Socket.IO:', err.message);
    });

    socket.on('disconnect', (reason) => {
        console.log('🔌 Socket.IO desconectado:', reason);
        if (reason === 'io server disconnect') {
            // O servidor desconectou a conexão, tenta reconectar
            socket.connect();
        }
        // else: O cliente desconectou ou erro de rede, o socket tenta reconectar automaticamente
    });
}

// --- FUNÇÕES DE RENDERIZAÇÃO E UI ---

// Função para adicionar uma nova mensagem (cliente ou agente) ao chat
function adicionarMensagemAoChat(msgData) {
    const chatMessages = document.querySelector('.chat-messages');
    if (!chatMessages) return;

    const config = channelConfig[msgData.channel] || channelConfig.unknown;
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${msgData.sender === 'agent' ? 'sent' : ''}`; // Adiciona classe 'sent' se for do agente

    messageDiv.innerHTML = `
        <div class="message-content">
            <div class="message-header">
                <span class="channel-badge ${config.class}">
                    <i class="${config.icon}"></i> ${config.name}
                </span>
                <span>${msgData.time || 'agora'}</span>
            </div>
            ${msgData.content}
            <div class="message-time">${formatMessageTime(msgData.timestamp)}</div>
        </div>
    `;

    chatMessages.appendChild(messageDiv);
}

// Toggle channel selector dropdown
function toggleChannelSelector() {
    const options = document.getElementById('channelOptions');
    options.classList.toggle('show');
}

// Select channel for sending messages
function selectChannel(channel) {
    selectedChannel = channel;
    const config = channelConfig[channel];
    const dropdown = document.querySelector('.channel-dropdown');

    dropdown.className = `channel-dropdown ${config.class}`;
    dropdown.innerHTML = `
        <i class="${config.icon}"></i>
        <span>${config.name}</span>
        <i class="fas fa-chevron-down" style="margin-left: auto; font-size: 10px;"></i>
    `;
    document.getElementById('channelOptions').classList.remove('show');
}

// Client switching functionality
document.querySelectorAll('.conversation-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.conversation-item').forEach(conv => conv.classList.remove('active'));
        item.classList.add('active');
        const clientId = item.getAttribute('data-client');
        switchToClient(clientId);
    });
});

// Switch to client function
function switchToClient(clientId) {
    if (!clientsData[clientId]) {
        console.error(`Cliente com ID "${clientId}" não encontrado.`);
        // TODO: Talvez carregar dados do cliente via API se não existir localmente
        return;
    }
    currentClient = clientId;
    const client = clientsData[clientId];

    updateChatHeader(client);
    updateCustomerPanel(client);
    renderClientMessages(client); // Usa render em vez de load
}

// Update chat header with client info
function updateChatHeader(client) {
    const avatar = document.querySelector('.client-avatar');
    const name = document.querySelector('.client-details h3');
    const activeChannels = document.querySelector('.active-channels');

    avatar.textContent = client.avatar;
    avatar.style.background = client.avatarColor;
    name.textContent = client.name;

    activeChannels.innerHTML = client.activeChannels.map(channel => {
        const config = channelConfig[channel];
        return `<span class="mini-channel-badge ${config.class}">
            <i class="${config.icon}"></i> ${config.name}
        </span>`;
    }).join('');
}

// Update customer panel
function updateCustomerPanel(client) {
    document.querySelector('.customer-avatar').textContent = client.avatar;
    document.querySelector('.customer-avatar').style.background = client.avatarColor;
    document.querySelector('.customer-name').textContent = client.name;
    document.querySelector('.customer-details').innerHTML = `
        <div><i class="fas fa-envelope"></i> ${client.email || 'N/A'}</div>
        <div><i class="fas fa-phone"></i> ${client.phone || 'N/A'}</div>
        <div><i class="fas fa-map-marker-alt"></i> ${client.location || 'N/A'}</div>
    `;
    document.querySelector('.notes-textarea').value = client.notes || '';

    const kpiCards = document.querySelectorAll('.kpi-card .kpi-value');
    if (client.kpis) {
        kpiCards[0].textContent = client.kpis.messages;
        kpiCards[1].textContent = client.kpis.channels;
        kpiCards[2].textContent = client.kpis.avgTime;
        kpiCards[3].textContent = client.kpis.satisfaction;
        kpiCards[4].textContent = client.kpis.attendants;
        kpiCards[5].textContent = client.kpis.transfers;
    } else {
        kpiCards.forEach(card => card.textContent = '-'); // Limpa KPIs se não houver dados
    }
}

// Render client messages (substitui loadClientMessages)
function renderClientMessages(client) {
    const chatMessages = document.querySelector('.chat-messages');
    // Limpa apenas as mensagens, mantém o botão de histórico
     chatMessages.querySelectorAll('.message, .attendant-change, .channel-transition').forEach(msg => {
       if (!msg.classList.contains('load-history-btn')) {
           msg.remove();
       }
     });

    // Adiciona as mensagens do cliente selecionado
    if (client.messages && client.messages.length > 0) {
        client.messages.forEach(msgData => {
            adicionarMensagemAoChat(msgData); // Reutiliza a função de adicionar
        });
    }

    // Força rolagem ao trocar de cliente
    setTimeout(() => scrollToBottom(), 50); // Pequeno delay
}

// Tab switching functionality
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        document.querySelectorAll('[id$="-content"]').forEach(content => {
            content.style.display = 'none';
        });
        const tabName = tab.getAttribute('data-tab');
        document.getElementById(tabName + '-content').style.display = 'block';
    });
});

// Load unified history functionality (Mantido como estava)
function loadHistory() { /* ... código original ... */ }

// Send message functionality
function sendMessage() {
    const input = document.querySelector('.message-input');
    const messageText = input.value.trim();
    const client = clientsData[currentClient]; // Pega o cliente atual

    if (messageText && client) {
        const config = channelConfig[selectedChannel];

        // 1. Cria o objeto da mensagem
         const newMessageData = {
             id: `msg_${Date.now()}`,
             content: messageText,
             sender: 'agent', // Mensagem enviada pelo painel é do agente
             time: formatMessageTime(new Date().toISOString()),
             channel: selectedChannel,
             timestamp: new Date().toISOString()
         };

        // 2. Adiciona a mensagem visualmente ao chat
        adicionarMensagemAoChat(newMessageData);

        // 3. Adiciona a mensagem aos dados do cliente (para histórico da sessão)
        client.messages.push(newMessageData);

        // 4. Limpa o input
        input.value = '';
        input.style.height = 'auto'; // Reseta altura

        // 5. Atualiza preview na barra lateral
        updateConversationPreview(currentClient, messageText, selectedChannel);

        // 6. Rola para o fundo
        scrollToBottomIfNeeded();

        // 7. Envia a mensagem via API (apenas para WhatsApp, por enquanto)
        if (selectedChannel === 'whatsapp' && client.phone) {
            const toNumber = client.phone.replace(/\D/g, ''); // Garante apenas números
             if(toNumber){
                 console.log(`Enviando via API para ${toNumber}: ${messageText}`);
                 fetch('/api/send-whatsapp', {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({ to: toNumber, message: messageText }) // Usa messageText
                 })
                 .then(res => res.json())
                 .then(data => {
                     console.log('✅ Resposta da Evolution API:', data);
                     if (!data.success) {
                         console.error('⚠️ Erro retornado pela API:', data.error);
                         // TODO: Mostrar erro na UI para o atendente
                     }
                 })
                 .catch(err => {
                     console.error('❌ Erro CRÍTICO ao chamar /api/send-whatsapp:', err);
                     // TODO: Mostrar erro na UI para o atendente
                 });
             } else {
                 console.error(`⚠️ Cliente ${client.name} sem número de telefone válido para enviar WhatsApp.`);
                 // TODO: Mostrar erro na UI
             }
        } else {
            console.log(`Mensagem "${messageText}" adicionada localmente para canal ${selectedChannel}. Envio via API não implementado para este canal.`);
            // TODO: Implementar envio para outros canais (Email, Instagram, etc.)
        }
    }
}


// Update conversation preview in sidebar
function updateConversationPreview(clientId, message, channel) {
    const conversationItem = document.querySelector(`.conversation-item[data-client="${clientId}"]`);
    if (!conversationItem) {
        // TODO: Criar o item de conversa se ele não existir
        console.warn(`Item de conversa para cliente ${clientId} não encontrado na barra lateral.`);
        return;
    }
    const preview = conversationItem.querySelector('.conversation-preview span');
    const time = conversationItem.querySelector('.conversation-time');
    const channelIcon = conversationItem.querySelector('.conversation-channel');
    const config = channelConfig[channel] || channelConfig.unknown;

    const previewText = message.length > 30 ? message.substring(0, 30) + '...' : message;
    if(preview) preview.textContent = previewText;

    if(channelIcon) {
        channelIcon.className = `${config.icon} conversation-channel`;
        channelIcon.style.color = config.color;
    }

    if(time) time.textContent = formatMessageTime(new Date().toISOString());

    // Move a conversa para o topo da lista
    const list = document.querySelector('.conversations-list');
    if (list && conversationItem !== list.firstChild) {
        list.prepend(conversationItem);
    }
}

// --- FUNÇÕES DE SCROLL (Mantidas como estavam) ---
function initializeChatScroll() { /* ... código original ... */ }
function scrollToBottomIfNeeded() { /* ... código original ... */ }
function scrollToBottom() { /* ... código original ... */ }

// --- OUTRAS FUNÇÕES DE UI (Mantidas) ---
function getChannelColor(channel) { /* ... código original ... */ }