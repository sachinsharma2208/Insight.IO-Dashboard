import { useState } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import MapView from "./components/MapView";
import CameraView from "./components/CameraView";
import ControlPanel from "./components/ControlPanel";
import "./App.css";

export default function App() {
  const [view, setView] = useState("map"); // "map" | "camera"
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
      <Sidebar />
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
          {view === "map" ? (
            <MapView goal={goal} setGoal={setGoal} onCameraClick={() => setView("camera")} />
          ) : (
            <CameraView onMapClick={() => setView("map")} goal={goal} />
          )}
          <ControlPanel />
        </div>
      </div>
    </div>
  );
}
