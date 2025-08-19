const RIOT_API_VERSION = '14.24.1';
const { iniciarJogo, checarCampeao } = require('./guess.js');
async function fetchChampions(language = 'pt_BR') {
  try {
    const response = await fetch(
      `https://ddragon.leagueoflegends.com/cdn/${RIOT_API_VERSION}/data/${language}/champion.json`
    );
    if (response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const champions = Object.values(data.data);
    const championsWithCategories = champions.map(champion => {
      return {
        ...champion,
        genero: getGeneroAleatorio(),
        posicoes: getPosicoesAleatorias(),
        especie: getEspecieAleatoria(),
        recurso: getRecursoAleatorio(),
        alcance: getAlcanceAleatorio(),
        regioes: getRegioesAleatorias(),
        anoLancamento: getAnoLancamentoAleatorio(),
      };
  });

  return championsWithCategories;
}  catch (error) {
  console.error('Error fetching champions:', error);
  throw error;
  }
}

function getGeneroAleatorio() {
const generos = ['Masculino', 'Feminino', 'Outro'];
return generos[Math.floor(Math.random() * generos.length)];
}

function getPosicoesAleatorias() {
  const posicoes = ['top', 'jungle', 'mid', 'adc', 'support'];
  const count = Math.floor(Math.random() * 2) + 1;
  return posicoes.sort(() => 0.5 - Math.random()).slice(0, count);
}

function getEspecieAleatoria(){
  const especies = ['Humano', 'Yordle', 'Vastaya', 'Espírito', 'Morto-Vivo', 'Deus', 'Robô'];
  return especies[Math.floor(Math.random() * especies.length)];
}

function getRecursoAleatorio() {
  const recursos = ['Mana', 'Energia', 'Fúria', 'Ferocidade', 'Calor', 'Nenhum'];
  return recursos[Math.floor(Math.random() * recursos.length)];
}

function getAlcanceAleatorio() {
  const alcance = ['Corpo a corpo', 'Longo alcance'];
  const count = Math.floor(Math.random() * 2) + 1;
  return alcance.sort(() => 0.5 - Math.random()).slice(0, count);
}
  
  function getRegioesAleatorias() {
  const regioes = ['Demacia', 'Noxus', 'Ionia', 'Freljord', 'Piltover', 'Zaun', 'Ilhas das Sombras', 'Bandópolis', 'Ixtal', 'Vazio', 'Shurima', 'Targon', 'Runeterra' ];
  const count = Math.floor(Math.random() * 3) + 1;
  return regioes.sort(() => 0.5 - Math.random()).slice(0, count);
}

function getAnoLancamentoAleatorio() {
  return 2009 + Math.floor(Math.random() * 17);  
}

let campeoes = [];
let campeaoAleatorio = null;
let historico = {};

async function iniciarJogo(channelId) {
  try {
    campeoes = await fetchChampions();
    campeaoAleatorio = sortearCampeao();
    console.log('Jogo iniciado! Tente adivinhar o campeão.');
    historico[channelId] = [];
    return true;
  } catch (error) {
    console.error('Erro ao iniciar o jogo:', error);
    return false;
  }
} 
  function sortearCampeao() {
    const indice = Math.floor(Math.random() * campeoes.length);
    return campeoes[indice];
  }

  function checarCampeao(tentativa, categoria) {
    tentativa = tentativa.toLowerCase();
    let resultado = "";
    
    switch (categoria){
      case 'nome':
      if (tentativa === campeaoAleatorio.name.toLowerCase()){
        resultado = "🟩"; // Campeão correto
      } else if (campeaoAleatorio.name.toLowerCase().includes(tentativa)) {
        resultado = "🟨"; // Nome correto, mas incompleto
      } else {
        resultado = "🟥"; // Nome incorreto
      } 
      break;

      case 'genero':
        if (tentativa === campeaoAleatorio.genero.toLowerCase()) {
          resultado = "🟩"; // Gênero correto
        } else {
          resultado = "🟥"; // Gênero incorreto
        }
        break;

        case 'posicao':
          const posicoes = campeaoAleatorio.posicoes.map(p => p.toLowerCase());
          if (posicoes.includes(tentativa)) {
            resultado = "🟩"; // Posição correta
          } else {
            resultado = "🟥"; // Posição incorreta
          }
          break;

          case 'recurso':
            if (tentativa === campeaoAleatorio.recurso.toLowerCase()) {
              resultado = "🟩"; // Recurso correto
            } else {
              resultado = "🟥"; // Recurso incorreto
            } 
            break;

          case'regiao':
          const regioes = campeaoAleatorio.regioes.map(r => r.toLowerCase());
          if (regioes.includes(tentativa)) {
            resultado = "🟩"; // Região correta
          } else {
            resultado = "🟥"; // Região incorreta
          } 
          break;

          default:
            resultado = "⚠️ Categoria inválida. Tente novamente.";
            break; 
    }

    if (historico[channelId]) {
      historico[channelId].push({ tentativa, categoria, resultado });
    }
    return resultado;
  }

const guessLogic = {
  iniciarJogo,
  checarCampeao,
  sortearCampeao,
  fetchChampions
};

module.exports = guessLogic;
  