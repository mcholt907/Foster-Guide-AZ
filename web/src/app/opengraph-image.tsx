import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "FosterHub AZ — Know Your Rights";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #2A7F8E 0%, #1B3A5C 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* House-heart icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 96,
            height: 96,
            borderRadius: 20,
            background: "#2A7F8E",
            border: "3px solid rgba(255,255,255,0.3)",
            marginBottom: 32,
          }}
        >
          <svg width="56" height="56" viewBox="0 0 192 192">
            <polygon points="96,40 164,108 28,108" fill="white" />
            <rect x="44" y="106" width="104" height="58" rx="4" fill="white" />
            <path
              d="M96,145 C83,135 68,122 68,112 C68,104 75,98 84,101 C88,102 92,106 96,110 C100,106 104,102 108,101 C117,98 124,104 124,112 C124,122 109,135 96,145Z"
              fill="#D97706"
            />
          </svg>
        </div>

        {/* Title */}
        <div style={{ fontSize: 72, fontWeight: 800, color: "white", lineHeight: 1.1, marginBottom: 20 }}>
          FosterHub AZ
        </div>

        {/* Tagline */}
        <div style={{ fontSize: 32, color: "rgba(255,255,255,0.8)", lineHeight: 1.4, maxWidth: 800 }}>
          Know your rights. Understand your case. Plan your future.
        </div>

        {/* Bottom badge */}
        <div
          style={{
            display: "flex",
            marginTop: 40,
            padding: "10px 24px",
            borderRadius: 100,
            background: "rgba(255,255,255,0.15)",
            color: "rgba(255,255,255,0.85)",
            fontSize: 22,
            width: "fit-content",
          }}
        >
          Free · Private · Bilingual · Arizona
        </div>
      </div>
    ),
    { ...size }
  );
}
