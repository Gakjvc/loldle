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

client.on('messageCreate', message => {
  let result = null;
  if (message.author.bot) return;
  if (message.content.toLowerCase().startsWith('!w ')) {
    result = wordleLogic(message);
    winOrLose(result, message)
    return;
  }
  if(message.content.toLowerCase().startsWith('!g')){
    result = guessLogic(message);
    return;
  }
  
})
function winOrLose(result, message) {
  if(result == null){
    return;
  }
  else if(result){
    message.reply(win());
  }
  else if(result === false){
    message.reply(lose());
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