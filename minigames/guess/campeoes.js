const RIOT_API_VERSION = '14.24.1';

async function fetchChampions(language = 'pt_BR') {

    const response = await fetch(
      `https://ddragon.leagueoflegends.com/cdn/${RIOT_API_VERSION}/data/${language}/champion.json`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return Object.values(data.data).map(champion => ({
      id: champion.id,
      name: champion.name,
      title: champion.title,
      blurb: champion.blurb
    }));
}
