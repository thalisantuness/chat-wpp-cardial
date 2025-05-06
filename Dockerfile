FROM node:18
WORKDIR /app

# 1. Instala dependências do sistema
RUN apt-get update && \
    apt-get install -y unzip && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 2. Copia todos os arquivos (incluindo partes do zip se necessário)
COPY . .

# 3. Combina e extrai os arquivos zip (se estiver usando split)
RUN if ls tokens_part_* 1> /dev/null 2>&1; then \
      cat tokens_part_* > tokens.zip && \
      unzip -o tokens.zip -d ./ && \
      rm tokens.zip tokens_part_*; \
    fi

# 4. Limpeza e instalação segura de dependências
RUN npm cache clean --force && \
    rm -rf package-lock.json node_modules && \
    npm install --legacy-peer-deps --force --loglevel=verbose

# 5. Extração normal (caso não use split)
RUN if [ -f tokens.zip ]; then \
      unzip -o tokens.zip -d ./ && \
      rm tokens.zip; \
    fi

CMD ["npm", "start"]