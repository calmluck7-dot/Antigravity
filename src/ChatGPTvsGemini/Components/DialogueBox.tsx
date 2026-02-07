import { } from "remotion";

export const DialogueBox: React.FC<{
    text: string;
    speaker: string;
    color: string;
    style?: React.CSSProperties;
}> = ({ text, speaker, color, style }) => {
    return (
        <div style={{
            position: "absolute",
            bottom: 20,
            left: "5%",
            width: "90%",
            height: 200,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            border: `5px solid ${color}`,
            borderRadius: 20,
            padding: 20,
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            ...style
        }}>
            <div style={{
                fontWeight: "bold",
                fontSize: 32,
                marginBottom: 10,
                color: color
            }}>
                {speaker}
            </div>
            <div style={{
                fontSize: 28,
                color: "#333",
                lineHeight: 1.4,
                whiteSpace: "pre-wrap"
            }}>
                {text}
            </div>
        </div>
    );
};
