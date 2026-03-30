export default function Navigation({ current, total, onNext, onPrev, onGoTo }) {
  return (
    <div className="nav">
      <button onClick={onPrev} disabled={current === 0}>
        이전
      </button>
      <div className="dots">
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            className={`dot ${i === current ? 'active' : ''}`}
            onClick={() => onGoTo(i)}
          />
        ))}
      </div>
      <button onClick={onNext} disabled={current === total - 1}>
        다음
      </button>
    </div>
  )
}
