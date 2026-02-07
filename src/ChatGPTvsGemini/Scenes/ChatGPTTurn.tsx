import { AbsoluteFill, Sequence, Img, Audio, staticFile, useVideoConfig, useCurrentFrame } from "remotion";
import { DialogueBox } from "../Components/DialogueBox";
import { TAMA_IMAGES } from "../assets/tama";
import { scriptData, COLORS } from "../data/scriptData";
import audioDurationsResponse from "../data/audioDurations.json";

const audioDurations = audioDurationsResponse as Record<string, number>;

export const ChatGPTTurn: React.FC = () => {
    const { fps } = useVideoConfig();
    const frame = useCurrentFrame();

    const getLine = (id: string) => scriptData.find(l => l.id === id)!;
    const getDuration = (id: string) => Math.ceil((audioDurations[id] || 3) * fps) + 15;
    const getSpeakerKey = (speaker: string): keyof typeof COLORS => {
        if (speaker.includes("チャピ")) return "CHAPI";
        if (speaker.includes("ジェメ")) return "GEMINI";
        return "TAMA";
    };

    // Phase 1
    const p1_lines = ["chatgpt_01", "chatgpt_02"].map(id => ({ ...getLine(id), dur: getDuration(id) }));
    const p1_duration = p1_lines.reduce((sum, line) => sum + line.dur, 0);

    // Phase 2
    const p2_lines = ["chatgpt_03", "chatgpt_04", "chatgpt_05"].map(id => ({ ...getLine(id), dur: getDuration(id) }));
    const p2_duration = p2_lines.reduce((sum, line) => sum + line.dur, 0);

    // Phase 3
    const p3_lines = ["chatgpt_06", "chatgpt_07", "chatgpt_08", "chatgpt_09"].map(id => ({ ...getLine(id), dur: getDuration(id) }));
    const p3_duration = p3_lines.reduce((sum, line) => sum + line.dur, 0);

    // Phase 4
    const p4_lines = ["chatgpt_10", "chatgpt_11", "chatgpt_12"].map(id => ({ ...getLine(id), dur: getDuration(id) }));
    const p4_duration = p4_lines.reduce((sum, line) => sum + line.dur, 0);

    let p1_accum = 0;
    let p2_accum = 0;
    let p3_accum = 0;
    let p4_accum = 0;

    return (
        <AbsoluteFill style={{ backgroundColor: "#202020", color: "white" }}>
            {/* Phase 1 */}
            <Sequence from={0} durationInFrames={p1_duration}>
                <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
                    <h1>ChatGPT Turn</h1>
                    <div style={{ fontSize: 20, color: "#aaa" }}>Generating Code...</div>
                    <pre style={{ fontSize: 14, textAlign: 'left', backgroundColor: '#333', padding: 20 }}>
                        {`prompt: "HTML/JS Match-3 RPG, Dragon Enemy"`}
                    </pre>
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

            {/* Phase 2 */}
            <Sequence from={p1_duration} durationInFrames={p2_duration}>
                <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#303030" }}>
                    <h1>Ver. 1 (Text Only)</h1>
                    <div style={{ fontSize: 80, fontFamily: "monospace" }}>[ DRAGON ]</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 5, marginTop: 20 }}>
                        {[...Array(25)].map((_, i) => <div key={i} style={{ width: 30, height: 30, backgroundColor: '#555' }}>■</div>)}
                    </div>
                </AbsoluteFill>
                {p2_lines.map(line => {
                    const start = p2_accum;
                    p2_accum += line.dur;
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

            {/* Phase 3 */}
            <Sequence from={p1_duration + p2_duration} durationInFrames={p3_duration}>
                <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#400000" }}>
                    <h1>Ver. 2 (Infinite Combo Bug!)</h1>
                    <div style={{ fontSize: 100, color: "red", fontWeight: "bold" }}>大連鎖！！</div>
                </AbsoluteFill>
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

            {/* Phase 4 */}
            <Sequence from={p1_duration + p2_duration + p3_duration} durationInFrames={p4_duration}>
                <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#004000" }}>
                    <h1>Ver. 3 (Flower Enemy)</h1>
                    <div style={{ fontSize: 150 }}>🌸</div>
                    <div>vs</div>
                    <div style={{ fontSize: 80 }}>🥚</div>
                </AbsoluteFill>
                {p4_lines.map(line => {
                    const start = p4_accum;
                    p4_accum += line.dur;
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

