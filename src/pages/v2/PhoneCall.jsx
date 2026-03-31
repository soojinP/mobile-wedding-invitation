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
              <span className="call-icon-phone rotated"><svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M17.6 28c-2.8 0-6.1-1.8-9.3-5s-5-6.5-5-9.3c0-1.8.9-3.4 2.4-4.2l1.8-1c1.2-.6 2.6-.2 3.3.9l1.8 2.8c.6.9.4 2.1-.4 2.8l-1 .8c-.3.2-.3.5-.2.8.5 1 1.4 2.2 2.6 3.4s2.4 2.1 3.4 2.6c.3.1.6.1.8-.2l.8-1c.7-.8 1.9-1 2.8-.4l2.8 1.8c1.1.7 1.5 2.1.9 3.3l-1 1.8c-.8 1.5-2.4 2.4-4.2 2.4z" fill="#fff"/></svg></span>
            </button>
            <button className="call-btn-round accept" onClick={answerCall}>
              <span className="call-icon-phone"><svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M17.6 28c-2.8 0-6.1-1.8-9.3-5s-5-6.5-5-9.3c0-1.8.9-3.4 2.4-4.2l1.8-1c1.2-.6 2.6-.2 3.3.9l1.8 2.8c.6.9.4 2.1-.4 2.8l-1 .8c-.3.2-.3.5-.2.8.5 1 1.4 2.2 2.6 3.4s2.4 2.1 3.4 2.6c.3.1.6.1.8-.2l.8-1c.7-.8 1.9-1 2.8-.4l2.8 1.8c1.1.7 1.5 2.1.9 3.3l-1 1.8c-.8 1.5-2.4 2.4-4.2 2.4z" fill="#fff"/></svg></span>
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
            <span className="call-icon-phone rotated"><svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M17.6 28c-2.8 0-6.1-1.8-9.3-5s-5-6.5-5-9.3c0-1.8.9-3.4 2.4-4.2l1.8-1c1.2-.6 2.6-.2 3.3.9l1.8 2.8c.6.9.4 2.1-.4 2.8l-1 .8c-.3.2-.3.5-.2.8.5 1 1.4 2.2 2.6 3.4s2.4 2.1 3.4 2.6c.3.1.6.1.8-.2l.8-1c.7-.8 1.9-1 2.8-.4l2.8 1.8c1.1.7 1.5 2.1.9 3.3l-1 1.8c-.8 1.5-2.4 2.4-4.2 2.4z" fill="#fff"/></svg></span>
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
            <span className="call-icon-phone rotated"><svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M17.6 28c-2.8 0-6.1-1.8-9.3-5s-5-6.5-5-9.3c0-1.8.9-3.4 2.4-4.2l1.8-1c1.2-.6 2.6-.2 3.3.9l1.8 2.8c.6.9.4 2.1-.4 2.8l-1 .8c-.3.2-.3.5-.2.8.5 1 1.4 2.2 2.6 3.4s2.4 2.1 3.4 2.6c.3.1.6.1.8-.2l.8-1c.7-.8 1.9-1 2.8-.4l2.8 1.8c1.1.7 1.5 2.1.9 3.3l-1 1.8c-.8 1.5-2.4 2.4-4.2 2.4z" fill="#fff"/></svg></span>
          </button>
        </div>
      )}
    </div>
  );
}
