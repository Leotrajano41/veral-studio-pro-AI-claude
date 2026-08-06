# ==========================================
# STAGE 1: Base com dependências do SO (FFmpeg)
# ==========================================
FROM node:18-alpine AS base
RUN apk add --no-cache ffmpeg python3 make g++

# ==========================================
# STAGE 2: Instalação de dependências do Node
# ==========================================
FROM base AS dependencies
WORKDIR /app
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY web/package*.json ./web/
COPY mobile/package*.json ./mobile/
RUN npm install --production=false

# ==========================================
# STAGE 3: Build dos serviços
# ==========================================
FROM dependencies AS builder
WORKDIR /app
COPY . .

# ==========================================
# STAGE 4: Imagem de execução final (Runner)
# ==========================================
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Copia dependências e código-fonte compilado/necessário
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/backend/node_modules ./backend/node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/backend ./backend

EXPOSE 5000

# Executa o servidor backend por padrão
CMD ["npm", "run", "start:backend"]
