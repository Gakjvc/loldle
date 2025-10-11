const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config({ path: '' });
const wordleLogic = require('../src/minigames/wordle/wordle.js')
const guessLogic = require('../src/minigames/guess/guess.js')
const TOKEN = process.env.DISCORD_TOKEN;
const gameState = require('./enums/gameState');

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

let result = gameState.Continue;
client.on('messageCreate', async message => {
  if (message.author.bot) return;

  if (message.content.toLowerCase().startsWith('!w')) {
    result = await wordleLogic(message);
    if(result != gameState.Continue){
      winOrLose(result, message);
    }
    return;
  }

  if(message.content.toLowerCase().startsWith('!g')){
    result = guessLogic(message);
    return;
  }
  
})
function winOrLose(result, message) {
  if(result == gameState.Lost){
    message.reply(lose());
  }
  else if(result == gameState.Won){
    message.reply(win());
  }
}
function win(){
  const goodgifs = require('../resources/gifs/goodgifs.js');
  return goodgifs[Math.floor(Math.random() * goodgifs.length)];
}
function lose(){
  const badgifs = require('../resources/gifs/badgifs.js');
  return badgifs[Math.floor(Math.random() * badgifs.length)];
}