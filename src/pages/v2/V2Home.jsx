import { useState, useEffect, useRef } from "react";
import PhoneCall from "./PhoneCall";
import StatusBar from "./StatusBar";
import "./V2Home.css";

const APPS = [
  {
    id: "invite",
    iconType: "mail",
    label: "초대장",
    color: "linear-gradient(180deg, #34aadc, #007aff)",
  },
  { id: "calendar", iconType: "calendar", label: "캘린더", color: "#fff" },
  {
    id: "compat",
    iconType: "hearts",
    label: "궁합",
    color: "linear-gradient(135deg, #ff2d55, #ff375f)",
  },
  { id: "name", iconType: "calc", label: "이름궁합", color: "#1c1c1e" },
  { id: "gallery", iconType: "photos", label: "사진", color: "#fff" },
  {
    id: "venue",
    iconType: "maps",
    label: "오시는 길",
    color: "linear-gradient(135deg, #63da38, #4cd964)",
  },
  {
    id: "shuttle",
    iconType: "transit",
    label: "셔틀",
    color: "linear-gradient(180deg, #007aff, #5856d6)",
  },
  {
    id: "fortune",
    iconType: "fortune",
    label: "포춘쿠키",
    color: "linear-gradient(135deg, #ffcc02, #ff9500)",
  },
  {
    id: "guestbook",
    iconType: "notes",
    label: "방명록",
    color: "#fff",
  },
  { id: "gift", iconType: "wallet", label: "축의금", color: "#1c1c1e" },
];

function AppIcon({ type }) {
  switch (type) {
    case "mail":
      return (
        <div className="icon-mail">
          <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
            <rect
              x="1"
              y="1"
              width="30"
              height="22"
              rx="4"
              fill="rgba(255,255,255,0.25)"
            />
            <rect
              x="1"
              y="1"
              width="30"
              height="22"
              rx="4"
              stroke="#fff"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M2 3l14 10L30 3"
              stroke="#fff"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );
    case "calendar":
      return (
        <div className="icon-calendar">
          <div className="icon-cal-header">월</div>
          <div className="icon-cal-day">25</div>
        </div>
      );
    case "hearts":
      return (
        <div className="icon-inner">
          <svg width="32" height="30" viewBox="0 0 32 30" fill="none">
            <path
              d="M16 28s-12-7.5-14-15C0.5 6 4 1 9.5 1c3.5 0 5.5 2 6.5 3.5C17 3 19 1 22.5 1 28 1 31.5 6 30 13 28 20.5 16 28 16 28z"
              fill="#fff"
            />
          </svg>
        </div>
      );
    case "calc":
      return (
        <div className="icon-calc">
          <div className="icon-calc-display">0</div>
          <div className="icon-calc-grid">
            <span className="calc-light" />
            <span className="calc-light" />
            <span className="calc-orange" />
            <span className="calc-dark" />
            <span className="calc-dark" />
            <span className="calc-orange" />
            <span className="calc-dark" />
            <span className="calc-dark" />
            <span className="calc-orange" />
          </div>
        </div>
      );
    case "photos":
      return (
        <div className="icon-photos">
          <div className="icon-photos-flower">
            <span style={{ background: "#ff3b30" }} />
            <span style={{ background: "#ff9500" }} />
            <span style={{ background: "#ffcc00" }} />
            <span style={{ background: "#4cd964" }} />
            <span style={{ background: "#5ac8fa" }} />
            <span style={{ background: "#007aff" }} />
            <span style={{ background: "#5856d6" }} />
            <span style={{ background: "#ff2d55" }} />
            <span className="icon-photos-center" />
          </div>
        </div>
      );
    case "maps":
      return (
        <div className="icon-maps">
          <div className="icon-maps-bg" />
          <svg
            className="icon-maps-pin"
            width="20"
            height="26"
            viewBox="0 0 20 26"
            fill="none"
          >
            <path
              d="M10 0C4.5 0 0 4.5 0 10c0 7.5 10 16 10 16s10-8.5 10-16C20 4.5 15.5 0 10 0z"
              fill="#ff3b30"
            />
            <circle cx="10" cy="10" r="4" fill="#fff" />
          </svg>
        </div>
      );
    case "transit":
      return (
        <div className="icon-inner">
          <svg width="28" height="32" viewBox="0 0 28 32" fill="none">
            <rect x="4" y="2" width="20" height="22" rx="6" fill="#fff" />
            <rect x="7" y="6" width="14" height="8" rx="2" fill="#5ac8fa" />
            <circle cx="9.5" cy="19" r="2" fill="#333" />
            <circle cx="18.5" cy="19" r="2" fill="#333" />
            <rect x="6" y="25" width="4" height="3" rx="1" fill="#fff" />
            <rect x="18" y="25" width="4" height="3" rx="1" fill="#fff" />
            <rect x="12" y="2" width="4" height="3" rx="1" fill="#5ac8fa" />
          </svg>
        </div>
      );
    case "fortune":
      return (
        <div className="icon-inner" style={{ fontSize: "1.8rem" }}>
          🥠
        </div>
      );
    case "notes":
      return (
        <div className="icon-notes">
          <div className="icon-notes-header" />
          <div className="icon-notes-body">
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      );
    case "wallet":
      return (
        <div className="icon-wallet">
          <div className="icon-wallet-cards">
            <span className="wallet-card-1" />
            <span className="wallet-card-2" />
            <span className="wallet-card-3" />
          </div>
        </div>
      );
    default:
      return null;
  }
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

function DdayWidget() {
  const wedding = new Date(2026, 4, 25);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((wedding - today) / (1000 * 60 * 60 * 24));
  const dday =
    diff === 0 ? "D-Day" : diff > 0 ? `D-${diff}` : `D+${Math.abs(diff)}`;

  return (
    <div className="dday-widget">
      <div className="dday-left">
        <span className="dday-label">Wedding Day</span>
        <span className="dday-date">2026. 05. 25</span>
      </div>
      <div className="dday-count">{dday}</div>
    </div>
  );
}

function HomeScreen({ onAppClick, onSwitchV1 }) {
  return (
    <div className="home-screen">
      <StatusBar />
      <div className="home-content">
        <div className="anim-fade-in" style={{ animationDelay: "0.1s" }}>
          <DdayWidget />
        </div>
        <div className="app-grid">
          {APPS.map((app, i) => (
            <button
              key={app.id}
              className="app-icon-btn anim-pop-in"
              style={{ animationDelay: `${0.15 + i * 0.06}s` }}
              onClick={() => onAppClick(app.id)}
            >
              <div className="app-icon" style={{ background: app.color }}>
                <AppIcon type={app.iconType} />
              </div>
              <span className="app-label">{app.label}</span>
            </button>
          ))}
        </div>
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
    </div>
  );
}

let _callDone = false;

const CALL_DELAY = 10000;

export default function V2Home({ unlocked, onUnlock, onSwitchV1, onAppClick }) {
  const [showCall, setShowCall] = useState(false);

  // 1초 후 전화 오버레이 (잠금/홈 상관없이)
  useEffect(() => {
    if (_callDone) return;
    _callDone = true;
    setTimeout(() => setShowCall(true), CALL_DELAY);
  }, []);

  const handleNotifTap = () => {
    onUnlock();
    setTimeout(() => onAppClick("invite"), 100);
  };

  const handleCallEnd = () => {
    setShowCall(false);
  };

  return (
    <div className="iphone-frame">
      <div className="iphone-body">
        {!unlocked ? (
          <LockScreen onUnlock={onUnlock} onNotifTap={handleNotifTap} />
        ) : (
          <HomeScreen onAppClick={onAppClick} onSwitchV1={onSwitchV1} />
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
