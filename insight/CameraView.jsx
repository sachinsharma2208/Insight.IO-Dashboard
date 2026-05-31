import "./CameraView.css";

export default function CameraView({ onMapClick, goal }) {
  return (
    <div className="cameraview">
      {/* Full screen video */}
      <video
        src="/camera.mp4"
        autoPlay loop muted playsInline
        className="camera-video"
        onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
      />
      <div className="camera-placeholder">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" width="48" height="48" style={{color:'var(--text2)'}}>
          <path d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>
        </svg>
        <span style={{color:'var(--text2)', fontFamily:'var(--mono)', fontSize:'12px'}}>
          Add camera.mp4 to public/ folder
        </span>
      </div>

      {/* Scan line overlay */}
      <div className="scan-overlay" />

      {/* Corner brackets (HUD feel) */}
      <div className="hud-corner tl" />
      <div className="hud-corner tr" />
      <div className="hud-corner bl" />
      <div className="hud-corner br" />

      {/* HUD info */}
      <div className="cam-hud-top">
        <div className="hud-pill">
          <span className="hud-dot" />
          LIVE FEED
        </div>
        <div className="hud-pill">CAM 01 — FRONT</div>
        <div className="hud-pill">
          <span style={{color:'var(--accent)', fontFamily:'var(--mono)', fontSize:'10px'}}>
            {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Map minimap */}
      <div className="minimap" onClick={onMapClick}>
        <canvas
          className="minimap-canvas"
          width={200} height={140}
          ref={canvas => {
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            ctx.fillStyle = "#c8c8c8";
            ctx.fillRect(0, 0, 200, 140);
            ctx.strokeStyle = "#111";
            ctx.lineWidth = 3;
            ctx.strokeRect(10, 8, 180, 124);
            const rooms = [
              {x:20,y:18,w:60,h:40},{x:100,y:18,w:70,h:36},
              {x:20,y:68,w:48,h:54},{x:90,y:76,w:84,h:44},
            ];
            rooms.forEach(r => {
              ctx.fillStyle = "rgba(220,80,80,0.18)";
              ctx.fillRect(r.x, r.y, r.w, r.h);
              ctx.strokeStyle = "#333"; ctx.lineWidth = 1;
              ctx.strokeRect(r.x, r.y, r.w, r.h);
            });
            // Robot dot
            ctx.fillStyle = "#00d4ff";
            ctx.beginPath(); ctx.arc(95, 78, 5, 0, Math.PI*2); ctx.fill();
            // Goal dot
            if (goal) {
              ctx.fillStyle = "#ff6b35";
              ctx.beginPath();
              ctx.arc(goal.x * 200, goal.y * 140, 4, 0, Math.PI*2);
              ctx.fill();
            }
          }}
        />
        <div className="minimap-label">Click to enter map view</div>
      </div>

      {/* Telemetry overlay bottom */}
      <div className="cam-telemetry">
        <div className="telem-item">
          <span className="telem-label">SPEED</span>
          <span className="telem-val">0.8 m/s</span>
        </div>
        <div className="telem-item">
          <span className="telem-label">HEADING</span>
          <span className="telem-val">127°</span>
        </div>
        <div className="telem-item">
          <span className="telem-label">OBSTACLE</span>
          <span className="telem-val" style={{color:'var(--green)'}}>CLEAR</span>
        </div>
        {goal && (
          <div className="telem-item">
            <span className="telem-label">GOAL DIST</span>
            <span className="telem-val" style={{color:'var(--accent2)'}}>4.2 m</span>
          </div>
        )}
      </div>
    </div>
  );
}
