FROM oven/bun:alpine AS base
WORKDIR /app

# Instalar dependencias
COPY package.json ./
COPY bun.lock* ./
RUN bun install --production

# Copiar código fuente
COPY . .

# Exponer el puerto
EXPOSE 4000

ENV NODE_ENV=production
ENV PORT=4000

# Iniciar servidor Bun
CMD ["bun", "src/index.ts"]
