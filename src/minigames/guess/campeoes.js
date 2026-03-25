const fetch = require("node-fetch");

async function getChampions() {
    const url = "https://ddragon.leagueoflegends.com/cdn/14.4.1/data/en_US/champion.json";
    
    const response = await fetch(url);
    const json = await response.json();

    const championsData = json.data;
    const championsMap = new Map();

    for (const champId in championsData) {
        const champ = championsData[champId];

        championsMap.set(champId.toLowerCase(), {
            id: champ.id,
            name: champ.name,
            title: champ.title,
            blurb: champ.blurb,
            tags: champ.tags,
            stats: champ.stats
        });
    }

    return championsMap;
}

module.exports = getChampions;
