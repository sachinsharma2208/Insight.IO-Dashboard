import { useState, useEffect } from "react";
import "./ControlPanel.css";

export default function ControlPanel() {
  const [pressed, setPressed] = useState({});
  const [estopActive, setEstopActive] = useState(false);

  useEffect(() => {
    const down = e => {
      const k = e.key.toLowerCase();
      if (["w","a","s","d"].includes(k)) setPressed(p => ({...p, [k]: true}));
    };
    const up = e => {
      const k = e.key.toLowerCase();
      if (["w","a","s","d"].includes(k)) setPressed(p => ({...p, [k]: false}));
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);

  return (
    <div className="control-panel">
      {/* Emergency stop */}
      <button
        className={`estop ${estopActive ? "active" : ""}`}
        onClick={() => setEstopActive(v => !v)}
        title="Emergency Stop"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
        </svg>
        <span>EMERGENCY<br/>STOP</span>
      </button>

      {/* WASD Joystick */}
      <div className="wasd">
        <div className="wasd-row">
          <div className={`wasd-key ${pressed.w ? "active" : ""}`}>W</div>
        </div>
        <div className="wasd-row">
          <div className={`wasd-key ${pressed.a ? "active" : ""}`}>A</div>
          <div className="wasd-center">
            <span>W</span>
            <span>A Key S</span>
            <span>D</span>
          </div>
          <div className={`wasd-key ${pressed.d ? "active" : ""}`}>D</div>
        </div>
        <div className="wasd-row">
          <div className={`wasd-key ${pressed.s ? "active" : ""}`}>S</div>
        </div>
        {/* Arrow buttons */}
        <div className="arrow-up">
          <button className={`arrow-btn ${pressed.w ? "active" : ""}`}
            onMouseDown={() => setPressed(p=>({...p,w:true}))}
            onMouseUp={() => setPressed(p=>({...p,w:false}))}
            onMouseLeave={() => setPressed(p=>({...p,w:false}))}>
            ▲
          </button>
        </div>
        <div className="arrow-mid">
          <button className={`arrow-btn ${pressed.a ? "active" : ""}`}
            onMouseDown={() => setPressed(p=>({...p,a:true}))}
            onMouseUp={() => setPressed(p=>({...p,a:false}))}
            onMouseLeave={() => setPressed(p=>({...p,a:false}))}>
            ◄
          </button>
          <div className="arrow-center-dot" />
          <button className={`arrow-btn ${pressed.d ? "active" : ""}`}
            onMouseDown={() => setPressed(p=>({...p,d:true}))}
            onMouseUp={() => setPressed(p=>({...p,d:false}))}
            onMouseLeave={() => setPressed(p=>({...p,d:false}))}>
            ►
          </button>
        </div>
        <div className="arrow-down">
          <button className={`arrow-btn ${pressed.s ? "active" : ""}`}
            onMouseDown={() => setPressed(p=>({...p,s:true}))}
            onMouseUp={() => setPressed(p=>({...p,s:false}))}
            onMouseLeave={() => setPressed(p=>({...p,s:false}))}>
            ▼
          </button>
        </div>
      </div>
    </div>
  );
}
