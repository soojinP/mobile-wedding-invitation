import { useState, useEffect, useRef } from "react";
import "./PhoneCall.css";

const BASE_SCRIPT = [
  { delay: 600, text: "여보세요~?" },
  { delay: 900, text: "아 {name}님이시구나!" },
  { delay: 1200, text: "다름이 아니라..." },
  { delay: 900, text: "저희 결혼합니다!!! 🎉" },
  { delay: 1200, text: "2026년 5월 25일 월요일 오후 1시" },
  { delay: 1000, text: "연세대학교 동문회관이요" },
  { delay: 1200, text: "대체공휴일이라 쉬는 날이에요 ㅎㅎ" },
  { delay: 1000, text: "{name}님 꼭 와주셔야 해요!!" },
  { delay: 1000, text: "밥은 맛있을 예정입니다 👀" },
  { delay: 900, text: "그럼 그날 봐요~! 💕" },
];

const 견다박_SCRIPT = (name) => [
  { delay: 600, text: "여보세요~?" },
  { delay: 900, text: `${name}님!!!!!!!!!!` },
  { delay: 1200, text: "다름이 아니라..." },
  { delay: 900, text: "저희 결혼합니다!!! 🎉" },
  { delay: 1200, text: "2026년 5월 25일 월요일 오후 1시" },
  { delay: 1000, text: "연세대학교 동문회관이요" },
  { delay: 1200, text: "대체공휴일이라 쉬는 날이에요 ㅎㅎ" },
  { delay: 1000, text: "{name}님 꼭 와주셔야 해요!!" },
  { delay: 1000, text: "견다는 꼭 와야해!!!!!!!!!!!!" },
  { delay: 900, text: "그럼 그날 봐요~! 💕" },
];
const SPECIAL_NAMES = ["설다빈", "김견리"];

function getScript(name) {
  const trimmed = name.trim();
  if (SPECIAL_NAMES.includes(trimmed)) {
    const trimmedName = name.slice(-2); // 이름을 뒤에서 2글자 자르고 붙임
    return 견다박_SCRIPT(trimmedName);
  }
  return BASE_SCRIPT;
}

export default function PhoneCall({ onEnd }) {
  const [phase, setPhase] = useState("ringing"); // ringing → connected → name → talking → ended
  const [guestName, setGuestName] = useState("");
  const [messages, setMessages] = useState([]);
  const [script, setScript] = useState(BASE_SCRIPT);
  const [scriptIdx, setScriptIdx] = useState(0);
  const [callTime, setCallTime] = useState(0);
  const [_, setNameSubmitted] = useState(false);
  const msgsEndRef = useRef(null);

  // Call timer
  useEffect(() => {
    if (phase !== "name" && phase !== "talking") return;
    const t = setInterval(() => setCallTime((c) => c + 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  // Script progression
  useEffect(() => {
    if (phase !== "talking") return;
    if (scriptIdx >= script.length) {
      const t = setTimeout(() => setPhase("ended"), 1200);
      return () => clearTimeout(t);
    }
    const { delay, text } = script[scriptIdx];
    const t = setTimeout(() => {
      const name = guestName.trim() || "하객";
      setMessages((prev) => [...prev, text.replace(/{name}/g, name)]);
      setScriptIdx((i) => i + 1);
    }, delay);
    return () => clearTimeout(t);
  }, [phase, scriptIdx, guestName, script]);

  // Auto-scroll messages
  useEffect(() => {
    msgsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // End screen auto-dismiss
  useEffect(() => {
    if (phase !== "ended") return;
    const t = setTimeout(onEnd, 1800);
    return () => clearTimeout(t);
  }, [phase, onEnd]);

  const answerCall = () => {
    setPhase("connected");
    setTimeout(() => setPhase("name"), 400);
  };

  const declineCall = () => {
    onEnd();
  };

  const submitName = () => {
    if (!guestName.trim()) return;
    setScript(getScript(guestName));
    setNameSubmitted(true);
    setTimeout(() => setPhase("talking"), 400);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  // Ringing screen
  if (phase === "ringing") {
    return (
      <div className="call-screen ringing">
        <div className="call-top">
          <div className="call-caller-label">수신 전화</div>
          <div className="call-caller-name">창민 & 수진</div>
          <div className="call-caller-sub">대한민국</div>
        </div>
        <div className="call-bottom">
          <div className="call-actions-ring">
            <button className="call-btn-round decline" onClick={declineCall}>
              <span className="call-icon-phone rotated"><svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z" fill="#fff"/></svg></span>
            </button>
            <button className="call-btn-round accept" onClick={answerCall}>
              <span className="call-icon-phone"><svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z" fill="#fff"/></svg></span>
            </button>
          </div>
          <div className="call-labels-ring">
            <span>거절</span>
            <span>수락</span>
          </div>
        </div>
      </div>
    );
  }

  // Connected (brief transition)
  if (phase === "connected") {
    return (
      <div className="call-screen connected">
        <div className="call-top">
          <div className="call-caller-name">창민 & 수진</div>
          <div className="call-status">연결 중...</div>
        </div>
      </div>
    );
  }

  // Name input (ARS)
  if (phase === "name") {
    return (
      <div className="call-screen in-call">
        <div className="call-top">
          <div className="call-caller-name">창민 & 수진</div>
          <div className="call-status">{formatTime(callTime)}</div>
        </div>
        <div className="call-ars">
          <div className="ars-bubble fade-in">
            안녕하세요! 이창민 & 박수진 결혼식 보이는 ARS입니다.
          </div>
          <div
            className="ars-bubble fade-in"
            style={{ animationDelay: "0.8s" }}
          >
            성함을 입력해주세요.
          </div>
          <div
            className="ars-input-wrap fade-in"
            style={{ animationDelay: "1.5s" }}
          >
            <input
              className="ars-input"
              placeholder="이름 입력"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              maxLength={10}
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && submitName()}
            />
            <button
              className="ars-submit"
              onClick={submitName}
              disabled={!guestName.trim()}
            >
              확인
            </button>
          </div>
        </div>
        <div className="call-bottom-bar">
          <button className="call-btn-round decline small" onClick={onEnd}>
            <span className="call-icon-phone rotated"><svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z" fill="#fff"/></svg></span>
          </button>
        </div>
      </div>
    );
  }

  // Talking / ended
  return (
    <div className="call-screen in-call">
      <div className="call-top">
        <div className="call-caller-name">창민 & 수진</div>
        <div className="call-status">
          {phase === "ended" ? "통화 종료" : formatTime(callTime)}
        </div>
      </div>
      <div className="call-messages">
        {messages.map((msg, i) => (
          <div key={i} className="call-msg fade-in">
            <div className="call-msg-bubble">{msg}</div>
          </div>
        ))}
        <div ref={msgsEndRef} />
      </div>
      {phase === "ended" ? (
        <div className="call-ended-wrap fade-in">
          <div className="call-ended-text">통화가 종료되었습니다</div>
        </div>
      ) : (
        <div className="call-bottom-bar">
          <button
            className="call-btn-round decline small"
            onClick={() => setPhase("ended")}
          >
            <span className="call-icon-phone rotated"><svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z" fill="#fff"/></svg></span>
          </button>
        </div>
      )}
    </div>
  );
}
