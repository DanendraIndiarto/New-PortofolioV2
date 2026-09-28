import { ImageResponse } from "next/og";

export const alt = "Danendra Athallah Indiarto - Junior Backend Developer Portfolio";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#070b12",
          backgroundImage: "radial-gradient(circle at 25% 25%, #064e3b 0%, transparent 45%), radial-gradient(circle at 80% 80%, #083344 0%, transparent 40%)",
          padding: "60px 80px",
          fontFamily: "sans-serif",
          color: "#f8fafc",
          position: "relative",
          border: "8px solid #0f172a",
        }}
      >
        {/* Top bar with Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 18px",
              borderRadius: "9999px",
              backgroundColor: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.4)",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "9999px",
                backgroundColor: "#10b981",
              }}
            />
            <span
              style={{
                fontSize: "16px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                color: "#34d399",
                textTransform: "uppercase",
              }}
            >
              Junior Backend Developer
            </span>
          </div>

          <span
            style={{
              fontSize: "16px",
              color: "#64748b",
              fontWeight: 500,
            }}
          >
            • Malang, Indonesia
          </span>
        </div>

        {/* Center Content: Headline & Subtitle */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            maxWidth: "950px",
          }}
        >
          <h1
            style={{
              fontSize: "56px",
              fontWeight: 800,
              lineHeight: 1.15,
              color: "#ffffff",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Danendra Athallah Indiarto
          </h1>
          <p
            style={{
              fontSize: "26px",
              lineHeight: 1.4,
              color: "#94a3b8",
              margin: 0,
            }}
          >
            Perancangan RESTful API yang Efisien, Arsitektur Database MySQL, dan Manajemen Server Linux &amp; PM2.
          </p>
        </div>

        {/* Bottom Footer: Tech Stack Pills */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid rgba(51, 65, 85, 0.6)",
            paddingTop: "28px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {["Node.js", "Express.js", "NestJS", "MySQL", "Linux Ubuntu", "PM2"].map((tech) => (
              <div
                key={tech}
                style={{
                  padding: "6px 14px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(30, 41, 59, 0.8)",
                  border: "1px solid rgba(71, 85, 105, 0.4)",
                  color: "#cbd5e1",
                  fontSize: "15px",
                  fontWeight: 600,
                }}
              >
                {tech}
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "#10b981",
              fontSize: "18px",
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            Portfolio Website
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
