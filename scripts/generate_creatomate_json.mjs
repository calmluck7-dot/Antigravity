import fs from 'fs';
import path from 'path';

// Config
const SCRIPT_PATH = path.resolve('./script.md');
const OUTPUT_PATH = path.resolve('./creatomate_source.json');
const CHAR_SPEED = 0.15; // Seconds per character for reading speed
const MIN_DURATION = 2.0; // Minimum duration for a dialogue line

// Placeholders for assets (User will replace these in Creatomate)
// Using a reliable Creatomate asset to prevent "Failed to load" errors during import
const PLACEHOLDER_URL = 'https://creatomate.com/files/assets/3271ae22-5d95-4654-a690-3330cb1277bb';

const ASSETS = {
    bg: PLACEHOLDER_URL, // Generic tech bg
    sama: PLACEHOLDER_URL,
    chapi: PLACEHOLDER_URL,
    gemini: PLACEHOLDER_URL
};

const main = () => {
    const markdown = fs.readFileSync(SCRIPT_PATH, 'utf-8');
    const lines = markdown.split('\n');

    const elements = [
        // Background
        {
            "type": "image",
            "track": 1,
            "time": 0,
            "duration": 600, // Placeholder long duration, will be trimmed by editor
            "fill": true,
            "source": ASSETS.bg,
        },
        // Character: Tama-chan (Bottom Right)
        {
            "type": "image",
            "track": 2,
            "time": 0,
            "duration": 600,
            "x": "80%",
            "y": "80%",
            "width": "25%",
            "height": "25%", // Changed from auto to fixed to satisfy validation
            "source": ASSETS.sama,
            "name": "Tama-chan"
        },
        // Character: Chapi-nee (Left)
        {
            "type": "image",
            "track": 3,
            "time": 0,
            "duration": 600,
            "x": "20%",
            "y": "50%",
            "width": "30%",
            "height": "25%", // Changed from auto to fixed to satisfy validation
            "source": ASSETS.chapi,
            "name": "Chapi-nee"
        },
        // Character: Gemini (Right)
        {
            "type": "image",
            "track": 4,
            "time": 0,
            "duration": 600,
            "x": "80%",
            "y": "50%",
            "width": "30%",
            "height": "25%", // Changed from auto to fixed to satisfy validation
            "source": ASSETS.gemini,
            "name": "Gemini"
        }
    ];

    let currentTime = 0;
    let trackIndex = 5; // Start dialogue on track 5

    lines.forEach(line => {
        // Regex to capture **Role** "Dialogue" or **Role** (Action) "Dialogue"
        // Handling: **Name** "Text"
        const dialogueMatch = line.match(/^\*\*(.+?)\*\*\s*(?:（.+?）\s*)?「(.+)」/);

        if (dialogueMatch) {
            const role = dialogueMatch[1];
            const text = dialogueMatch[2];

            // Calculate duration
            let duration = Math.max(text.length * CHAR_SPEED, MIN_DURATION);

            // Create text element
            const textElement = {
                "type": "text",
                "track": trackIndex,
                "time": currentTime,
                "duration": duration,
                "text": text,
                "fill_color": "#ffffff",
                "stroke_color": "#000000",
                "stroke_width": 2,
                "background_color": "rgba(0,0,0,0.6)",
                "background_border_radius": 10,
                "font_family": "Noto Sans JP",
                "font_weight": "700",
                "font_size": "6vmin", // Adjusted to reasonable size
                "width": "80%",
                "height": "15%", // Text box height
                "x": "50%",
                "y": "90%", // Subtitle position
                "padding": "20px",
                "y_alignment": "100%",
                "name": `${role}: ${text.substring(0, 10)}...`
            };

            elements.push(textElement);

            // Advance time and track
            currentTime += duration;
            // We keep trackIndex same if we want them on same layer linearly, 
            // but Creatomate handles collision on same track by overwriting? 
            // Actually, standard is to put sequential clips on same track or waterfall them.
            // Let's keep them on the same track 5 for subtitles to avoid 200 tracks.
        }
    });

    // Construct final JSON
    const creatomateData = {
        "format": "mp4",
        "width": 1920,
        "height": 1080,
        "frame_rate": 30,
        "duration": currentTime + 2, // Add a buffer at end
        "elements": elements
    };

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(creatomateData, null, 2));
    console.log(`✅ Generated Creatomate JSON at ${OUTPUT_PATH}`);
    console.log(`   Total Duration: ${currentTime.toFixed(1)} seconds`);
};

main();
