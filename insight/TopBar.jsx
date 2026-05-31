import "./TopBar.css";

export default function TopBar({ status, mode, setMode, view, setView, goal }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="status-pill">
          <span className="status-label">Status</span>
          <span className="status-value">{status.mission}</span>
          <button className="pause-btn">
            <svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10">
              <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
            </svg>
          </button>
        </div>
        <button className="quick-goal-btn">
          QUICK GOAL
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

      <div className="topbar-center">
        <div className="status-indicators">
          <div className="indicator">
            <div className="battery-bar">
              <div className="battery-fill" style={{ width: `${status.battery}%` }} />
            </div>
            <span className="ind-value">{status.battery}%</span>
          </div>
          <div className="divider" />
          <div className="indicator">
            <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12" style={{color:'var(--green)'}}>
              <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
            </svg>
            <span className="ind-value">{status.signal}</span>
          </div>
          <div className="divider" />
          <div className="indicator">
            <span className="ind-label">Failsafe</span>
            <span className="ind-okay">{status.failsafe} <span className="dot green" /></span>
          </div>
          <div className="divider" />
          <div className="indicator">
            <span className="ind-label">System</span>
            <span className="ind-okay">{status.system} <span className="dot green" /></span>
          </div>
        </div>

        <button className="view-toggle" onClick={() => setView(view === "map" ? "camera" : "map")}>
          {view === "map" ? "Map View" : "Camera View"}
        </button>
      </div>

      <div className="topbar-right">
        <div className="mode-group">
          <span className="mode-label">MODE</span>
          <div className="mode-toggle">
            <button className={mode === "AUTO" ? "active" : ""} onClick={() => setMode("AUTO")}>AUTO</button>
            <button className={mode === "MANUAL" ? "active" : ""} onClick={() => setMode("MANUAL")}>MANUAL</button>
          </div>
        </div>
        <button className="initiate-btn">
          INITIATE
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </header>
  );
}
