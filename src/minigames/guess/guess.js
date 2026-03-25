const RIOT_API_VERSION = '14.24.1';
const getChampions = require('./guess.js');
const gameState = require('../../enums/gameState');
const historico = {};
const CHAMPIONS = [];
var TARGETCHAMPION;

 function fetchChampions(language = 'pt_BR') {
  
    const response = fetch(
      `https://ddragon.leagueoflegends.com/cdn/${RIOT_API_VERSION}/data/${language}/champion.json`
    );
    const data =  response.json();
    CHAMPIONS = Object.values(data.data);
    const championsWithCategories = champions.map(champion => {}    
    );

  return championsWithCategories;
}

  function randomChampion() {
    const index = Math.floor(Math.random() * CHAMPIONS.length);
    return CHAMPIONS[index];
  }
  
  function checkGuess(tentativa, channelId) {
  tentativa = tentativa.toLowerCase();
  let resultado = "";

  // encontra o campeão que o jogador digitou
  const championTentativa = CHAMPIONS.find(
    champion => champion.name.toLowerCase() === tentativa
  );

  if (!championTentativa) {
    return "❌ Campeão não encontrado!";
  }

  // verifica se acertou o campeão diretamente
  if (tentativa === TARGETCHAMPION.name.toLowerCase()) {
    resultado = `🎉 Parabéns! Você acertou o campeão: ${TARGETCHAMPION.name}`;
    return resultado;
  }

  // helper para formatar com quadrado
  const formatar = (atributoTentado, atributoCorreto, isArray = false) => {
    let correto;
    if (isArray) {
      correto = atributoTentado.some(a => atributoCorreto.includes(a));
    } else {
      correto = atributoTentado === atributoCorreto;
    }
    return `${correto ? "🟩" : "🟥"} ${atributoTentado}`;
  };

  const comparacoes = [];

  // nome
  comparacoes.push(formatar(championTentativa.name, TARGETCHAMPION.name));

  // gênero
  comparacoes.push(formatar(championTentativa.genero, TARGETCHAMPION.genero));

  // espécie
  comparacoes.push(formatar(championTentativa.especie, TARGETCHAMPION.especie));

  // posição
  comparacoes.push(formatar(championTentativa.posicoes, TARGETCHAMPION.posicoes, true));

  // recurso
  comparacoes.push(formatar(championTentativa.recurso, TARGETCHAMPION.recurso));

  // alcance
  comparacoes.push(formatar(championTentativa.alcance, TARGETCHAMPION.alcance));

  // região
  comparacoes.push(formatar(championTentativa.regioes, TARGETCHAMPION.regioes, true));

  // ano
  comparacoes.push(formatar(championTentativa.anoLancamento, TARGETCHAMPION.anoLancamento));

  // junta tudo numa linha só
  resultado = comparacoes.join(" | ");

  // salva no histórico por canal
  if (!historico[channelId]) historico[channelId] = [];
  historico[channelId].push({ tentativa, resultado });

  return resultado;
}
  
const champions = await getChampions();
  module.exports = guessLogic;
  function guessLogic(message){
    channelId = message.channelId;
    historico[channelId] = []
    const args = message.content.split(' ');
    const tentativa = args[1];
    const char = champions.get(tentativa);
    message.reply(char.stats.hp)
    
    return gameState.Continue;
    
   
  };
