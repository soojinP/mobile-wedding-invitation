import './V2AppShell.css'

export default function V2AppShell({ title, dark, onBack, children }) {
  return (
    <div className="iphone-frame">
      <div className="iphone-body">
        <div className={`v2-app-screen ${dark ? 'v2-dark' : ''}`}>
          <div className="v2-app-header">
            <button className="v2-back-btn" onClick={onBack}>
              <span className="back-chevron">&lsaquo;</span> 홈
            </button>
            <span className="v2-app-title">{title}</span>
            <span className="v2-app-spacer" />
          </div>
          <div className="v2-app-body">
            {children}
          </div>
          <div className="v2-app-indicator">
            <div className="indicator-bar-dark" />
          </div>
        </div>
      </div>
    </div>
  )
}
