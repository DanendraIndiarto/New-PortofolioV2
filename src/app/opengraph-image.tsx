import { ImageResponse } from "next/og";

export const alt =
  "Danendra Athallah Indiarto - Junior Backend Developer Portfolio";
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
          backgroundColor: "#080a10",
          backgroundImage:
            "radial-gradient(circle at 18% 15%, rgba(99, 102, 241, 0.35) 0%, transparent 48%), radial-gradient(circle at 86% 80%, rgba(14, 165, 233, 0.28) 0%, transparent 45%), radial-gradient(circle at 55% 45%, rgba(16, 185, 129, 0.14) 0%, transparent 45%)",
          padding: "56px 76px",
          fontFamily: "sans-serif",
          color: "#f4f7ff",
          position: "relative",
          border: "8px solid #141a2b",
        }}
      >
        {/* Top bar with Cyber Wing DI Logo + Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            {/* Cyber Wing DI SVG Logo */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              width="62"
              height="62"
            >
              <defs>
                <linearGradient id="ogBg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#090D18" />
                  <stop offset="100%" stopColor="#161E36" />
                </linearGradient>
                <linearGradient id="ogWing" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#818CF8" />
                  <stop offset="50%" stopColor="#38BDF8" />
                  <stop offset="100%" stopColor="#34D399" />
                </linearGradient>
              </defs>
              <rect width="512" height="512" rx="112" fill="url(#ogBg)" />
              <rect
                x="16"
                y="16"
                width="480"
                height="480"
                rx="96"
                fill="none"
                stroke="#818CF8"
                strokeWidth="10"
                strokeOpacity="0.4"
              />
              <path
                d="M132 124 H276 L354 206 L312 388 H84 L132 124 Z M184 180 L156 332 H258 L286 226 L246 180 Z"
                fill="#F8FAFC"
                fillRule="evenodd"
              />
              <polygon
                points="378,124 434,124 386,388 330,388"
                fill="url(#ogWing)"
              />
              <polygon
                points="84,412 318,412 308,434 74,434"
                fill="url(#ogWing)"
              />
            </svg>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  color: "#ffffff",
                  letterSpacing: "-0.02em",
                }}
              >
                DanendraIndiarto.dev
              </span>
              <span
                style={{
                  fontSize: "14px",
                  color: "#94a3b8",
                  fontWeight: 500,
                }}
              >
                Malang, Indonesia
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 18px",
              borderRadius: "9999px",
              backgroundColor: "rgba(99, 102, 241, 0.16)",
              border: "1px solid rgba(129, 140, 248, 0.45)",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "9999px",
                backgroundColor: "#34d399",
              }}
            />
            <span
              style={{
                fontSize: "15px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                color: "#a5b4fc",
                textTransform: "uppercase",
              }}
            >
              Junior Backend Developer
            </span>
          </div>
        </div>

        {/* Center Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            maxWidth: "980px",
          }}
        >
          <h1
            style={{
              fontSize: "58px",
              fontWeight: 800,
              lineHeight: 1.12,
              color: "#ffffff",
              margin: 0,
              letterSpacing: "-0.025em",
            }}
          >
            Danendra Athallah Indiarto
          </h1>
          <p
            style={{
              fontSize: "25px",
              lineHeight: 1.4,
              color: "#bac4dc",
              margin: 0,
            }}
          >
            RESTful API, Database PostgreSQL &amp; MySQL, Docker Container,
            Directus, Node-RED, serta Manajemen Server Ubuntu &amp; PM2.
          </p>
        </div>

        {/* Bottom Footer: Tech Stack Pills */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid rgba(148, 163, 184, 0.22)",
            paddingTop: "26px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {[
              "Node.js",
              "NestJS",
              "PostgreSQL",
              "Docker",
              "Directus",
              "Node-RED",
              "Ubuntu",
            ].map((tech) => (
              <div
                key={tech}
                style={{
                  padding: "6px 14px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(23, 29, 46, 0.9)",
                  border: "1px solid rgba(129, 140, 248, 0.3)",
                  color: "#e2e8f0",
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
              color: "#38bdf8",
              fontSize: "18px",
              fontWeight: 700,
            }}
          >
            indiartodev.vercel.app
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
