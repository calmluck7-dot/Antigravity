import { Series, useVideoConfig } from "remotion";
import { Opening } from "./Scenes/Opening";
import { Intro } from "./Scenes/Intro";
import { ChatGPTTurn } from "./Scenes/ChatGPTTurn";
import { GeminiTurn } from "./Scenes/GeminiTurn";
import { Ending } from "./Scenes/Ending";
import { scriptData } from "./data/scriptData";
import audioDurationsResponse from "./data/audioDurations.json";

const audioDurations = audioDurationsResponse as Record<string, number>;

export const Main: React.FC = () => {
    const { fps } = useVideoConfig();

    const getDurationFrames = (id: string) => Math.ceil((audioDurations[id] || 3) * fps) + 15;

    const calculateTotalDuration = (prefix: string) => {
        return scriptData
            .filter(line => line.id.startsWith(prefix))
            .reduce((sum, line) => sum + getDurationFrames(line.id), 0);
    };

    const introDuration = calculateTotalDuration("intro_");
    const chatgptDuration = calculateTotalDuration("chatgpt_");
    const geminiDuration = calculateTotalDuration("gemini_");

    // Ending has special +60 frames logic for the P2 Winner screen
    const endingBaseDuration = calculateTotalDuration("ending_");
    const endingDuration = endingBaseDuration + 60;

    return (
        <Series>
            <Series.Sequence durationInFrames={150}>
                <Opening />
            </Series.Sequence>
            <Series.Sequence durationInFrames={introDuration}>
                <Intro />
            </Series.Sequence>
            <Series.Sequence durationInFrames={chatgptDuration}>
                <ChatGPTTurn />
            </Series.Sequence>
            <Series.Sequence durationInFrames={geminiDuration}>
                <GeminiTurn />
            </Series.Sequence>
            <Series.Sequence durationInFrames={endingDuration}>
                <Ending />
            </Series.Sequence>
        </Series>
    );
};
