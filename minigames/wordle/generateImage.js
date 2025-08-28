const Jimp = require("jimp");

async function generateImageWithLetter(letter, color, outputPath) {
    let imagePath;
    switch (color) {
        case "green":
            imagePath = "/home/ubuntu/green_square.png";
            break;
        case "yellow":
            imagePath = "/home/ubuntu/yellow_square.png";
            break;
        case "red":
            imagePath = "/home/ubuntu/red_square.png";
            break;
        default:
            throw new Error("Cor inválida. Use green, yellow ou red.");
    }

    try {
        const image = await Jimp.read(imagePath);
        const font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK); 

        image.print(font, 0, 0, { text: letter.toUpperCase(), alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE }, image.bitmap.width, image.bitmap.height);

        await image.writeAsync(outputPath);
        console.log(`Imagem gerada com sucesso: ${outputPath}`);
    } catch (error) {
        console.error(`Erro ao gerar imagem: ${error.message}`);
    }
}

module.exports = generateImageWithLetter;

