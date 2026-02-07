import { AbsoluteFill, Sequence, Img, Audio, staticFile, useVideoConfig, useCurrentFrame } from "remotion";
import { DialogueBox } from "../Components/DialogueBox";
import { TAMA_IMAGES } from "../assets/tama";
import { scriptData, COLORS } from "../data/scriptData";
import audioDurationsResponse from "../data/audioDurations.json";

const audioDurations = audioDurationsResponse as Record<string, number>;

export const GeminiTurn: React.FC = () => {
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
    const p1_lines = ["gemini_01", "gemini_02", "gemini_03"].map(id => ({ ...getLine(id), dur: getDuration(id) }));
    const p1_duration = p1_lines.reduce((sum, line) => sum + line.dur, 0);

    // Phase 2
    const p2_lines = ["gemini_04", "gemini_05", "gemini_06"].map(id => ({ ...getLine(id), dur: getDuration(id) }));
    const p2_duration = p2_lines.reduce((sum, line) => sum + line.dur, 0);

    // Phase 3
    const p3_lines = ["gemini_07", "gemini_08", "gemini_09"].map(id => ({ ...getLine(id), dur: getDuration(id) }));
    const p3_duration = p3_lines.reduce((sum, line) => sum + line.dur, 0);

    // Phase 4
    const p4_lines = ["gemini_10", "gemini_11", "gemini_12", "gemini_13"].map(id => ({ ...getLine(id), dur: getDuration(id) }));
    const p4_duration = p4_lines.reduce((sum, line) => sum + line.dur, 0);

    let p1_accum = 0;
    let p2_accum = 0;
    let p3_accum = 0;
    let p4_accum = 0;

    return (
        <AbsoluteFill style={{ backgroundColor: "#101010", color: "#aaddff" }}>
            {/* Phase 1: High-Speed Coding */}
            <Sequence from={0} durationInFrames={p1_duration}>
                <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
                    <h1>Gemini Turn</h1>
                    <p>Generating Code (Ultra Fast)...</p>
                    <pre style={{ fontSize: 12, textAlign: 'left', color: '#00ff00', backgroundColor: '#000', padding: 10 }}>
                        {`// Gemini 1.5 Pro Mode
// Vue.js + Particle Effects
<template>...</template>`}
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

            {/* Phase 2: Ver 1 (Frozen) */}
            <Sequence from={p1_duration} durationInFrames={p2_duration}>
                <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#202040" }}>
                    <h1>Ver. 1 (Beautiful but Frozen)</h1>
                    <div style={{ fontSize: 50 }}>💎 💎 💎</div>
                    <div style={{ marginTop: 20 }}>... (Waiting 100 years) ...</div>
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

            {/* Phase 3: Ver 2 (Yokan) */}
            <Sequence from={p1_duration + p2_duration} durationInFrames={p3_duration}>
                <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#204020" }}>
                    <h1>Ver. 2 (Matcha Yokan)</h1>
                    <div style={{ fontSize: 100 }}>🍵 + 🍮</div>
                    <div>Puru Puru...</div>
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

            {/* Phase 4: Ver 3 (Ukiyo-e) */}
            <Sequence from={p1_duration + p2_duration + p3_duration} durationInFrames={p4_duration}>
                <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", backgroundColor: "#303030" }}>
                    <h1>Ver. 3 (Ukiyo-e Dragon)</h1>
                    <div style={{ fontSize: 100 }}>🐉</div>
                    <div style={{ marginTop: 20, color: "red", fontWeight: "bold" }}>GAME OVER (SEPPUKU)</div>
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

