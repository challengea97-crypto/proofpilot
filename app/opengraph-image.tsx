import { ImageResponse } from "next/og";

export const alt = "Teckro — Evidence-linked startup validation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#070707",
          padding: 80,
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#070707",
              fontSize: 38,
              fontWeight: 900,
            }}
          >
            T
          </div>
          <div style={{ fontSize: 46, fontWeight: 900 }}>Teckro</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 74, fontWeight: 900, lineHeight: 1.05, maxWidth: 940 }}>
            Validate your startup before you build.
          </div>
          <div style={{ fontSize: 32, color: "#a1a1aa" }}>
            Competitors, demand, pricing, and a founder-ready report.
          </div>
        </div>

        <div style={{ fontSize: 26, color: "#71717a" }}>Proof before build.</div>
      </div>
    ),
    { ...size }
  );
}
