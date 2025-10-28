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

// TODO: Implementar conexão Socket.IO com backend
// TODO: Criar funções de renderização de tickets
// TODO: Implementar envio de mensagens via API
// TODO: Adicionar sistema de filtros dinâmicos
// TODO: Implementar notificações em tempo real
// TODO: Criar interface de chat responsiva
// TODO: Implementar gerenciamento de estado local
     
     // ===== VARIÁVEIS GLOBAIS =====
        let selectedChannel = 'whatsapp';
        let currentClient = 'maria-silva';
        let isUserScrolling = false; // Controle do scroll automático
        
        const channelConfig = {
            whatsapp: { name: 'WhatsApp', icon: 'fab fa-whatsapp', class: 'whatsapp' },
            email: { name: 'E-mail', icon: 'fas fa-envelope', class: 'email' },
            webchat: { name: 'Chat Web', icon: 'fas fa-comments', class: 'webchat' },
            instagram: { name: 'Instagram', icon: 'fab fa-instagram', class: 'instagram' }
        };

        // Client data structure
        const clientsData = {
            'maria-silva': {
                name: 'Maria Clara Silva',
                avatar: 'MC',
                avatarColor: '#2563eb',
                email: 'maria.clara@email.com',
                phone: '(19) 99999-8888',
                location: 'Campinas, SP',
                status: 'online',
                activeChannels: ['whatsapp', 'email', 'webchat'],
                messages: [
                    { content: 'Olá! Gostaria de saber sobre os produtos de vocês', sender: 'client', time: '14:20', channel: 'whatsapp' },
                    { content: 'Olá Maria! Claro, temos várias opções disponíveis. Qual tipo de produto você tem interesse?', sender: 'agent', time: '14:22', channel: 'whatsapp' },
                    { content: 'Estou procurando algo sustentável para minha empresa', sender: 'client', time: '14:25', channel: 'whatsapp' },
                    { content: 'Temos uma linha completa de produtos eco-friendly! Vou te enviar o catálogo.', sender: 'agent', time: '14:27', channel: 'whatsapp' },
                    { content: 'Perfeito! E sobre o desconto...', sender: 'client', time: '15:50', channel: 'whatsapp' }
                ],
                notes: 'Cliente interessado em compra recorrente.\nPrefere contato via WhatsApp.\nEmpresa: Silva & Associados\nDecisor: Própria cliente',
                kpis: { messages: 12, channels: 4, avgTime: '1m 30s', satisfaction: '98%', attendants: 3, transfers: 0 }
            },
            'joao-pereira': {
                name: 'João Pereira',
                avatar: 'JP',
                avatarColor: '#16a34a',
                email: 'joao.pereira@empresa.com.br',
                phone: '(11) 98888-7777',
                location: 'São Paulo, SP',
                status: 'away',
                activeChannels: ['email', 'webchat'],
                messages: [
                    { content: 'Aguardo retorno da proposta', sender: 'client', time: '14:32', channel: 'email' },
                    { content: 'Claro! Vou enviar agora mesmo.', sender: 'agent', time: '14:35', channel: 'email' },
                    { content: 'Perfeito, obrigado!', sender: 'client', time: '14:40', channel: 'webchat' }
                ],
                notes: 'Gestor de compras da empresa ABC Ltda.\nPrefere comunicação formal por e-mail.\nDecisão compartilhada com diretoria.',
                kpis: { messages: 8, channels: 2, avgTime: '3m 15s', satisfaction: '95%', attendants: 2, transfers: 1 }
            },
            'ana-costa': {
                name: 'Ana Costa',
                avatar: 'AC',
                avatarColor: '#dc2626',
                email: 'ana.costa@gmail.com',
                phone: '(21) 97777-6666',
                location: 'Rio de Janeiro, RJ',
                status: 'online',
                activeChannels: ['webchat', 'whatsapp'],
                messages: [
                    { content: 'Muito obrigada pelo atendimento!', sender: 'client', time: '13:15', channel: 'webchat' },
                    { content: 'Foi um prazer ajudar! 😊', sender: 'agent', time: '13:16', channel: 'webchat' },
                    { content: 'Vocês são sempre muito atenciosos', sender: 'client', time: '13:18', channel: 'whatsapp' }
                ],
                notes: 'Cliente fidelizada há 2 anos.\nSempre muito educada e satisfeita.\nCompra mensalmente.',
                kpis: { messages: 5, channels: 2, avgTime: '45s', satisfaction: '100%', attendants: 1, transfers: 0 }
            },
            'pedro-lima': {
                name: 'Pedro Lima',
                avatar: 'PL',
                avatarColor: '#ea580c',
                email: 'pedro@startup.tech',
                phone: '(85) 96666-5555',
                location: 'Fortaleza, CE',
                status: 'offline',
                activeChannels: ['instagram', 'whatsapp'],
                messages: [
                    { content: 'Quando vocês abrem amanhã?', sender: 'client', time: 'ontem', channel: 'instagram' },
                    { content: 'Olá! Abrimos às 8h 👍', sender: 'agent', time: 'ontem', channel: 'instagram' },
                    { content: 'Show! Obrigado', sender: 'client', time: 'ontem', channel: 'whatsapp' }
                ],
                notes: 'Jovem empreendedor, muito ativo no Instagram.\nPrefere linguagem mais descontraída.\nBusca soluções inovadoras.',
                kpis: { messages: 15, channels: 3, avgTime: '2m 45s', satisfaction: '92%', attendants: 2, transfers: 0 }
            },
            'carla-mendes': {
                name: 'Carla Mendes',
                avatar: 'CM',
                avatarColor: '#7c3aed',
                email: 'carla.mendes@consultoria.com',
                phone: '(47) 95555-4444',
                location: 'Florianópolis, SC',
                status: 'online',
                activeChannels: ['email', 'whatsapp'],
                messages: [
                    { content: 'Recebi o orçamento, muito bom!', sender: 'client', time: 'ontem', channel: 'email' },
                    { content: 'Que bom! Tem alguma dúvida?', sender: 'agent', time: 'ontem', channel: 'email' },
                    { content: 'Não, está tudo claro. Vamos prosseguir!', sender: 'client', time: 'ontem', channel: 'whatsapp' }
                ],
                notes: 'Consultora experiente.\nMuito detalhista nas especificações.\nPrecisa de documentação completa.',
                kpis: { messages: 22, channels: 2, avgTime: '4m 12s', satisfaction: '97%', attendants: 3, transfers: 1 }
            }
        };

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
            
            // Update dropdown appearance
            dropdown.className = `channel-dropdown ${config.class}`;
            dropdown.innerHTML = `
                <i class="${config.icon}"></i>
                <span>${config.name}</span>
                <i class="fas fa-chevron-down" style="margin-left: auto; font-size: 10px;"></i>
            `;
            
            // Hide options
            document.getElementById('channelOptions').classList.remove('show');
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            const selector = document.querySelector('.channel-selector');
            if (!selector.contains(e.target)) {
                document.getElementById('channelOptions').classList.remove('show');
            }
        });

        // Client switching functionality
        document.querySelectorAll('.conversation-item').forEach(item => {
            item.addEventListener('click', () => {
                // Remove active class from all conversations
                document.querySelectorAll('.conversation-item').forEach(conv => conv.classList.remove('active'));
                // Add active class to clicked conversation
                item.classList.add('active');
                
                // Switch to selected client
                const clientId = item.getAttribute('data-client');
                switchToClient(clientId);
            });
        });

        /* ===================================================================
           CORREÇÃO 1: CONTROLE DE SCROLL INTELIGENTE DO CHAT
           ===================================================================
           PROBLEMA CORRIGIDO: Chat descia automaticamente a cada nova mensagem
           
           SOLUÇÃO IMPLEMENTADA:
           - Detecta se usuário está próximo do final (tolerância de 100px)
           - Só rola automaticamente se usuário estiver no final
           - Scroll suave com behavior: 'smooth'
           - Debounce para evitar verificações excessivas
           =================================================================== */

        // Inicializar controle de scroll quando a página carregar
        document.addEventListener('DOMContentLoaded', function() {
            initializeChatScroll();
        });

        function initializeChatScroll() {
            const chatMessages = document.querySelector('.chat-messages');
            if (!chatMessages) return;

            // CORREÇÃO: Detectar posição do scroll com mais precisão
            let scrollTimer;
            chatMessages.addEventListener('scroll', function() {
                const { scrollTop, scrollHeight, clientHeight } = chatMessages;
                // MELHORIA: Usuário está próximo do final (tolerância de 100px)
                const isNearBottom = (scrollTop + clientHeight >= scrollHeight - 100);
                isUserScrolling = !isNearBottom;
                
                // DEBOUNCE: Evitar muitas verificações durante scroll rápido
                clearTimeout(scrollTimer);
                scrollTimer = setTimeout(() => {
                    // Após parar de rolar, verificar posição novamente
                    const finalCheck = chatMessages.scrollTop + chatMessages.clientHeight >= chatMessages.scrollHeight - 50;
                    isUserScrolling = !finalCheck;
                }, 150);
            });

            // Observar mudanças no DOM para detectar novas mensagens
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        // Nova mensagem adicionada, rolar apenas se usuário estava no final
                        scrollToBottomIfNeeded();
                    }
                });
            });

            observer.observe(chatMessages, {
                childList: true,
                subtree: true
            });
        }

        // CORREÇÃO: Scroll suave apenas quando necessário
        function scrollToBottomIfNeeded() {
            const chatMessages = document.querySelector('.chat-messages');
            if (!chatMessages) return;
            
            // MELHORIA: Só rola se usuário estiver próximo do final (não navegando histórico)
            if (!isUserScrolling) {
                // SCROLL SUAVE: Comportamento mais natural
                chatMessages.scrollTo({
                    top: chatMessages.scrollHeight,
                    behavior: 'smooth'
                });
            }
        }

        // Função para forçar rolagem (usada em mudança de cliente)
        function scrollToBottom() {
            const chatMessages = document.querySelector('.chat-messages');
            if (!chatMessages) return;
            
            isUserScrolling = false;
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // Switch to client function
        function switchToClient(clientId) {
            currentClient = clientId;
            const client = clientsData[clientId];
            
            updateChatHeader(client);
            updateCustomerPanel(client);
            loadClientMessages(client);
        }

        // Update chat header with client info
        function updateChatHeader(client) {
            const avatar = document.querySelector('.client-avatar');
            const name = document.querySelector('.client-details h3');
            const activeChannels = document.querySelector('.active-channels');
            
            avatar.textContent = client.avatar;
            avatar.style.background = client.avatarColor;
            name.textContent = client.name;
            
            // Update active channels
            activeChannels.innerHTML = client.activeChannels.map(channel => {
                const config = channelConfig[channel];
                return `<span class="mini-channel-badge ${config.class}">
                    <i class="${config.icon}"></i> ${config.name}
                </span>`;
            }).join('');
        }

        // Update customer panel
        function updateCustomerPanel(client) {
            // Update customer info
            document.querySelector('.customer-avatar').textContent = client.avatar;
            document.querySelector('.customer-avatar').style.background = client.avatarColor;
            document.querySelector('.customer-name').textContent = client.name;
            document.querySelector('.customer-details').innerHTML = `
                <div><i class="fas fa-envelope"></i> ${client.email}</div>
                <div><i class="fas fa-phone"></i> ${client.phone}</div>
                <div><i class="fas fa-map-marker-alt"></i> ${client.location}</div>
            `;
            
            // Update notes
            document.querySelector('.notes-textarea').value = client.notes;
            
            // Update KPIs
            const kpiCards = document.querySelectorAll('.kpi-card .kpi-value');
            kpiCards[0].textContent = client.kpis.messages;
            kpiCards[1].textContent = client.kpis.channels;
            kpiCards[2].textContent = client.kpis.avgTime;
            kpiCards[3].textContent = client.kpis.satisfaction;
            kpiCards[4].textContent = client.kpis.attendants;
            kpiCards[5].textContent = client.kpis.transfers;
        }

        // Load client messages (simplified for demo)
        function loadClientMessages(client) {
            const chatMessages = document.querySelector('.chat-messages');
            
            if (client.name === 'Maria Clara Silva') {
                // Keep existing Maria's messages
                return;
            }
            
            // Clear chat for other clients and show sample messages
            const existingMessages = chatMessages.querySelectorAll('.message, .attendant-change, .channel-transition');
            existingMessages.forEach(msg => {
                if (!msg.classList.contains('load-history-btn')) {
                    msg.remove();
                }
            });
            
            // Add sample messages for other clients
            const sampleMessages = getSampleMessagesForClient(client);
            sampleMessages.forEach(msgData => {
                const messageDiv = document.createElement('div');
                messageDiv.className = msgData.sent ? 'message sent' : 'message';
                messageDiv.innerHTML = `
                    <div class="message-content">
                        <div class="message-header">
                            <span class="channel-badge ${msgData.channel}">
                                <i class="${channelConfig[msgData.channel].icon}"></i> ${channelConfig[msgData.channel].name}
                            </span>
                            <span>${msgData.time}</span>
                        </div>
                        ${msgData.text}
                        <div class="message-time">${msgData.timestamp}</div>
                    </div>
                `;
                chatMessages.appendChild(messageDiv);
            });
            
            // SCROLL INTELIGENTE: Forçar rolagem ao trocar de cliente
            setTimeout(() => scrollToBottom(), 100);
        }

        // Get sample messages for different clients
        function getSampleMessagesForClient(client) {
            const samples = {
                'joao-pereira': [
                    {sent: false, channel: 'email', time: 'hoje • 14:30', timestamp: '14:30', text: 'Bom dia! Gostaria de solicitar uma proposta para 500 unidades do produto Y.'},
                    {sent: true, channel: 'email', time: 'hoje • 14:32', timestamp: '14:32', text: 'Bom dia João! Claro, vou preparar a proposta detalhada para você. Qual o prazo de entrega desejado?'},
                    {sent: false, channel: 'webchat', time: 'hoje • 15:15', timestamp: '15:15', text: 'Mudei para o chat para ser mais rápido. Preciso da entrega até o fim do mês.'}
                ],
                'ana-costa': [
                    {sent: false, channel: 'webchat', time: 'hoje • 13:10', timestamp: '13:10', text: 'Olá! Vim fazer meu pedido mensal. Podem me ajudar?'},
                    {sent: true, channel: 'webchat', time: 'hoje • 13:11', timestamp: '13:11', text: 'Oi Ana! Claro, sempre um prazer atendê-la. O pedido usual de sempre?'},
                    {sent: false, channel: 'webchat', time: 'hoje • 13:15', timestamp: '13:15', text: 'Isso mesmo! Muito obrigada pelo atendimento sempre excelente! ❤️'}
                ],
                'pedro-lima': [
                    {sent: false, channel: 'instagram', time: 'ontem • 18:45', timestamp: '18:45', text: 'Ei! Vi o post de vocês. Que horário vocês abrem amanhã?'},
                    {sent: true, channel: 'instagram', time: 'ontem • 19:02', timestamp: '19:02', text: 'Oi Pedro! Abrimos às 8h. Te mando mais detalhes no WhatsApp?'},
                    {sent: false, channel: 'whatsapp', time: 'hoje • 08:30', timestamp: '08:30', text: 'Migrei pro WhatsApp. Preciso de uma solução tech para minha startup!'}
                ],
                'carla-mendes': [
                    {sent: false, channel: 'email', time: 'ontem • 16:20', timestamp: '16:20', text: 'Boa tarde! Recebi o orçamento por e-mail. Está muito bom! Preciso de alguns esclarecimentos técnicos.'},
                    {sent: true, channel: 'email', time: 'ontem • 16:45', timestamp: '16:45', text: 'Ótimo Carla! Fico à disposição para esclarecer qualquer dúvida técnica.'},
                    {sent: false, channel: 'whatsapp', time: 'hoje • 09:15', timestamp: '09:15', text: 'Vim pelo WhatsApp para ser mais ágil. Podem me enviar as especificações completas?'}
                ]
            };
            
            return samples[client.name.toLowerCase().replace(' ', '-')] || [];
        }

        // Tab switching functionality
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Hide all tab contents
                document.querySelectorAll('[id$="-content"]').forEach(content => {
                    content.style.display = 'none';
                });
                
                // Show corresponding content
                const tabName = tab.getAttribute('data-tab');
                document.getElementById(tabName + '-content').style.display = 'block';
            });
        });

        // Load unified history functionality
        function loadHistory() {
            const btn = document.querySelector('.load-history-btn');
            const historyDiv = document.getElementById('chat-history');
            
            btn.innerHTML = '<div class="loading"></div> Carregando histórico omnicanal...';
            
            setTimeout(() => {
                historyDiv.style.display = 'block';
                btn.style.display = 'none';
                
                // Animate history messages
                const historyMessages = historyDiv.querySelectorAll('.message');
                historyMessages.forEach((msg, index) => {
                    setTimeout(() => {
                        msg.style.animation = 'messageSlide 0.3s ease-out';
                    }, index * 200);
                });
                
                // Show channel transitions
                const transitions = historyDiv.querySelectorAll('.channel-transition');
                transitions.forEach((transition, index) => {
                    setTimeout(() => {
                        transition.style.animation = 'messageSlide 0.3s ease-out';
                    }, (index + 1) * 500);
                });
            }, 1500);
        }

        // Send message functionality with unified chat
        function sendMessage() {
            const input = document.querySelector('.message-input');
            const message = input.value.trim();
            
            if (message) {
                const chatMessages = document.querySelector('.chat-messages');
                const config = channelConfig[selectedChannel];
                const client = clientsData[currentClient];
                
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message sent';
                messageDiv.innerHTML = `
                    <div class="message-content">
                        <div class="message-header">
                            <span class="channel-badge ${config.class}">
                                <i class="${config.icon}"></i> ${config.name}
                            </span>
                            <span>agora</span>
                        </div>
                        ${message}
                        <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    </div>
                `;
                
                chatMessages.appendChild(messageDiv);
                input.value = '';
                
                // Update conversation preview in sidebar
                updateConversationPreview(currentClient, message, selectedChannel);
                
                // SCROLL INTELIGENTE: Nova mensagem sempre rola para baixo
                scrollToBottomIfNeeded();
                
                    // Enviar mensagem via Evolution API se canal for WhatsApp
                    if (selectedChannel === 'whatsapp') {
                        // Número do destinatário (exemplo: do painel ou cliente)
                        const toNumber = client.phone.replace(/\D/g, ''); // Remove caracteres não numéricos
                        fetch('/api/send-whatsapp', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ to: toNumber, message })
                        })
                        .then(res => res.json())
                        .then(data => {
                            console.log('Evolution API response:', data);
                        })
                        .catch(err => {
                            console.error('Erro ao enviar via Evolution:', err);
                        });
                    }
            }
        }

        // Update conversation preview in sidebar
        function updateConversationPreview(clientId, message, channel) {
            const conversationItem = document.querySelector(`[data-client="${clientId}"]`);
            const preview = conversationItem.querySelector('.conversation-preview');
            const time = conversationItem.querySelector('.conversation-time');
            const channelIcon = conversationItem.querySelector('.conversation-channel');
            
            const config = channelConfig[channel];
            
            // Update preview text (limit to 30 chars)
            const previewText = message.length > 30 ? message.substring(0, 30) + '...' : message;
            preview.querySelector('span').textContent = previewText;
            
            // Update channel icon
            channelIcon.className = `${config.icon} conversation-channel`;
            channelIcon.style.color = getChannelColor(channel);
            
            // Update time
            time.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        }

        function getChannelColor(channel) {
            const colors = {
                whatsapp: '#25d366',
                email: '#3b82f6',
                webchat: '#7c3aed',
                instagram: '#e1306c'
            };
            return colors[channel] || '#6b7280';
        }

        // Helper functions for realistic simulation
        function getRandomChannel() {
            const channels = ['whatsapp', 'email', 'webchat'];
            return channels[Math.floor(Math.random() * channels.length)];
        }

        function getRandomResponseForClient(client) {
            const responses = {
                'Maria Clara Silva': [
                    'Perfeito! Muito obrigada pelo esclarecimento. 😊',
                    'Ótimo! E sobre o desconto mencionado?',
                    'Entendi! Vou fechar o pedido então.',
                    'Excelente atendimento como sempre! 👏'
                ],
                'João Pereira': [
                    'Entendi. Pode enviar por e-mail para documentar?',
                    'Preciso analisar com a diretoria.',
                    'Ótimo! Aguardo a proposta formal.',
                    'Muito profissional o atendimento.'
                ],
                'Ana Costa': [
                    'Muito obrigada! Vocês são ótimos! ❤️',
                    'Perfeito! Até o próximo mês então.',
                    'Sempre um prazer ser atendida aqui!',
                    'Obrigada pela agilidade de sempre! 😊'
                ],
                'Pedro Lima': [
                    'Show! Vocês são muito inovadores! 🚀',
                    'Perfeito! Isso vai revolucionar minha startup!',
                    'Top! Quando podemos implementar?',
                    'Massa! Vamos fechar negócio! 💪'
                ],
                'Carla Mendes': [
                    'Excelente! Preciso da documentação técnica.',
                    'Perfeito! Está tudo muito bem detalhado.',
                    'Ótimo trabalho! Vou recomendar vocês.',
                    'Muito profissional. Obrigada pela clareza.'
                ]
            };
            
            const clientResponses = responses[client.name] || responses['Maria Clara Silva'];
            return clientResponses[Math.floor(Math.random() * clientResponses.length)];
        }

        // Auto-resize textarea
        document.querySelector('.message-input').addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });

        // Enter to send message
        document.querySelector('.message-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // ===== MODAL DIFERENCIAIS REMOVIDO CONFORME SOLICITADO =====
        // Função removida: toggleDifferentials() não é mais necessária

        // Search functionality
        document.querySelector('.search-bar input').addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            // Simulate search results
            if (query.length > 2) {
                console.log('Searching unified conversations for:', query);
                // Here you would implement actual search logic across all channels
            }
        });

        // Search conversations
        document.querySelector('.conversations-search input').addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            const conversations = document.querySelectorAll('.conversation-item');
            
            conversations.forEach(conv => {
                const name = conv.querySelector('.conversation-name').textContent.toLowerCase();
                const preview = conv.querySelector('.conversation-preview span').textContent.toLowerCase();
                
                if (name.includes(query) || preview.includes(query)) {
                    conv.style.display = 'flex';
                } else {
                    conv.style.display = 'none';
                }
            });
        });

        // ===== INICIALIZAÇÃO DA APLICAÇÃO =====
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize with Maria Silva (first client)
            switchToClient('maria-silva');
            
            // MODAL REMOVIDO: Não há mais pop-up automático de diferenciais
            console.log('YggHub inicializado com sucesso - Modal de diferenciais removido');
        });

        // Simulate real-time updates
        setInterval(() => {
            const onlineCount = Math.floor(Math.random() * 5) + 10;
            document.querySelector('.status-indicator').innerHTML = `
                <div class="status-dot"></div>
                Online (${onlineCount})
            `;
        }, 10000);

        // ============================================================================
        // NAVEGAÇÃO MOBILE - ESTILO WHATSAPP
        // ============================================================================

        let currentMobileScreen = 'conversations';

        // Função para trocar entre telas mobile
        function switchMobileScreen(screenName) {
            // Esconder todas as telas
            document.querySelectorAll('.mobile-screen').forEach(screen => {
                screen.style.display = 'none';
            });
            
            // Mostrar tela selecionada
            document.getElementById(`mobile-${screenName}`).style.display = 'flex';
            currentMobileScreen = screenName;
        }

        // Populatar lista de conversas mobile - usando os mesmos dados do desktop
        function populateMobileConversations() {
            const conversationsList = document.querySelector('.mobile-conversations-list');
            
            if (!conversationsList) {
                // Tentar novamente após um pequeno delay
                setTimeout(populateMobileConversations, 200);
                return;
            }
            
            conversationsList.innerHTML = ''; // Limpar lista
            
            // Dados das conversas do desktop
            const desktopConversations = [
                {
                    id: 'maria-silva',
                    name: 'Maria Clara Silva',
                    avatar: 'MC',
                    avatarColor: '#2563eb',
                    status: 'online',
                    channel: { icon: 'fab fa-whatsapp', color: '#25d366' },
                    preview: 'Perfeito! E sobre o desconto...',
                    time: '15:50',
                    unread: 2
                },
                {
                    id: 'joao-pereira',
                    name: 'João Pereira',
                    avatar: 'JP',
                    avatarColor: '#16a34a',
                    status: 'away',
                    channel: { icon: 'fas fa-envelope', color: '#3b82f6' },
                    preview: 'Aguardo retorno da proposta',
                    time: '14:32',
                    unread: 0
                },
                {
                    id: 'ana-costa',
                    name: 'Ana Costa',
                    avatar: 'AC',
                    avatarColor: '#dc2626',
                    status: 'online',
                    channel: { icon: 'fas fa-comments', color: '#7c3aed' },
                    preview: 'Muito obrigada pelo atendimento!',
                    time: '13:15',
                    unread: 0
                },
                {
                    id: 'pedro-lima',
                    name: 'Pedro Lima',
                    avatar: 'PL',
                    avatarColor: '#ea580c',
                    status: 'offline',
                    channel: { icon: 'fab fa-instagram', color: '#e1306c' },
                    preview: 'Quando vocês abrem amanhã?',
                    time: 'ontem',
                    unread: 1
                },
                {
                    id: 'carla-mendes',
                    name: 'Carla Mendes',
                    avatar: 'CM',
                    avatarColor: '#7c3aed',
                    status: 'online',
                    channel: { icon: 'fas fa-envelope', color: '#3b82f6' },
                    preview: 'Recebi o orçamento, muito bom!',
                    time: 'ontem',
                    unread: 0
                }
            ];
            
            desktopConversations.forEach(conversation => {
                const conversationItem = document.createElement('div');
                conversationItem.className = 'mobile-conversation-item';
                conversationItem.innerHTML = `
                    <div class="mobile-conversation-avatar" style="background: ${conversation.avatarColor}">
                        ${conversation.avatar}
                    </div>
                    <div class="mobile-conversation-status status-${conversation.status}"></div>
                    <div class="mobile-conversation-info">
                        <div class="mobile-conversation-name">${conversation.name}</div>
                        <div class="mobile-conversation-preview">
                            <i class="${conversation.channel.icon}" style="color: ${conversation.channel.color};"></i>
                            <span>${conversation.preview}</span>
                        </div>
                    </div>
                    <div class="mobile-conversation-meta">
                        <div class="mobile-conversation-time">${conversation.time}</div>
                        ${conversation.unread > 0 ? `<div class="mobile-unread-badge">${conversation.unread}</div>` : ''}
                    </div>
                `;
                
                conversationItem.addEventListener('click', () => {
                    currentClient = conversation.id;
                    populateMobileChat();
                    switchMobileScreen('chat');
                });
                
                conversationsList.appendChild(conversationItem);
            });
        }

        // Popular chat mobile com mensagens do cliente atual
        function populateMobileChat() {
            const client = clientsData[currentClient];
            
            if (!client) {
                return;
            }
            
            const chatMessages = document.querySelector('.mobile-chat-messages');
            const contactName = document.querySelector('.mobile-contact-name');
            const contactStatus = document.querySelector('.mobile-contact-status');
            
            // Atualizar header do chat
            if (contactName) contactName.textContent = client.name;
            if (contactStatus) {
                contactStatus.textContent = client.status === 'online' ? 'Online agora' : 
                    client.status === 'away' ? 'Ausente' : 'Visto por último hoje';
            }
            
            // Limpar mensagens antigas
            if (chatMessages) {
                chatMessages.innerHTML = '';
                
                // Mapeamento de canais para ícones
                const channelIcons = {
                    whatsapp: { icon: 'fab fa-whatsapp', color: '#25d366', name: 'WhatsApp' },
                    email: { icon: 'fas fa-envelope', color: '#3b82f6', name: 'E-mail' },
                    webchat: { icon: 'fas fa-comments', color: '#7c3aed', name: 'Chat Web' },
                    instagram: { icon: 'fab fa-instagram', color: '#e1306c', name: 'Instagram' }
                };
                
                // Adicionar mensagens com indicador de canal
                if (client.messages && client.messages.length > 0) {
                    client.messages.forEach(message => {
                        const messageChannel = message.channel || 'whatsapp';
                        const channelInfo = channelIcons[messageChannel];
                        
                        const messageElement = document.createElement('div');
                        messageElement.className = `mobile-message ${message.sender === 'client' ? 'mobile-message-received' : 'mobile-message-sent'}`;
                        messageElement.innerHTML = `
                            <div class="mobile-message-header" data-channel="${messageChannel}">
                                <i class="${channelInfo.icon}" style="color: ${channelInfo.color};" title="${channelInfo.name}"></i>
                                <span class="mobile-message-channel">${channelInfo.name}</span>
                            </div>
                            <div class="mobile-message-content">${message.content}</div>
                            <div class="mobile-message-time">${message.time}</div>
                        `;
                        chatMessages.appendChild(messageElement);
                    });
                }
                
                // Scroll para última mensagem
                setTimeout(() => {
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 100);
            }
        }

        // Popular informações do cliente mobile
        function populateMobileInfo() {
            const client = clientsData[currentClient];
            
            // Popular aba de anotações
            document.getElementById('mobile-notes').innerHTML = `
                <div class="mobile-info-content">
                    <h4>Anotações do Cliente</h4>
                    <div class="mobile-client-basic-info">
                        <p><strong>Nome:</strong> ${client.name}</p>
                        <p><strong>Email:</strong> ${client.email}</p>
                        <p><strong>Telefone:</strong> ${client.phone}</p>
                        <p><strong>Localização:</strong> ${client.location}</p>
                    </div>
                    <div class="mobile-notes-section">
                        <h5>Observações:</h5>
                        <p>Cliente preferencial, sempre atende rapidamente. Interessado em produtos sustentáveis.</p>
                    </div>
                </div>
            `;
            
            // Popular aba de relatórios
            document.getElementById('mobile-reports').innerHTML = `
                <div class="mobile-info-content">
                    <h4>Relatórios</h4>
                    <div class="mobile-kpis">
                        <div class="mobile-kpi-item">
                            <span class="mobile-kpi-value">12</span>
                            <span class="mobile-kpi-label">Mensagens</span>
                        </div>
                        <div class="mobile-kpi-item">
                            <span class="mobile-kpi-value">3</span>
                            <span class="mobile-kpi-label">Canais</span>
                        </div>
                        <div class="mobile-kpi-item">
                            <span class="mobile-kpi-value">2m</span>
                            <span class="mobile-kpi-label">Tempo médio</span>
                        </div>
                    </div>
                </div>
            `;
            
            // Popular aba de histórico
            document.getElementById('mobile-history').innerHTML = `
                <div class="mobile-info-content">
                    <h4>Histórico de Atendimento</h4>
                    <div class="mobile-history-list">
                        <div class="mobile-history-item">
                            <strong>Hoje, 14:30</strong> - Iniciou conversa via WhatsApp
                        </div>
                        <div class="mobile-history-item">
                            <strong>Ontem, 16:45</strong> - Enviou email sobre produto
                        </div>
                        <div class="mobile-history-item">
                            <strong>3 dias atrás</strong> - Atendimento finalizado com sucesso
                        </div>
                    </div>
                </div>
            `;
        }

        // Event listeners para navegação mobile
        let mobileNavigationInitialized = false;
        
        function initMobileNavigation() {
            if (mobileNavigationInitialized) return;
            mobileNavigationInitialized = true;
            
            // Botões de voltar
            document.querySelectorAll('.mobile-back-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    if (currentMobileScreen === 'chat') {
                        switchMobileScreen('conversations');
                    } else if (currentMobileScreen === 'info') {
                        switchMobileScreen('chat');
                    }
                });
            });
            
            // Botão de informações
            document.querySelector('.mobile-info-btn').addEventListener('click', () => {
                populateMobileInfo();
                switchMobileScreen('info');
            });
            
            // Abas das informações
            document.querySelectorAll('.mobile-tab').forEach(tab => {
                tab.addEventListener('click', () => {
                    const tabName = tab.dataset.tab;
                    
                    // Remover classe active de todas as abas
                    document.querySelectorAll('.mobile-tab').forEach(t => t.classList.remove('active'));
                    document.querySelectorAll('.mobile-tab-pane').forEach(p => p.classList.remove('active'));
                    
                    // Ativar aba clicada
                    tab.classList.add('active');
                    document.getElementById(`mobile-${tabName}`).classList.add('active');
                });
            });
            
            // Dropdown de canais mobile
            let currentMobileChannel = 'whatsapp';
            
            // Toggle dropdown
            document.getElementById('mobile-channel-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                const dropdown = document.getElementById('mobile-channel-dropdown');
                dropdown.classList.toggle('show');
            });
            
            // Fechar dropdown ao clicar fora
            document.addEventListener('click', (e) => {
                const dropdown = document.getElementById('mobile-channel-dropdown');
                if (!e.target.closest('.mobile-channel-selector')) {
                    dropdown.classList.remove('show');
                }
            });
            
            // Selecionar canal
            document.querySelectorAll('.mobile-channel-option').forEach(option => {
                option.addEventListener('click', () => {
                    const channel = option.dataset.channel;
                    const icon = option.querySelector('i');
                    
                    // Atualizar botão com o ícone selecionado
                    const channelBtn = document.querySelector('.mobile-channel-icon');
                    channelBtn.className = `mobile-channel-icon ${icon.className}`;
                    channelBtn.style.color = icon.style.color;
                    
                    // Atualizar opções ativas
                    document.querySelectorAll('.mobile-channel-option').forEach(opt => {
                        opt.classList.remove('active');
                    });
                    option.classList.add('active');
                    
                    // Atualizar canal atual
                    currentMobileChannel = channel;
                    
                    // Fechar dropdown
                    document.getElementById('mobile-channel-dropdown').classList.remove('show');
                });
            });
            
            // Enviar mensagem mobile
            document.querySelector('.mobile-send-btn').addEventListener('click', () => {
                const input = document.querySelector('.mobile-message-input');
                const message = input.value.trim();
                
                if (message) {
                    // Mapeamento de canais para ícones
                    const channelIcons = {
                        whatsapp: { icon: 'fab fa-whatsapp', color: '#25d366', name: 'WhatsApp' },
                        email: { icon: 'fas fa-envelope', color: '#3b82f6', name: 'E-mail' },
                        webchat: { icon: 'fas fa-comments', color: '#7c3aed', name: 'Chat Web' },
                        instagram: { icon: 'fab fa-instagram', color: '#e1306c', name: 'Instagram' }
                    };
                    
                    const channelInfo = channelIcons[currentMobileChannel];
                    
                    // Adicionar mensagem ao chat
                    const chatMessages = document.querySelector('.mobile-chat-messages');
                    const messageElement = document.createElement('div');
                    messageElement.className = 'mobile-message mobile-message-sent';
                    messageElement.innerHTML = `
                        <div class="mobile-message-header" data-channel="${currentMobileChannel}">
                            <i class="${channelInfo.icon}" style="color: ${channelInfo.color};" title="${channelInfo.name}"></i>
                            <span class="mobile-message-channel">${channelInfo.name}</span>
                        </div>
                        <div class="mobile-message-content">${message}</div>
                        <div class="mobile-message-time">${new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}</div>
                    `;
                    chatMessages.appendChild(messageElement);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                    
                    // Limpar input
                    input.value = '';
                    
                    // RESPOSTA AUTOMÁTICA - igual ao desktop
                    setTimeout(() => {
                        const client = clientsData[currentClient];
                        if (client) {
                            // Canal aleatório para resposta (às vezes muda de canal)
                            const responseChannels = ['whatsapp', 'email', 'webchat', 'instagram'];
                            const responseChannel = Math.random() > 0.7 ? 
                                responseChannels[Math.floor(Math.random() * responseChannels.length)] : 
                                currentMobileChannel;
                            
                            const responseChannelInfo = channelIcons[responseChannel];
                            const responseText = getRandomResponseForClient(client);
                            
                            const responseElement = document.createElement('div');
                            responseElement.className = 'mobile-message mobile-message-received';
                            responseElement.innerHTML = `
                                <div class="mobile-message-header" data-channel="${responseChannel}">
                                    <i class="${responseChannelInfo.icon}" style="color: ${responseChannelInfo.color};" title="${responseChannelInfo.name}"></i>
                                    <span class="mobile-message-channel">${responseChannelInfo.name}</span>
                                </div>
                                <div class="mobile-message-content">${responseText}</div>
                                <div class="mobile-message-time">${new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}</div>
                            `;
                            
                            chatMessages.appendChild(responseElement);
                            chatMessages.scrollTop = chatMessages.scrollHeight;
                            
                            // Atualizar último canal do cliente
                            currentMobileChannel = responseChannel;
                            
                            // Atualizar botão do canal
                            const channelBtn = document.querySelector('.mobile-channel-icon');
                            channelBtn.className = `mobile-channel-icon ${responseChannelInfo.icon}`;
                            channelBtn.style.color = responseChannelInfo.color;
                        }
                    }, 2000); // 2 segundos de delay igual ao desktop
                }
            });
            
            // Enter para enviar mensagem
            document.querySelector('.mobile-message-input').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    document.querySelector('.mobile-send-btn').click();
                }
            });
            
            // Busca de conversas mobile
            document.querySelector('.mobile-search-bar input').addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                document.querySelectorAll('.mobile-conversation-item').forEach(item => {
                    const name = item.querySelector('.mobile-conversation-name').textContent.toLowerCase();
                    item.style.display = name.includes(query) ? 'flex' : 'none';
                });
            });
        }

        // Inicialização mobile
        function initMobile() {
            if (window.innerWidth <= 768) {
                setTimeout(() => {
                    populateMobileConversations();
                    initMobileNavigation();
                }, 500); // Delay maior para garantir que CSS foi aplicado
            }
        }
        
        // Múltiplas formas de inicializar para garantir que funcione
        document.addEventListener('DOMContentLoaded', initMobile);
        window.addEventListener('load', initMobile);
        
        // Reinicializar em resize
        window.addEventListener('resize', initMobile);
        
        // Forçar inicialização se já carregou
        if (document.readyState === 'complete') {
            initMobile();
        }