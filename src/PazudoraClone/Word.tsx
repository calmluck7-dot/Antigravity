import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

export const Word: React.FC<{
  children: React.ReactNode;
  delay?: number;
  primary?: boolean;
}> = ({ children, delay = 0, primary = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 12,
    },
  });
  
  const opacity = spring({
    frame: frame - delay,
    fps,
    config: {
        damping: 200,
    }
  });

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        opacity: opacity,
        fontWeight: "bold",
        fontSize: primary ? 120 : 60,
        color: primary ? "#ffffff" : "#cccccc",
        fontFamily: "Helvetica, Arial, sans-serif",
        textAlign: "center",
      }}
    >
      {children}
    </div>
  );
};
