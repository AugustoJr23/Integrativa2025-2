# Dockerfile Definitivo (v5) - Usa a imagem Node.js completa
FROM node:18

# 1. Define o diretório de trabalho
WORKDIR /app

# 2. Copia o package.json (da raiz)
COPY package*.json ./

# 3. Instala as dependências (A imagem 'node:18' já tem as build tools)
RUN npm install --production

# 4. Copia todo o restante do projeto
COPY . .

# 5. Expõe a porta
EXPOSE 3000

# 6. Comando para iniciar o servidor (que está na pasta backend)
CMD ["node", "backend/server.js"]