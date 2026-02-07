import { AbsoluteFill, Sequence, Img, useCurrentFrame, Audio, staticFile, useVideoConfig } from "remotion";
import { DialogueBox } from "../Components/DialogueBox";
import { TAMA_IMAGES } from "../assets/tama";
import { scriptData, COLORS } from "../data/scriptData";
import audioDurationsResponse from "../data/audioDurations.json";

// Cast the JSON to a Record<string, number> to satisfy TS if needed, or just use it.
const audioDurations = audioDurationsResponse as Record<string, number>;

export const Intro: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Filter Intro lines
    const introLines = scriptData.filter(line => line.id.startsWith("intro_"));

    // Calculate start frames and durations dynamically
    let currentStartFrame = 0;
    const sequences = introLines.map(line => {
        const durationSec = audioDurations[line.id] || 3; // Default to 3s if missing
        const durationFrames = Math.ceil(durationSec * fps) + 15; // +15 frames buffer
        const start = currentStartFrame;
        currentStartFrame += durationFrames;

        return {
            ...line,
            startFrame: start,
            durationFrames: durationFrames
        };
    });

    return (
        <AbsoluteFill style={{ backgroundColor: "white" }}>
            {/* Background & Characters */}
            <div style={{ display: "flex", flexDirection: "row", height: "100%" }}>
                <div style={{ flex: 1, backgroundColor: "#e0f7fa", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    {/* ChatGPT Placeholder */}
                    <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 150 }}>🤖</div>
                        <h2>ChatGPT (Chapi-nee)</h2>
                    </div>
                </div>
                <div style={{ flex: 1, backgroundColor: "#f3e5f5", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    {/* Gemini Placeholder */}
                    <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 150 }}>✨</div>
                        <h2>Gemini (Geme-ni-tama)</h2>
                    </div>
                </div>
            </div>

            {/* Dialogue Sequence w/ Audio and Character */}
            {sequences.map((line) => (
                <Sequence key={line.id} from={line.startFrame} durationInFrames={line.durationFrames}>
                    {/* Tama-chan Dynamic Expression */}
                    <Img
                        src={TAMA_IMAGES[line.expression || "normal"]}
                        style={{
                            position: "absolute",
                            bottom: 250,
                            right: 50,
                            width: 150,
                            height: 150,
                            // Note: useCurrentFrame relative to Sequence returns 0 to duration, 
                            // but if we want continuous animation we might need absolute frame? 
                            // Sequence children get relative frame `frame`.
                            // To keep continuous bobbing, we need absolute frame or just accept it resets?
                            // `frame` inside Sequence is relative. 
                            // For bobbing `Math.sin(frame / 5)` to match across cuts, we need absolute time or accept phase shift.
                            // However, reset might be cute (bounce on new line). Let's keep relative `frame`.
                            transform: `translateY(${Math.sin(frame / 5) * 10}px)`
                        }}
                    />
                    <DialogueBox speaker={line.speaker} color={COLORS[getSpeakerKey(line.speaker)]} text={line.text} />
                    <Audio src={staticFile(`audio/${line.id}.mp3`)} />
                </Sequence>
            ))}
        </AbsoluteFill>
    );
};

// Helper to map speaker name to COLOR key
function getSpeakerKey(speakerName: string): keyof typeof COLORS {
    if (speakerName.includes("チャピ")) return "CHAPI";
    if (speakerName.includes("ジェメ")) return "GEMINI";
    return "TAMA";
}

