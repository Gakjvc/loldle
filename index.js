const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const wordleLogic = require('./minigames/wordle/wordle.js')
const TOKEN = process.env.DISCORD_TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});
client.login(TOKEN);

client.once('ready', () => {
    console.log(`🤖 Bot logado como ${client.user.tag}`);
});
client.on('messageCreate', message => {
  if (message.content.toLowerCase().startsWith('!wordle ')) {
    const channelId = message.channelId;
    wordleLogic(message,channelId);
    return;
  }
})
