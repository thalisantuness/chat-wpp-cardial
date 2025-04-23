const venom = require("venom-bot");
const cron = require("node-cron");
const qrcode = require("qrcode-terminal");

venom
  .create({
    session: "chatgpt-bot",
    headless: true,
    browserArgs: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process",
      "--disable-gpu",
    ],
    puppeteerOptions: {
      executablePath: process.env.CHROME_PATH || "/usr/bin/chromium-browser",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
    qrCode: (base64Qr, asciiQR) => {
      console.log("🔐 Escaneie o QR Code abaixo para autenticar no WhatsApp:");
      qrcode.generate(base64Qr, { small: true });
    },
  })
  .then((client) => {
    start(client);
    setupScheduledMessages(client);
  })
  .catch((err) => console.log(err));

function start(client) {
  client.onMessage(async (message) => {
    if (message.fromMe) return;

    const userMessage = message.body.trim().toLowerCase();

    // Mensagem de boas-vindas inicial
    if (
      userMessage === "oi" ||
      userMessage === "olá" ||
      userMessage === "voltar"
    ) {
      await client.sendText(
        message.from,
        `Olá! 👋 Eu sou o *Ted*, atendente da *Cardial I.T*. Em que podemos ajudar? \n\n` +
          `*Digite o número da opção desejada:*\n\n` +
          `1️⃣ - Dúvidas\n` +
          `2️⃣ - Valores\n` +
          `3️⃣ - Projetos\n` +
          `4️⃣ - Sair`
      );
    }
    // Opção 1: Dúvidas
    else if (userMessage === "1" || userMessage.includes("dúvida")) {
      await client.sendText(
        message.from,
        "Nos chame no *WhatsApp Business*: (55) 99929-3516 🛠️\n\n" +
          "*Digite VOLTAR para retornar ao menu principal.*"
      );
    }
    // Opção 2: Valores
    else if (userMessage === "2" || userMessage.includes("valor")) {
      await client.sendText(
        message.from,
        `*Valores dos nossos serviços:* 💰\n\n` +
          `📌 *Landing Pages*: R$ 800,00\n` +
          `📌 *Sistemas Web*: A partir de R$ 2.000,00\n` +
          `📌 *Chatbots*: A partir de R$ 3.000,00\n` +
          `📌 *Aplicativos*: A partir de R$ 4.000,00\n\n` +
          `Deseja algo personalizado? Nos chame no *WhatsApp Business*: (55) 99929-3516\n\n` +
          `*Digite VOLTAR para retornar ao menu principal.*`
      );
    }
    // Opção 3: Projetos
    else if (userMessage === "3" || userMessage.includes("projeto")) {
      await client.sendText(
        message.from,
        `*Confira alguns dos nossos projetos:* 🚀\n\n` +
          `🌐 *Site de vendas*: EM BREVE\n` +
          `🤖 *Chatbot De Atendimento*: EM BREVE\n` +
          `📱 *App de Agendamento*: EM BREVE\n\n` +
          `Quer um projeto semelhante? Podemos ajudar!\n\n` +
          `*Digite VOLTAR para retornar ao menu principal.*`
      );
    }
    // Opção 4: Sair
    else if (userMessage === "4" || userMessage.includes("sair")) {
      await client.sendText(
        message.from,
        "Foi um prazer ajudar! Se precisar, é só chamar. 👋\n*Cardial I.T* - Soluções em Software!"
      );
    }
    // Mensagem não reconhecida
    else {
      await client.sendText(
        message.from,
        `*Ted*: Não entendi. Por favor, digite uma opção válida:\n\n` +
          `1️⃣ - Dúvidas\n` +
          `2️⃣ - Valores\n` +
          `3️⃣ - Projetos\n` +
          `4️⃣ - Sair\n\n` +
          `Ou digite VOLTAR para retornar ao menu principal.`
      );
    }
  });
}

function setupScheduledMessages(client) {
  // Lista de contatos com nome e número formatado
  const contacts = [
    { name: "Júnior Rodrigues", number: "554892012525@c.us" },
    { name: "Thalis Antunes", number: "5555999293516@c.us" },
    { name: "Camilla Gabriele", number: "555581181141@c.us" },
  ];

  // Configuração do agendamento para 16:00 (4:00 PM)
  const tarefaAgendada = cron.schedule(
    "0 16 * * *",
    () => {
      const dataAtual = new Date().toLocaleString();
      console.log(
        `[${dataAtual}] Enviando mensagens diárias personalizadas...`
      );

      // Envia a mensagem para cada contato com personalização
      contacts.forEach((contact) => {
        const personalizedMessage =
          `Olá, ${contact.name}! 👋 Aqui é o *Ted* da *Cardial I.T*.\n\n` +
          `Só passando para lembrar que estamos à disposição para ajudar no que precisar!\n\n` +
          `Se tiver qualquer dúvida ou projeto em mente, é só chamar. 😊\n\n` +
          `Tenha um ótimo dia!\n\n` +
          `*Cardial I.T* - Soluções em Software para o *Brasil*`;

        client
          .sendText(contact.number, personalizedMessage)
          .then(() =>
            console.log(
              `Mensagem enviada para ${contact.name} (${contact.number})`
            )
          )
          .catch((err) =>
            console.error(`Erro ao enviar para ${contact.name}:`, err)
          );
      });
    },
    {
      scheduled: true,
      timezone: "America/Sao_Paulo",
    }
  );

  console.log(
    "Bot agendado para enviar mensagens personalizadas todos os dias às 16:00"
  );

  // Manter o processo rodando
  process.on("SIGINT", () => {
    tarefaAgendada.stop();
    process.exit();
  });

  process.on("SIGTERM", () => {
    tarefaAgendada.stop();
    process.exit();
  });
}
