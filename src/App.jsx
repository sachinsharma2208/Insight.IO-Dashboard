import { useState } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import MapView from "./components/MapView";
import CameraView from "./components/CameraView";
import ControlPanel from "./components/ControlPanel";
import "./App.css";

export default function App() {
  const [view, setView] = useState("map");
  const [mode, setMode] = useState("AUTO");
  const [goal, setGoal] = useState(null);
  const [status] = useState({
    mission: "On Mission 1234",
    battery: 100,
    signal: "Strong",
    failsafe: "Okay",
    system: "Okay",
  });

  return (
    <div className="app">
      <Sidebar activeId={view} setActiveId={setView} />
      <div className="main">
        <TopBar
          status={status}
          mode={mode}
          setMode={setMode}
          view={view}
          setView={setView}
          goal={goal}
        />
        <div className="content">
          {view === "map" || view === "map2d" ? (
            <MapView goal={goal} setGoal={setGoal} onCameraClick={() => setView("camera")} viewMode={view} onViewModeToggle={() => setView(view === "map" ? "map2d" : "map")} />
          ) : view === "camera" ? (
            <CameraView onMapClick={() => setView("map")} goal={goal} />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: '24px' }}>
              {view.charAt(0).toUpperCase() + view.slice(1)} View Placeholder
            </div>
          )}
          <ControlPanel />
        </div>
      </div>
    </div>
  );
}
