const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const TOKEN = process.env.DISCORD_TOKEN;


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Quando o bot ficar online
client.once("ready", () => {
  console.log(`✅ Bot logado como ${client.user.tag}`);
});

// Responder mensagens
client.on("messageCreate", message => {
  if (message.content === "!ping") {
    message.reply("🏓 Pong!");
  }
});

client.login(TOKEN);