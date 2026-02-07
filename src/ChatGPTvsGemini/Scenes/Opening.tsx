import { AbsoluteFill, useCurrentFrame, interpolate, Img } from "remotion";
import tamaChanImg from "../assets/tama_chan.png";

export const Opening: React.FC = () => {
    const frame = useCurrentFrame();

    const roll = interpolate(frame, [0, 30], [0, 720], { extrapolateRight: "clamp" });
    const x = interpolate(frame, [0, 30], [-200, 500], { extrapolateRight: "clamp" });

    // Tama-chan placeholder (Yellow Circle)
    return (
        <AbsoluteFill style={{ backgroundColor: "white", justifyContent: "center", alignItems: "center" }}>
            <Img
                src={tamaChanImg}
                style={{
                    width: 200,
                    height: 200,
                    transform: `translateX(${x}px) rotate(${roll}deg)`,
                    position: "absolute",
                }}
            />

            <div style={{
                position: "absolute",
                top: 200,
                fontSize: 60,
                fontWeight: "bold",
                opacity: interpolate(frame, [30, 45], [0, 1]),
            }}>
                ChatGPT vs Gemini！
                <br />
                パズドラ風ゲーム開発対決
            </div>
        </AbsoluteFill>
    );
};
