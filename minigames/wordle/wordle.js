const BANCODEPALAVRAS = require('./palavras');
var palavra = palavraAleatoria(BANCODEPALAVRAS);
const MAX_TENTATIVAS = 5;
const historico = {};

function palavraAleatoria() {
  const indice = Math.floor(Math.random() * BANCODEPALAVRAS.length);
  return BANCODEPALAVRAS[indice];
}
function checarPalavra(tentativa) {
  tentativa = tentativa.toLowerCase();
  let resultado = "";

  for (let i = 0; i < palavra.length; i++) {
    if (tentativa[i] === palavra[i]) {
      resultado += "🟩"; // letra correta e na posição certa
    } else if (palavra.includes(tentativa[i])) {
      resultado += "🟨"; // letra correta mas na posição errada
    } else {
      resultado += "🟥"; // letra errada
    }
  }

  return resultado;
}

function linhaVazia() {
  return "⬜⬜⬜⬜⬜";
}

function formataMensagem(historicoDoUser) {
   let mensagem = "";
    for (let i = 0; i < MAX_TENTATIVAS; i++) {
      if (i < historicoDoUser.length) {
        mensagem += historicoDoUser[i] + "\n";
      } else {
        mensagem += linhaVazia() + "\n";
      };
    }
    return mensagem.trim();
}
function resetPalavra() {
  palavra = palavraAleatoria(BANCODEPALAVRAS);
}
module.exports = wordleLogic
function wordleLogic(message, channelId){
    if (message.content.toLowerCase() === '!w !r') {
      historico[channelId] = [];
      resetPalavra(message);
      return;    
    }
    if (message.author.bot) return;

    if (message.content.toLowerCase().startsWith('!w !t ')) {
    const args = message.content.split(' ');
    const tentativa = args[2];

    if (!tentativa || tentativa.length !== 5) {
      message.reply("⚠️ Digite uma palavra de 5 letras, ex: `!w !t piada`");
      return;
    }


    if (!historico[channelId]) {
      historico[channelId] = [];
    }

    if (historico[channelId].length >= MAX_TENTATIVAS) {
      message.reply("❌ Você já usou suas 5 tentativas! Reinicie o jogo digitando `!w !r`.");
      return;
    }
    
    const resultado = checarPalavra(tentativa);
    historico[channelId].push(resultado);
    
    message.reply(formataMensagem(historico[channelId]));
    if (resultado === "🟩🟩🟩🟩🟩") {
      message.reply(`✅ Parabéns! Você acertou a palavra: **${palavra}**`);
      message.reply(`https://tenor.com/view/morel-hunter-x-hunter-morel-mackernasey-hxh-thumbs-up-gif-21440886`);
      historico[channelId] = [];
      resetPalavra(historico[channelId], message);
      return;
    }
    if (historico[channelId].length === 5) {
      message.reply(`❌ Você perdeu! A palavra era: **${palavra}**. Reinicie o jogo digitando \`!wordle !reset\`.`);
      message.reply(`https://tenor.com/view/reigen-reigen-arataka-con-artist-filthy-monkey-that-cant-even-use-jujitsu-gif-17346470480681697752`);
      historico[channelId] = [];
      resetPalavra(historico[channelId], message);
      return;
    }
  }
};