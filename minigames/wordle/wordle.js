const WORDBANK = require('./palavras');
var word = randomWord(WORDBANK);
const MAX_TRIES = 5;
const history = {};

function randomWord() {
  const index = Math.floor(Math.random() * WORDBANK.length);
  return WORDBANK[index];
}
function checkWord(tentativa) {
  tentativa = tentativa.toLowerCase();
  let result = "";

  for (let i = 0; i < word.length; i++) {
    if (tentativa[i] === word[i]) {
      result += "🟩"; // letra correta e na posição certa
    } else if (word.includes(tentativa[i])) {
      result += "🟨"; // letra correta mas na posição errada
    } else {
      result += "🟥"; // letra errada
    }
  }

  return result;
}

function emptyLine() {
  return "⬜⬜⬜⬜⬜";
}

function formatMessage(channelHistory) {
   let mensagem = "";
    for (let i = 0; i < MAX_TRIES; i++) {
      if (i < channelHistory.length) {
        mensagem += channelHistory[i] + "\n";
      } else {
        mensagem += emptyLine() + "\n";
      };
    }
    return mensagem.trim();
}
function resetWord() {
  word = randomWord(WORDBANK);
}
module.exports = wordleLogic
function wordleLogic(message){
    const channelId = message.channelId;
    const args = message.content.split(' ');
    const tentativa = args[1];

    if (!tentativa || tentativa.length !== 5) {
      message.reply("⚠️ Digite uma word de 5 letras, ex: `!w garen`");
      return null;
    }


    if (!history[channelId]) {
      history[channelId] = [];
    }

    
    const result = checkWord(tentativa);
    history[channelId].push(result);
    
    message.reply(formatMessage(history[channelId]));
    if (result.includes ("🟩🟩🟩🟩🟩")) {
      message.reply(`✅ Parabéns! Você acertou a word: **${word}**`);
      history[channelId] = [];
      resetWord(history[channelId], message);
      return true;
    }
    if (history[channelId].length === 5) {
      message.reply(`❌ Você perdeu! A word era: **${word}**.`);
      history[channelId] = [];
      resetWord(history[channelId], message);
      return false;
    }
  
};