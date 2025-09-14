const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const wordleLogic = require('./minigames/wordle/wordle.js')
const guessLogic = require('./minigames/guess/guess.js')
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

let result = 0;
client.on('messageCreate', async message => {
  if (message.author.bot) return;

  if (message.content.toLowerCase().startsWith('!w')) {
    result = await wordleLogic(message);
    if(result != 0){
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
  if(result == 1){
    message.reply(lose());
  }
  else if(result == 2){
    message.reply(win());
  }
}
function win(){
  const goodgifs = require('./gifs/goodgifs.js');
  return goodgifs[Math.floor(Math.random() * goodgifs.length)];
}
function lose(){
  const badgifs = require('./gifs/badgifs.js');
  return badgifs[Math.floor(Math.random() * badgifs.length)];
}