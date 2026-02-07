
import fs from 'fs';
import path from 'path';
import { parseFile } from 'music-metadata';

const SCRIPT_DATA_PATH = path.join(process.cwd(), 'src/ChatGPTvsGemini/data/scriptData.ts');
const AUDIO_DIR = path.join(process.cwd(), 'public/audio');
const OUTPUT_FILE = path.join(process.cwd(), 'src/ChatGPTvsGemini/data/audioDurations.json');

// Regex to extract IDs from the TS file
function parseScriptIds(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const matches = content.matchAll(/id:\s*"([^"]+)"/g);
    const ids = [];
    for (const match of matches) {
        ids.push(match[1]);
    }
    return ids;
}

async function main() {
    console.log("Reading script data...");
    const ids = parseScriptIds(SCRIPT_DATA_PATH);
    console.log(`Found ${ids.length} dialogue lines.`);

    const durations = {};

    for (const id of ids) {
        const audioPath = path.join(AUDIO_DIR, `${id}.mp3`);
        if (fs.existsSync(audioPath)) {
            try {
                const metadata = await parseFile(audioPath);
                if (metadata.format.duration) {
                    durations[id] = metadata.format.duration;
                    console.log(`✅ ${id}: ${metadata.format.duration.toFixed(2)}s`);
                } else {
                    console.warn(`⚠️ Could not determine duration for ${id}`);
                }
            } catch (err) {
                console.error(`❌ Error reading ${id}:`, err.message);
            }
        } else {
            console.warn(`⚠️ Audio file not found for ${id}`);
        }
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(durations, null, 2));
    console.log(`\n🎉 durations saved to ${OUTPUT_FILE}`);
}

main();
