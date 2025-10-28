# Dockerfile Corrigido (v4)
FROM node:18-alpine

# 1. Instala as ferramentas de build (python, make, g++)
# Necessário para compilar dependências nativas (ex: socket.io)
RUN apk add --no-cache python3 make g++

# 2. Define o diretório de trabalho
WORKDIR /app

# 3. Copia o package.json (da raiz)
COPY package*.json ./

# 4. Instala as dependências
RUN npm install --production

# 5. Copia todo o restante do projeto
COPY . .

# 6. Expõe a porta
EXPOSE 3000

# 7. Comando para iniciar o servidor (que está na pasta backend)
CMD ["node", "backend/server.js"]