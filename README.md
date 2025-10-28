# 🎯 Ponto Focal - Plataforma Omnicanal com IA

## 📋 Descrição da Solução

O **Ponto Focal** é uma aplicação web omnicanal que integra **WhatsApp**, **Instagram**, **E-mail** e **Chat Web** em uma única plataforma de atendimento, potencializada por **Inteligência Artificial** para automação inteligente do suporte ao cliente.

### 🎯 Objetivo
Centralizar e automatizar o atendimento ao cliente através de:
- **Unificação**: Todos os canais em um painel único
- **Automação**: IA responde automaticamente quando possível
- **Escalamento**: Transferência inteligente para atendimento humano
- **Eficiência**: Redução do tempo de resposta e aumento da satisfação

## 🏗️ Arquitetura da Solução

### Backend (Node.js + Express + Socket.IO)

- **evolution.js**: Integração com Evolution API para WhatsApp

### Frontend (HTML + CSS + JavaScript)
- **index.html**: Painel principal do atendente
- **style.css**: Estilos responsivos do painel
- **script.js**: Atualizações em tempo real com Socket.IO

### Automação (n8n + ChatGPT)
- **workflow.json**: Fluxo completo do atendimento omnicanal

### Banco de Dados (Google Sheets)
- Armazenamento de mensagens, tickets e clientes
- Fácil visualização e edição dos dados
- Sem custos de banco de dados tradicional

## 🔄 Fluxo de Funcionamento

### 1. Recebimento de Mensagem
```
Cliente → Canal → Webhook → Backend → Google Sheets
```

### 2. Processamento com IA
```
Backend → n8n → ChatGPT → Análise → Decisão
```

### 3. Resposta Automática
```
n8n → Backend → Canal → Cliente
```

### 4. Escalamento Humano
```
n8n → Backend → Ticket → Painel → Atendente
```

## 🛠️ Configuração e Execução

### Pré-requisitos
- Node.js 16+
- Conta Google (para Sheets API)
- Instância n8n
- Tokens das APIs dos canais

### Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd ponto-focal
```

2. **Instale as dependências**
```bash
npm install express socket.io axios googleapis dotenv cors
```

3. **Configuração Evolution API (WhatsApp)**
    - Solicite acesso à Evolution API e obtenha seu token
    - Adicione ao arquivo `.env`:
       ```
       EVOLUTION_API_URL=https://api.evolution.com.br/v1/messages
       EVOLUTION_TOKEN=seu_token_evolution
       ```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Edite o arquivo .env com suas credenciais
```

4. **Configure o Google Sheets**
- Crie um projeto no Google Cloud Console
- Ative a Google Sheets API
- Crie uma Service Account e baixe o JSON
- Configure as credenciais no .env

5. **Configure o n8n**
- Importe o workflow do arquivo `n8n/workflow.json`
- Configure os webhooks e credenciais do ChatGPT
- Ative o workflow

6. **Execute a aplicação**
```bash
node backend/server.js
```

Acesse: `http://localhost:3000`

## 🚀 Deploy (Render)

### Configuração
1. Conecte seu repositório GitHub ao Render
2. Selecione "Web Service"
3. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `node backend/server.js`
   - **Environment**: Adicione todas as variáveis do .env

### Variáveis de Ambiente Obrigatórias
```
PORT=3000
WHATSAPP_ACCESS_TOKEN=...
INSTAGRAM_ACCESS_TOKEN=...
MAILGUN_API_KEY=...
GOOGLE_SHEETS_ID=...
N8N_WEBHOOK_URL=...
OPENAI_API_KEY=...
```

EVOLUTION_API_URL=...
EVOLUTION_TOKEN=...

## 🔌 Integrações

### WhatsApp Business API (Meta Cloud API)

### Evolution API (WhatsApp)
- Envio e recebimento de mensagens WhatsApp via Evolution
- Webhook para receber mensagens de clientes
- Endpoint `/api/send-whatsapp` para envio

### Instagram Messaging API
- Direct messages
- Comentários em posts
- Respostas automáticas

### E-mail (Mailgun)
- Recebimento via webhook
- Envio com templates HTML
- Anexos e formatação rica

### Chat Web
- Widget incorporável no site
- Sessões em tempo real
- Transferência para WhatsApp

## 📊 Estrutura do Google Sheets

### Abas Organizadas
- **WhatsApp**: Mensagens do WhatsApp
- **Instagram**: Mensagens do Instagram  
- **Email**: Mensagens de e-mail
- **Chat**: Mensagens do chat web
- **Tickets**: Tickets de atendimento
- **Clientes**: Base de dados de clientes

### Colunas Principais
- ID, Canal, Cliente, Mensagem, Timestamp, Status, Atendente

## 🤖 Automação com IA

### Fluxo n8n
1. **Webhook**: Recebe mensagem do backend
2. **Análise**: Contextualiza com histórico
3. **ChatGPT**: Processa e gera resposta
4. **Decisão**: Resposta automática ou escalamento
5. **Ação**: Responde ou cria ticket

### Critérios de Escalamento
- Complexidade da pergunta
- Sentimento negativo detectado
- Solicitação explícita de atendimento humano
- Falha na compreensão da IA

## 📈 Funcionalidades

### ✅ Painel do Atendente
- Lista de tickets em tempo real
- Chat interface unificado
- Indicadores visuais de status
- Filtros por canal e prioridade

### ✅ Automação Inteligente
- Respostas automáticas contextualizadas
- Escalamento inteligente
- Análise de sentimento
- Aprendizado contínuo

### ✅ Relatórios
- Tempo médio de resposta
- Taxa de resolução automática
- Satisfação do cliente
- Volume por canal

## 👥 Equipe

**Time 2 - Ponto Focal**  
Projeto desenvolvido para a disciplina Integrativa SI 2025.2

## 📄 Licença

Este projeto é desenvolvido para fins acadêmicos como parte da disciplina Integrativa de Sistemas de Informação.

---

🚀 **Ponto Focal** - Centralizando o atendimento, potencializando resultados!