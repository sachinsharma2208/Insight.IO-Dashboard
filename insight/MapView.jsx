import { useRef, useState, useEffect } from "react";
import "./MapView.css";

// Draw a simple warehouse floor plan on canvas
function drawFloorPlan(ctx, w, h) {
  ctx.clearRect(0, 0, w, h);

  // Background
  ctx.fillStyle = "#c8c8c8";
  ctx.fillRect(0, 0, w, h);

  // Outer walls
  ctx.strokeStyle = "#111";
  ctx.lineWidth = 6;
  ctx.strokeRect(60, 40, w - 120, h - 80);

  // Inner rooms (pink fill = explored/mapped areas)
  const rooms = [
    { x: 120, y: 80, w: 180, h: 120 },
    { x: 340, y: 80, w: 220, h: 100 },
    { x: 120, y: 240, w: 140, h: 160 },
    { x: 300, y: 260, w: 260, h: 140 },
    { x: 180, y: 430, w: 200, h: 80 },
  ];

  rooms.forEach(r => {
    ctx.fillStyle = "rgba(220, 80, 80, 0.18)";
    ctx.fillRect(r.x, r.y, r.w, r.h);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.strokeRect(r.x, r.y, r.w, r.h);
  });

  // Corridors
  ctx.fillStyle = "#ddd";
  ctx.fillRect(300, 80, 40, 160);
  ctx.fillRect(260, 220, 40, 60);

  // Obstacles (black dots = point cloud hits)
  const obstacles = [
    {x:150,y:160},{x:170,y:165},{x:200,y:155},{x:380,y:130},{x:400,y:120},
    {x:450,y:135},{x:320,y:300},{x:350,y:310},{x:280,y:350},{x:420,y:340},
    {x:460,y:360},{x:480,y:330},{x:200,y:290},{x:220,y:300},{x:180,y:310},
    {x:500,y:100},{x:520,y:110},{x:540,y:95},{x:150,y:460},{x:200,y:450},
    {x:240,y:470},{x:300,y:400},{x:340,y:390}
  ];
  obstacles.forEach(o => {
    ctx.fillStyle = "#111";
    ctx.beginPath();
    ctx.arc(o.x, o.y, 3, 0, Math.PI * 2);
    ctx.fill();
  });
}

export default function MapView({ goal, setGoal, onCameraClick }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [robotPos] = useState({ x: 0.45, y: 0.52 }); // normalized
  const [zoom, setZoom] = useState(50);
  const [goalFlash, setGoalFlash] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { width: w, height: h } = canvas;
    drawFloorPlan(ctx, w, h);
  }, []);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setGoal({ x, y });
    setGoalFlash(true);
    setTimeout(() => setGoalFlash(false), 600);
  };

  return (
    <div className="mapview" ref={containerRef}>
      {/* Map canvas */}
      <div className="map-canvas-wrap" onClick={handleCanvasClick}>
        <canvas
          ref={canvasRef}
          className="map-canvas"
          width={680}
          height={560}
        />

        {/* Robot icon */}
        <div
          className="robot-marker"
          style={{ left: `${robotPos.x * 100}%`, top: `${robotPos.y * 100}%` }}
        >
          <div className="robot-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7H3a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2zM7.58 9.96C8.5 8.77 10.14 8 12 8s3.5.77 4.42 1.96L7.58 9.96zM3 15v4a1 1 0 001 1h16a1 1 0 001-1v-4H3zm6.5 1h5a.5.5 0 010 1h-5a.5.5 0 010-1z"/>
            </svg>
          </div>
          <div className="robot-pulse" />
        </div>

        {/* Goal marker */}
        {goal && (
          <div
            className={`goal-marker ${goalFlash ? "flash" : ""}`}
            style={{ left: `${goal.x * 100}%`, top: `${goal.y * 100}%` }}
          >
            <div className="goal-ring" />
            <div className="goal-dot" />
            <span className="goal-label">GOAL</span>
          </div>
        )}

        {/* Click hint */}
        {!goal && (
          <div className="click-hint">Click anywhere on map to set navigation goal</div>
        )}
      </div>

      {/* Zoom slider */}
      <div className="zoom-slider">
        <button onClick={() => setZoom(z => Math.min(z + 10, 100))}>+</button>
        <input
          type="range" min="0" max="100"
          value={zoom} onChange={e => setZoom(Number(e.target.value))}
          className="slider-vertical"
          orient="vertical"
        />
        <button onClick={() => setZoom(z => Math.max(z - 10, 0))}>−</button>
      </div>

      {/* Camera thumbnail */}
      <div className="camera-thumb" onClick={onCameraClick}>
        <video
          src="/camera.mp4"
          autoPlay loop muted playsInline
          className="thumb-video"
          onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
        />
        <div className="thumb-placeholder" style={{display:'none'}}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
            <path d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>
          </svg>
          <span>No video</span>
        </div>
        <div className="thumb-overlay">Click to enter camera view</div>
      </div>

      {/* Goal coords display */}
      {goal && (
        <div className="goal-coords">
          <span className="coords-label">GOAL SET</span>
          <span className="coords-val">X: {(goal.x * 10).toFixed(2)}m</span>
          <span className="coords-val">Y: {(goal.y * 10).toFixed(2)}m</span>
        </div>
      )}
    </div>
  );
}
