import { useState, useRef, useEffect, useCallback } from "react";
import "./CameraApp.css";

const FRAMES = [
  { id: "heart", label: "Heart", photo: "/photos/photo1.jpg" },
  { id: "film", label: "Film", photo: "/photos/photo2.jpg" },
  { id: "polaroid", label: "Polaroid", photo: "/photos/photo3.jpg" },
  { id: "strip", label: "4-Cut", photo: "/photos/photo4.jpg" },
];

export default function CameraApp() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [frameIdx, setFrameIdx] = useState(0);
  const [captured, setCaptured] = useState(null);
  const [facingMode, setFacingMode] = useState("user");
  const [flash, setFlash] = useState(false);

  const startCamera = useCallback(async (facing) => {
    // Stop previous stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1080 },
          height: { ideal: 1440 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setReady(true);
      }
    } catch {
      // Camera denied or unavailable
    }
  }, []);

  useEffect(() => {
    startCamera(facingMode);
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [facingMode, startCamera]);

  const flipCamera = () => {
    setFacingMode((f) => (f === "user" ? "environment" : "user"));
  };

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    setFlash(true);
    setTimeout(() => setFlash(false), 300);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const size = 900;
    canvas.width = size;
    canvas.height = size;

    // Draw video (mirrored if front camera)
    ctx.save();
    if (facingMode === "user") {
      ctx.translate(size, 0);
      ctx.scale(-1, 1);
    }
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    const scale = Math.max(size / vw, size / vh);
    const sw = vw * scale;
    const sh = vh * scale;
    ctx.drawImage(video, (size - sw) / 2, (size - sh) / 2, sw, sh);
    ctx.restore();

    // Draw frame overlay
    const frame = FRAMES[frameIdx];
    drawFrame(ctx, size, frame, () => {
      setCaptured(canvas.toDataURL("image/jpeg", 0.92));
    });
  };

  const drawFrame = (ctx, size, frame, done) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const f = frame.id;

      if (f === "heart") {
        // Bottom-right couple photo in heart shape
        const s = size * 0.38;
        const x = size - s - 20;
        const y = size - s - 20;
        ctx.save();
        ctx.beginPath();
        heartPath(ctx, x + s / 2, y + s * 0.35, s * 0.48);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, x, y, s, s);
        ctx.restore();
        // Heart border
        ctx.save();
        ctx.beginPath();
        heartPath(ctx, x + s / 2, y + s * 0.35, s * 0.48);
        ctx.closePath();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 4;
        ctx.shadowColor = "rgba(0,0,0,0.3)";
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.restore();
        // Text
        ctx.fillStyle = "#fff";
        ctx.font = "bold 28px -apple-system, sans-serif";
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 6;
        ctx.fillText("CM & SJ", 24, size - 30);
        ctx.shadowBlur = 0;
      }

      if (f === "film") {
        // Film strip style - couple photo on top strip
        const stripH = size * 0.18;
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, 0, size, stripH);
        ctx.fillRect(0, size - stripH, size, stripH);
        // Sprocket holes
        for (let i = 0; i < 8; i++) {
          const hx = 30 + (i * (size - 60)) / 7;
          ctx.fillStyle = "#333";
          roundRect(ctx, hx - 10, 8, 20, stripH * 0.35, 4);
          ctx.fill();
          roundRect(ctx, hx - 10, size - stripH + 8, 20, stripH * 0.35, 4);
          ctx.fill();
        }
        // Couple photo in top strip
        const pw = stripH * 0.65;
        ctx.save();
        ctx.beginPath();
        ctx.arc(size / 2, stripH / 2, pw / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, size / 2 - pw / 2, stripH / 2 - pw / 2, pw, pw);
        ctx.restore();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(size / 2, stripH / 2, pw / 2, 0, Math.PI * 2);
        ctx.stroke();
        // Date text
        ctx.fillStyle = "#ffcc00";
        ctx.font = "22px monospace";
        ctx.fillText("2026.05.25", size - 210, size - stripH / 2 + 8);
      }

      if (f === "polaroid") {
        // Polaroid frame
        const pad = 30;
        const bottomPad = 120;
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, size, size);
        // Draw camera image inside polaroid
        const innerW = size - pad * 2;
        const innerH = size - pad - bottomPad;
        ctx.drawImage(ctx.canvas, pad, pad, innerW, innerH);
        // Couple mini photo
        const ms = 80;
        ctx.save();
        ctx.beginPath();
        ctx.arc(
          size - pad - ms / 2 - 10,
          size - bottomPad / 2,
          ms / 2,
          0,
          Math.PI * 2,
        );
        ctx.clip();
        ctx.drawImage(
          img,
          size - pad - ms - 10,
          size - bottomPad / 2 - ms / 2,
          ms,
          ms,
        );
        ctx.restore();
        ctx.strokeStyle = "#eee";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(
          size - pad - ms / 2 - 10,
          size - bottomPad / 2,
          ms / 2,
          0,
          Math.PI * 2,
        );
        ctx.stroke();
        // Handwriting text
        ctx.fillStyle = "#555";
        ctx.font = "italic 26px Georgia, serif";
        ctx.fillText("with CM & SJ", pad + 10, size - bottomPad / 2 + 8);
        ctx.fillStyle = "#aaa";
        ctx.font = "18px Georgia, serif";
        ctx.fillText("2026. 05. 25", pad + 10, size - bottomPad / 2 + 36);
      }

      if (f === "strip") {
        // 4-cut style - couple in corner with deco
        const s = size * 0.3;
        const x = size - s - 16;
        const y = 16;
        // White border
        ctx.fillStyle = "#fff";
        roundRect(ctx, x - 6, y - 6, s + 12, s + 12, 12);
        ctx.fill();
        ctx.shadowColor = "rgba(0,0,0,0.2)";
        ctx.shadowBlur = 10;
        roundRect(ctx, x - 6, y - 6, s + 12, s + 12, 12);
        ctx.fill();
        ctx.shadowBlur = 0;
        // Couple photo
        ctx.save();
        ctx.beginPath();
        roundRect(ctx, x, y, s, s, 8);
        ctx.clip();
        ctx.drawImage(img, x, y, s, s);
        ctx.restore();
        // Decorative hearts
        ctx.font = "32px sans-serif";
        ctx.fillText("\u2764\uFE0F", x - 30, y + s + 10);
        ctx.font = "20px sans-serif";
        ctx.fillText("\uD83D\uDC95", x + s - 10, y - 4);
        // Bottom banner
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        roundRect(ctx, 16, size - 70, size - 32, 54, 14);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.font = "bold 22px -apple-system, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("CM \u2665 SJ  |  2026.05.25", size / 2, size - 36);
        ctx.textAlign = "start";
      }

      done();
    };
    img.src = frame.photo;
  };

  const heartPath = (ctx, cx, cy, r) => {
    ctx.moveTo(cx, cy + r * 0.7);
    ctx.bezierCurveTo(
      cx - r * 1.5,
      cy - r * 0.3,
      cx - r * 0.5,
      cy - r * 1.3,
      cx,
      cy - r * 0.5,
    );
    ctx.bezierCurveTo(
      cx + r * 0.5,
      cy - r * 1.3,
      cx + r * 1.5,
      cy - r * 0.3,
      cx,
      cy + r * 0.7,
    );
  };

  const roundRect = (ctx, x, y, w, h, r) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };

  const [saved, setSaved] = useState(false);
  const savePhoto = () => {
    if (!captured) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const retake = () => {
    setCaptured(null);
  };

  if (captured) {
    return (
      <div className="cam-result">
        <img src={captured} alt="captured" className="cam-result-img" />
        <div className="cam-result-actions">
          <button className="cam-action-btn" onClick={retake}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M17.65 6.35A7.96 7.96 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
                fill="currentColor"
              />
            </svg>
            <span>다시 찍기</span>
          </button>
          <button className="cam-action-btn cam-save-btn" onClick={savePhoto}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"
                fill="currentColor"
              />
            </svg>
            <span>{saved ? "찰칵!" : "저장"}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cam-app">
      <div className="cam-viewfinder">
        <video
          ref={videoRef}
          className="cam-video"
          autoPlay
          playsInline
          muted
          style={{ transform: facingMode === "user" ? "scaleX(-1)" : "none" }}
        />
        {!ready && (
          <div className="cam-placeholder">
            <p>카메라 권한을 허용해주세요</p>
          </div>
        )}

        {/* Frame preview overlay */}
        <div className="cam-frame-overlay">
          <FramePreview frame={FRAMES[frameIdx]} />
        </div>

        {/* Flash */}
        {flash && <div className="cam-flash" />}
      </div>

      {/* Frame selector */}
      <div className="cam-frame-bar">
        {FRAMES.map((f, i) => (
          <button
            key={f.id}
            className={`cam-frame-thumb ${i === frameIdx ? "active" : ""}`}
            onClick={() => setFrameIdx(i)}
          >
            <img src={f.photo} alt={f.label} />
            <span>{f.label}</span>
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="cam-controls">
        <button className="cam-flip-btn" onClick={flipCamera}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 5h-3.17L15 3H9L7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-8 13c-2.76 0-5-2.24-5-5h1.5l-2-3-2 3H6c0 3.31 2.69 6 6 6v-1zm4.5-3l2-3h-1.5c0-3.31-2.69-6-6-6v1c2.76 0 5 2.24 5 5h-1.5l2 3z"
              fill="currentColor"
            />
          </svg>
        </button>
        <button className="cam-shutter" onClick={takePhoto} disabled={!ready}>
          <span className="cam-shutter-inner" />
        </button>
        <div style={{ width: 44 }} />
      </div>

      <p className="cam-notice">* 실제 촬영이 아닌 재미용 포토부스입니다.</p>
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}

function FramePreview({ frame }) {
  if (frame.id === "heart") {
    return (
      <div className="frame-preview-heart">
        <img src={frame.photo} alt="" className="frame-heart-img" />
        <span className="frame-heart-text">CM & SJ</span>
      </div>
    );
  }
  if (frame.id === "film") {
    return (
      <>
        <div className="frame-preview-film top">
          <div className="film-holes">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <span key={i} />
              ))}
          </div>
          <img src={frame.photo} alt="" className="frame-film-photo" />
        </div>
        <div className="frame-preview-film bottom">
          <span className="film-date">2026.05.25</span>
          <div className="film-holes">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <span key={i} />
              ))}
          </div>
        </div>
      </>
    );
  }
  if (frame.id === "polaroid") {
    return (
      <div className="frame-preview-polaroid">
        <span>with CM & SJ</span>
      </div>
    );
  }
  if (frame.id === "strip") {
    return (
      <div className="frame-preview-strip">
        <img src={frame.photo} alt="" className="frame-strip-img" />
        <div className="frame-strip-banner">CM &hearts; SJ | 2026.05.25</div>
      </div>
    );
  }
  return null;
}
