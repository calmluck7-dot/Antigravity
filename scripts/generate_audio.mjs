import fs from 'fs';
import path from 'path';
import 'dotenv/config';

// NOTE: Before running, ensure you have a .env file with ELEVENLABS_API_KEY=...
// Usage: node scripts/generate_audio.mjs

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) {
    console.error("❌ ERROR: ELEVENLABS_API_KEY not found in environment variables.");
    console.error("Please create a .env file in the root directory and add your key.");
    process.exit(1);
}

// We need to import scriptData. Since it's a TS file, we can't import strictly in Node without compilation or ts-node.
// For simplicity in this script, we'll read the TS file and regex extract (hacky but works for this specific format)
// OR we can copy the array here.
// BETTER: Let's create a JSON version or just copy the array structure here for the script to avoid TS complexity.
// Actually, let's just duplicate the data for the script to ensure it runs easily with node.
// Wait, cleaner way: Use regex to parse the exported array from the file.

const SCRIPT_DATA_PATH = path.join(process.cwd(), 'src/ChatGPTvsGemini/data/scriptData.ts');
const OUTPUT_DIR = path.join(process.cwd(), 'public/audio');

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Minimal regex parser to extract data from the TS file
// This assumes the format used in scriptData.ts (id, text, voiceId)
function parseScriptData(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const matches = content.matchAll(/id:\s*"([^"]+)",[\s\S]*?text:\s*"([^"]+)",[\s\S]*?voiceId:\s*VOICES\.(\w+)/g);

    // Hardcoded mapping matching the VOICES object in TS
    const VOICE_MAP = {
        TAMA: "ThT5KcBeYPX3keUQqHPh", // Dorothy
        CHAPI: "21m00Tcm4TlvDq8ikWAM", // Rachel
        GEMINI: "ErXwobaYiN019PkySvjV", // Antoni
    };

    const lines = [];
    for (const match of matches) {
        lines.push({
            id: match[1],
            text: match[2],
            voiceId: VOICE_MAP[match[3]],
        });
    }
    return lines;
}

async function generateAudio(line) {
    const filePath = path.join(OUTPUT_DIR, `${line.id}.mp3`);
    if (fs.existsSync(filePath)) {
        console.log(`✅ Skipping ${line.id} (already exists)`);
        return;
    }

    console.log(`🎙️ Generating ${line.id}...`);

    try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${line.voiceId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': API_KEY,
            },
            body: JSON.stringify({
                text: line.text,
                model_id: "eleven_multilingual_v2", // Supports Japanese better
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
                }
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`API Error: ${JSON.stringify(error)}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fs.writeFileSync(filePath, buffer);
        console.log(`  ✨ Saved to ${filePath}`);

    } catch (err) {
        console.error(`  ❌ Failed to generate ${line.id}:`, err.message);
    }
}

async function main() {
    console.log("Reading script data...");
    const lines = parseScriptData(SCRIPT_DATA_PATH);
    console.log(`Found ${lines.length} dialogue lines.`);

    for (const line of lines) {
        await generateAudio(line);
    }
    console.log("🎉 Done!");
}

main();
