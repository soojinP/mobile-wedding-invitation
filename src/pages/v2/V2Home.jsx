import { useState, useEffect, useRef } from "react";
import PhoneCall from "./PhoneCall";
import StatusBar from "./StatusBar";
import "./V2Home.css";

const HOME_APPS = [
  { id: "invite", iconType: "mail", label: "초대장" },
  { id: "calendar", iconType: "calendar", label: "캘린더" },
  { id: "gallery", iconType: "photos", label: "사진" },
  { id: "venue", iconType: "maps", label: "오시는 길" },
  { id: "guestbook", iconType: "notes", label: "방명록" },
  { id: "gift", iconType: "wallet", label: "축의금" },
];

const LIBRARY_APPS = [
  { id: "compat", iconType: "hearts", label: "궁합" },
  { id: "name", iconType: "calc", label: "이름궁합" },
  { id: "fortune", iconType: "fortune", label: "포춘쿠키" },
];

function AppIcon({ type }) {
  return (
    <img
      src={`/icons/${type}.png`}
      alt={type}
      className="app-icon-img"
    />
  );
}

function LockScreen({ onUnlock, onNotifTap }) {
  const [time, setTime] = useState({ h: "", m: "" });
  const [offsetY, setOffsetY] = useState(0);
  const [unlocking, setUnlocking] = useState(false);
  const touchStartY = useRef(null);
  const screenRef = useRef(null);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime({
        h: String(now.getHours()).padStart(2, "0"),
        m: String(now.getMinutes()).padStart(2, "0"),
      });
    };
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    if (touchStartY.current === null) return;
    const diff = touchStartY.current - e.touches[0].clientY;
    if (diff > 0) {
      setOffsetY(Math.min(diff, 300));
    }
  };

  const handleTouchEnd = () => {
    if (offsetY > 120) {
      setUnlocking(true);
      setTimeout(onUnlock, 400);
    } else {
      setOffsetY(0);
    }
    touchStartY.current = null;
  };

  const handleClick = () => {
    setUnlocking(true);
    setTimeout(onUnlock, 400);
  };

  const progress = Math.min(offsetY / 200, 1);
  const transform = unlocking
    ? "translateY(-100%)"
    : `translateY(${-offsetY}px)`;
  const opacity = unlocking ? 0 : 1 - progress * 0.3;

  return (
    <div
      ref={screenRef}
      className={`lock-screen ${unlocking ? "unlocking" : ""}`}
      style={{
        transform,
        opacity,
        transition:
          unlocking || offsetY === 0
            ? "transform 0.4s ease, opacity 0.4s ease"
            : "none",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    >
      <StatusBar />
      <div className="lock-content">
        <div className="lock-date">5월 25일 월요일</div>
        <div className="lock-time">
          {time.h}
          <span className="lock-time-colon">:</span>
          {time.m}
        </div>

        <div
          className="lock-now-playing anim-slide-up"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="now-playing-card">
            <div className="now-playing-art">
              <div className="vinyl-disc">
                <div className="vinyl-hole" />
              </div>
            </div>
            <div className="now-playing-info">
              <div className="now-playing-title">Wedding March</div>
              <div className="now-playing-artist">Mendelssohn</div>
              <div className="now-playing-credit">bgmstore</div>
            </div>
            <div className="now-playing-bars">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>

        <div
          className="lock-notification anim-slide-up"
          style={{ animationDelay: "0.8s" }}
          onClick={(e) => {
            e.stopPropagation();
            onNotifTap();
          }}
        >
          <div className="notif-card">
            <div className="notif-header">
              <span className="notif-icon">💌</span>
              <span className="notif-app">초대장</span>
              <span className="notif-when">지금</span>
            </div>
            <div className="notif-title">창민 & 수진 결혼합니다</div>
            <div className="notif-body">
              2026. 05. 25 (월) 오후 1시 | 연세대학교 동문회관
            </div>
          </div>
        </div>
      </div>
      <div
        className="lock-swipe anim-slide-up"
        style={{ animationDelay: "1.2s" }}
      >
        <div className="swipe-bar" />
        <span className="swipe-text">위로 스와이프하여 잠금 해제</span>
      </div>
    </div>
  );
}

const HEART_EMOJIS = ["\u2764\uFE0F", "\uD83E\uDE77", "\uD83D\uDC95", "\uD83D\uDC96", "\uD83D\uDC97", "\uD83D\uDC93", "\u2763\uFE0F", "\uD83E\uDD0D", "\uD83E\uDD0E"];

let _heartId = 0;

function DdayWidget() {
  const wedding = new Date(2026, 4, 25);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((wedding - today) / (1000 * 60 * 60 * 24));
  const dday =
    diff === 0 ? "D-Day" : diff > 0 ? `D-${diff}` : `D+${Math.abs(diff)}`;

  const [hearts, setHearts] = useState([]);
  const [bounce, setBounce] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    setBounce(true);
    setTimeout(() => setBounce(false), 400);

    const count = 6 + Math.floor(Math.random() * 4);
    const newHearts = Array.from({ length: count }, () => ({
      id: _heartId++,
      emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)],
      x: (Math.random() - 0.5) * 120,
      y: -(40 + Math.random() * 80),
      size: 0.7 + Math.random() * 0.8,
      dur: 0.6 + Math.random() * 0.6,
    }));
    setHearts((prev) => [...prev, ...newHearts]);
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => !newHearts.includes(h)));
    }, 1400);
  };

  return (
    <div
      className={`dday-widget ${bounce ? "dday-bounce" : ""}`}
      onClick={handleClick}
    >
      <div className="dday-left">
        <span className="dday-label">Wedding Day</span>
        <span className="dday-date">2026. 05. 25</span>
      </div>
      <div className="dday-count">{dday}</div>
      {hearts.map((h) => (
        <span
          key={h.id}
          className="dday-heart"
          style={{
            "--hx": `${h.x}px`,
            "--hy": `${h.y}px`,
            fontSize: `${h.size}rem`,
            animationDuration: `${h.dur}s`,
          }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  );
}

function HomeScreen({ onAppClick, onSwitchV1, onLock }) {
  const [page, setPage] = useState(0);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const touchDeltaX = useRef(0);
  const directionRef = useRef(null); // 'h' or 'v'
  const [offsetX, setOffsetX] = useState(0);
  const [pullY, setPullY] = useState(0);
  const [swiping, setSwiping] = useState(false);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    directionRef.current = null;
    setSwiping(true);
  };

  const handleTouchMove = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;

    // Determine direction on first significant move
    if (!directionRef.current && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
      directionRef.current = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
    }

    if (directionRef.current === "v") {
      // Pull down to lock
      if (dy > 0) setPullY(Math.min(dy, 400));
      return;
    }

    if (directionRef.current === "h") {
      touchDeltaX.current = dx;
      if (page === 0 && dx > 0) return setOffsetX(0);
      if (page === 1 && dx < 0) return setOffsetX(0);
      setOffsetX(dx);
    }
  };

  const handleTouchEnd = () => {
    // Vertical: pull to lock
    if (directionRef.current === "v" && pullY > 120) {
      onLock();
    }
    setPullY(0);

    // Horizontal: page switch
    if (directionRef.current === "h" && Math.abs(touchDeltaX.current) > 60) {
      if (touchDeltaX.current < 0 && page === 0) setPage(1);
      if (touchDeltaX.current > 0 && page === 1) setPage(0);
    }
    touchStartX.current = null;
    touchStartY.current = null;
    touchDeltaX.current = 0;
    directionRef.current = null;
    setOffsetX(0);
    setSwiping(false);
  };

  const translate = -page * 50;
  const dragPx = swiping ? offsetX : 0;

  return (
    <div
      className="home-screen"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <StatusBar />
      <div
        className="home-pages"
        style={{
          transform: `translateX(calc(${translate}% + ${dragPx}px))`,
          transition: swiping ? "none" : "transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)",
        }}
      >
        {/* Page 1: Home */}
        <div className="home-page">
          <div className="home-content">
            <div className="anim-fade-in" style={{ animationDelay: "0.1s" }}>
              <DdayWidget />
            </div>
            <div className="app-grid">
              {HOME_APPS.map((app, i) => (
                <button
                  key={app.id}
                  className="app-icon-btn anim-pop-in"
                  style={{ animationDelay: `${0.15 + i * 0.06}s` }}
                  onClick={() => onAppClick(app.id)}
                >
                  <div className="app-icon">
                    <AppIcon type={app.iconType} />
                  </div>
                  <span className="app-label">{app.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Page 2: App Library */}
        <div className="home-page">
          <div className="home-content library-content">
            <div className="library-header">앱 보관함</div>
            <div className="library-group">
              <div className="library-group-label">재미</div>
              <div className="library-grid">
                {LIBRARY_APPS.map((app) => (
                  <button
                    key={app.id}
                    className="app-icon-btn"
                    onClick={() => onAppClick(app.id)}
                  >
                    <div className="app-icon">
                      <AppIcon type={app.iconType} />
                    </div>
                    <span className="app-label">{app.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page dots */}
      <div className="page-dots">
        <span className={`page-dot ${page === 0 ? "active" : ""}`} onClick={() => setPage(0)} />
        <span className={`page-dot ${page === 1 ? "active" : ""}`} onClick={() => setPage(1)} />
      </div>

      <div
        className="home-dock anim-slide-up-home"
        style={{ animationDelay: "0.8s" }}
      >
        <button className="dock-btn" onClick={onSwitchV1}>
          <span className="dock-icon">🎪</span>
          <span className="dock-label">V1 모드</span>
        </button>
      </div>
      <div className="home-watermark">@podonuna</div>
      <div className="home-indicator">
        <div className="indicator-bar" />
      </div>

      {/* Pull-down lock overlay */}
      {pullY > 0 && (
        <div
          className="pull-lock-overlay"
          style={{
            transform: `translateY(${-100 + (pullY / 400) * 100}%)`,
            opacity: Math.min(pullY / 200, 1),
          }}
        >
          <div className="pull-lock-bg" />
        </div>
      )}
    </div>
  );
}

let _callDone = false;

const CALL_DELAY = 10000;

export default function V2Home({ unlocked, onUnlock, onSwitchV1, onAppClick }) {
  const [showCall, setShowCall] = useState(false);
  const [locking, setLocking] = useState(false);
  const [internalLocked, setInternalLocked] = useState(false);

  const isLocked = !unlocked || internalLocked;

  // 1초 후 전화 오버레이 (잠금/홈 상관없이)
  useEffect(() => {
    if (_callDone) return;
    _callDone = true;
    setTimeout(() => setShowCall(true), CALL_DELAY);
  }, []);

  const handleUnlock = () => {
    onUnlock();
    setInternalLocked(false);
  };

  const handleNotifTap = () => {
    handleUnlock();
    setTimeout(() => onAppClick("invite"), 100);
  };

  const handleCallEnd = () => {
    setShowCall(false);
  };

  const handleLock = () => {
    setLocking(true);
  };

  const handleLockAnimEnd = () => {
    if (locking) {
      setLocking(false);
      setInternalLocked(true);
    }
  };

  return (
    <div className="iphone-frame">
      <div className="iphone-body">
        {isLocked && !locking ? (
          <LockScreen onUnlock={handleUnlock} onNotifTap={handleNotifTap} />
        ) : (
          <>
            <HomeScreen onAppClick={onAppClick} onSwitchV1={onSwitchV1} onLock={handleLock} />
            {locking && (
              <div className="lock-slide-down" onAnimationEnd={handleLockAnimEnd}>
                <LockScreen onUnlock={() => {}} onNotifTap={() => {}} />
              </div>
            )}
          </>
        )}
        {showCall && (
          <div className="call-overlay">
            <PhoneCall onEnd={handleCallEnd} />
          </div>
        )}
      </div>
    </div>
  );
}
