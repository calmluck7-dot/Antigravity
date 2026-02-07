
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const SHEET_PATH = path.join(process.cwd(), 'src/ChatGPTvsGemini/assets/tama/tama_sheet.png');
const OUTPUT_DIR = path.join(process.cwd(), 'src/ChatGPTvsGemini/assets/tama');

async function splitImage() {
    try {
        const image = sharp(SHEET_PATH);
        const metadata = await image.metadata();

        console.log(`Sheet dimensions: ${metadata.width}x${metadata.height}`);

        // Assuming 4 columns x 3 rows grid based on "12 patterns" and typical aspect ratio
        // Adjust if necessary
        const cols = 4;
        const rows = 3;
        const width = Math.floor(metadata.width / cols);
        const height = Math.floor(metadata.height / rows);

        console.log(`Extracting ${cols}x${rows} tiles of size ${width}x${height}`);

        let count = 1;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const id = count.toString().padStart(2, '0');
                const outputFile = path.join(OUTPUT_DIR, `tama_${id}.png`);

                await image
                    .clone()
                    .extract({ left: c * width, top: r * height, width: width, height: height })
                    .toFile(outputFile);

                console.log(`Saved ${outputFile}`);
                count++;
            }
        }
        console.log("✅ Splitting complete!");

    } catch (err) {
        console.error("❌ Error splitting image:", err);
    }
}

splitImage();
