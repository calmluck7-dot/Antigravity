import { AbsoluteFill, Sequence, Img, Audio, staticFile, useVideoConfig, useCurrentFrame } from "remotion";
import { DialogueBox } from "../Components/DialogueBox";
import { TAMA_IMAGES } from "../assets/tama";
import { scriptData, COLORS } from "../data/scriptData";
import audioDurationsResponse from "../data/audioDurations.json";

const audioDurations = audioDurationsResponse as Record<string, number>;

export const Ending: React.FC = () => {
    const { fps } = useVideoConfig();
    const frame = useCurrentFrame();

    const getLine = (id: string) => scriptData.find(l => l.id === id)!;
    const getDuration = (id: string) => Math.ceil((audioDurations[id] || 3) * fps) + 15;
    const getSpeakerKey = (speaker: string): keyof typeof COLORS => {
        if (speaker.includes("チャピ")) return "CHAPI";
        if (speaker.includes("ジェメ")) return "GEMINI";
        return "TAMA";
    };

    // Phase 1: Pre-Announcement
    const p1_lines = ["ending_01", "ending_02", "ending_03"].map(id => ({ ...getLine(id), dur: getDuration(id) }));
    const p1_duration = p1_lines.reduce((sum, line) => sum + line.dur, 0);

    // Phase 2: Winner Announcement
    const p2_lines = ["ending_04"].map(id => ({ ...getLine(id), dur: getDuration(id) }));
    // Ensure the winner screen is visible long enough. ending_04 is short (2s). Let's pad it or minimum it.
    // ending_04 audio is about 2.9s ~ 87 frames + 15 = 102 frames.
    // The visual "WINNER" should probably stay a bit longer. Let's add 60 frames (2s) pause after audio.
    const p2_duration = p2_lines[0].dur + 60;

    // Phase 3: Post-Announcement
    const p3_lines = ["ending_05", "ending_06", "ending_07", "ending_08", "ending_09", "ending_10", "ending_11"].map(id => ({ ...getLine(id), dur: getDuration(id) }));
    // p3_duration unused but implicit in sequence

    let p1_accum = 0;
    // p2 is single line
    let p3_accum = 0;

    return (
        <AbsoluteFill style={{ backgroundColor: "white", justifyContent: "center", alignItems: "center" }}>
            {/* Results Announcement */}
            <Sequence from={0} durationInFrames={p1_duration}>
                <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
                    <h1>Results Announcement</h1>
                </AbsoluteFill>
                {p1_lines.map(line => {
                    const start = p1_accum;
                    p1_accum += line.dur;
                    return (
                        <Sequence key={line.id} from={start} durationInFrames={line.dur}>
                            <Img
                                src={TAMA_IMAGES[line.expression || "normal"]}
                                style={{
                                    position: "absolute",
                                    bottom: 250,
                                    right: 50,
                                    width: 150,
                                    height: 150,
                                    transform: `translateY(${Math.sin(frame / 5) * 10}px)`
                                }}
                            />
                            <DialogueBox speaker={line.speaker} color={COLORS[getSpeakerKey(line.speaker)]} text={line.text} />
                            <Audio src={staticFile(`audio/${line.id}.mp3`)} />
                        </Sequence>
                    );
                })}
            </Sequence>

            {/* Winner Screen */}
            <Sequence from={p1_duration} durationInFrames={p2_duration}>
                <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#FFD700" }}>
                    <h1>WINNER: Gemini!</h1>
                    <div style={{ fontSize: 100 }}>✨</div>
                </AbsoluteFill>
                <Sequence from={0} durationInFrames={p2_lines[0].dur}>
                    <Img
                        src={TAMA_IMAGES[p2_lines[0].expression || "normal"]}
                        style={{
                            position: "absolute",
                            bottom: 250,
                            right: 50,
                            width: 150,
                            height: 150,
                            transform: `translateY(${Math.sin(frame / 5) * 10}px)`
                        }}
                    />
                    <DialogueBox speaker={p2_lines[0].speaker} color={COLORS[getSpeakerKey(p2_lines[0].speaker)]} text={p2_lines[0].text} />
                    <Audio src={staticFile(`audio/${p2_lines[0].id}.mp3`)} />
                </Sequence>
            </Sequence>

            {/* Aftermath */}
            <Sequence from={p1_duration + p2_duration}> {/* Run until end of component */}
                {p3_lines.map(line => {
                    const start = p3_accum;
                    p3_accum += line.dur;
                    return (
                        <Sequence key={line.id} from={start} durationInFrames={line.dur}>
                            <Img
                                src={TAMA_IMAGES[line.expression || "normal"]}
                                style={{
                                    position: "absolute",
                                    bottom: 250,
                                    right: 50,
                                    width: 150,
                                    height: 150,
                                    transform: `translateY(${Math.sin(frame / 5) * 10}px)`
                                }}
                            />
                            <DialogueBox speaker={line.speaker} color={COLORS[getSpeakerKey(line.speaker)]} text={line.text} />
                            <Audio src={staticFile(`audio/${line.id}.mp3`)} />
                        </Sequence>
                    );
                })}
            </Sequence>
        </AbsoluteFill>
    );
};

