const WORDBANK = require('./palavras');
const generateImageWithLetter = require('./generateImage');
const fs = require('fs');
const path = require('path');
const palavras = require('./palavras');
const gameState = require('../../enums/gameState');

var word = randomWord(WORDBANK);
const MAX_TRIES = 5;
const history = {};

function randomWord() {
  const index = Math.floor(Math.random() * WORDBANK.length);
  return WORDBANK[index];
}

function checkWord(tentativa) {
  tentativa = tentativa.toLowerCase();
  let result = [];

  for (let i = 0; i < word.length; i++) {
    if (tentativa[i] === word[i]) {
      result.push({ letter: tentativa[i], color: 'green' }); // letra correta e na posição certa
    } else if (word.includes(tentativa[i])) {
      result.push({ letter: tentativa[i], color: 'yellow' }); // letra correta mas na posição errada
    } else {
      result.push({ letter: tentativa[i], color: 'red' }); // letra errada
    }
  }

  return result;
}

function emptyLine() {
  let line = [];
  for (let i = 0; i < word.length; i++) {
    line.push({ letter: '', color: 'white' }); // quadrado branco (vazio)
  }
  return line;
}

async function generateGameImage(channelHistory, channelId) {
  const Canvas = require('canvas');
  const canvas = Canvas.createCanvas(word.length * 100, MAX_TRIES * 100);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let gameData = [];
  for (let i = 0; i < MAX_TRIES; i++) {
    if (i < channelHistory.length) {
      gameData.push(channelHistory[i]);
    } else {
      gameData.push(emptyLine());
    }
  }

  for (let row = 0; row < gameData.length; row++) {
    for (let col = 0; col < gameData[row].length; col++) {
      const x = col * 100;
      const y = row * 100;
      const { letter, color } = gameData[row][col];

      // Definir cor do quadrado
      let squareColor;
      switch (color) {
        case 'green':
          squareColor = '#6aaa64';
          break;
        case 'yellow':
          squareColor = '#c9b458';
          break;
        case 'red':
          squareColor = '#787c7e';
          break;
        default:
          squareColor = '#d3d6da';
      }

      ctx.fillStyle = squareColor;
      ctx.fillRect(x + 5, y + 5, 90, 90);

      ctx.strokeStyle = '#878a8c';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 5, y + 5, 90, 90);

      if (letter) {
        ctx.fillStyle = color === 'white' ? '#000000' : '#ffffff';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(letter.toUpperCase(), x + 50, y + 50);
      }
    }
  }

  const outputPath = path.join(__dirname, `wordle_${channelId}_${Date.now()}.png`);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  
  return outputPath;
}

async function formatMessage(channelHistory, channelId) {
  try {
    const imagePath = await generateGameImage(channelHistory, channelId);
    return imagePath;
  } catch (error) {
    console.error('Erro ao gerar imagem do jogo:', error);
    // Fallback para o formato antigo
    let mensagem = "";
    for (let i = 0; i < MAX_TRIES; i++) {
      if (i < channelHistory.length) {
        let line = "";
        for (let j = 0; j < channelHistory[i].length; j++) {
          const { color } = channelHistory[i][j];
          switch (color) {
            case 'green':
              line += "🟩";
              break;
            case 'yellow':
              line += "🟨";
              break;
            case 'red':
              line += "🟥";
              break;
            default:
              line += "⬜";
          }
        }
        mensagem += line + "\n";
      } else {
        let line = "";
        for (let k = 0; k < word.length; k++) {
          line += "⬜";
        }
        mensagem += line + "\n";
      }
    }
    return mensagem.trim();
  }
}

function resetGame(channelId) {
  history[channelId] = [];
  word = randomWord(WORDBANK);
}

async function wordleLogic(message) {
    const channelId = message.channelId;

	if(message.content == '!ws')  {
    message.reply(`🤠 Bora de next... a palavra era **${word}**`);
    resetGame(channelId);
    return gameState.Continue;
	}

  const args = message.content.split(' ');
  const tentativa = args[1];

  if (!tentativa || tentativa.length !== word.length) {
    message.reply(`⚠️ Digite uma palavra de **${word.length}** letras!`);
    return gameState.Continue;
  }

  if(!WORDBANK.includes(tentativa)){
    message.reply(`⚠️ Não é um personagem paizão`);
    return gameState.Continue;
  }

  if (!history[channelId]) {
    history[channelId] = [];
  }

  const guessResult = checkWord(tentativa);
  history[channelId].push(guessResult);
  
  const gameImage = await formatMessage(history[channelId], channelId);
    
  if (typeof gameImage === 'string' && gameImage.endsWith('.png')) {
    const { AttachmentBuilder } = require('discord.js');
    const attachment = new AttachmentBuilder(gameImage);
    await message.reply({ files: [attachment] });
    
    setTimeout(() => {
      if (fs.existsSync(gameImage)) {
        fs.unlinkSync(gameImage);
      }
    }, 5000);
  } else {
    message.reply("gameImage");
  }
  
  if (tentativa.toLowerCase() === word) {
    message.reply(`✅ Parabéns! Você acertou a palavra: **${word}**`);
    resetGame(channelId);
    return gameState.Won;
  }
  
  if (history[channelId].length === MAX_TRIES) {
    message.reply(`❌ Você perdeu! A palavra era: **${word}**.`);
    resetGame(channelId);
    return gameState.Lost;
  }

  return gameState.Continue;
}
module.exports = wordleLogic;
