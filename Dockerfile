# Dockerfile Corrigido (v2)
FROM node:18-alpine

# Define o diretório de trabalho principal
WORKDIR /app

# 1. Copia TODO o repositório para dentro do contêiner
# Teremos /app/index.html, /app/backend/server.js, etc.
COPY . .

# 2. Muda o diretório de trabalho para a pasta do backend
WORKDIR /app/backend

# 3. Instala as dependências (ele vai encontrar /app/backend/package.json)
RUN npm install --production

# 4. Expõe a porta
EXPOSE 3000

# 5. Inicia o servidor DE DENTRO da pasta backend
# O __dirname será /app/backend, e o '../' vai para /app (onde está o index.html)
CMD ["node", "server.js"]