# Dockerfile Corrigido para EasyPanel
FROM node:18-alpine

# Define o diretório de trabalho
WORKDIR /app

# 1. Copia o package.json DE DENTRO da pasta backend para a raiz do /app
COPY backend/package*.json ./

# 2. Instala as dependências
RUN npm install --production

# 3. Copia TODO o conteúdo da pasta backend para a raiz do /app
COPY backend/ .

# 4. Expõe a porta
EXPOSE 3000

# 5. Inicia o servidor (que agora está na raiz do /app)
CMD ["node", "server.js"]