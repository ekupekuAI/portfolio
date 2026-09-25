import { ImageResponse } from "next/og";
import { content } from "@/lib/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${content.name} — ${content.role}`;

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: "#0A0A0F",
          backgroundImage:
            "radial-gradient(circle at 75% 30%, rgba(0,229,255,0.25), transparent 55%)",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "#00E5FF",
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: "#00E5FF",
              display: "flex",
            }}
          />
          Available for opportunities
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 128,
            fontWeight: 700,
            color: "#F5F5F7",
            lineHeight: 1,
          }}
        >
          {content.name}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 36,
            color: "#00E5FF",
            marginTop: 24,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          {content.role}
        </div>
      </div>
    ),
    { ...size }
  );
}
