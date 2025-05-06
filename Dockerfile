FROM node:18
WORKDIR /app

# Instala unzip e dependências do sistema
RUN apt-get update && apt-get install -y unzip

# Copia tudo (incluindo tokens.zip)
COPY . .

# Descompacta e instala dependências
RUN unzip -o tokens.zip -d ./ && \
    npm install --legacy-peer-deps --force

CMD ["npm", "start"]