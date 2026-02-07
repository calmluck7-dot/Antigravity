import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Word } from "./Word";

export const Eyecatch: React.FC = () => {
    return (
        <AbsoluteFill
            style={{
                backgroundColor: "#1a1a1a",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                gap: 20,
            }}
        >
            {/* 
                Ensure you have a voice.wav file in the public/PazudoraClone folder! 
            */}
            <Audio src={staticFile("PazudoraClone/voice.wav")} />

            <Sequence from={25}>
                <Word delay={10} primary>
                    パズドラ作ってみた
                </Word>
            </Sequence>
        </AbsoluteFill >
    );
};
