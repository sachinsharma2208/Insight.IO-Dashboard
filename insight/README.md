# Insight.IO — ERIC Robotics Dashboard

A fully functional robotics monitoring dashboard implementing the Insight.IO design. Built with React + Vite.

## Features

- **Map View** — 2D occupancy grid floor plan with click-to-set navigation goal
- **Camera View** — Live robot camera feed with HUD overlay and telemetry
- **Goal Marker** — Click anywhere on the map to place a navigation goal (shows coordinates)
- **Emergency Stop** — Animated E-Stop button
- **WASD Controller** — Keyboard + clickable directional controls
- **Mode Toggle** — AUTO / MANUAL switching
- **Status Bar** — Battery, signal, failsafe, system status

## Setup

```bash
# Install dependencies
npm install

# Add your video file (optional)
# Put any .mp4 file in public/ folder and name it camera.mp4

# Run locally
npm run dev
```

Open `http://localhost:5173` in your browser.

## Usage

- **Map View**: Click anywhere on the floor plan to set a navigation goal
- **Camera/Map toggle**: Click the view button in the top bar, or click the thumbnail
- **WASD**: Use keyboard keys W/A/S/D or click the on-screen buttons to control
- **Emergency Stop**: Click the red/yellow button (toggles active state)
- **Mode**: Click AUTO or MANUAL to switch modes

## Tech Stack

- **React 18** + **Vite** — Frontend framework and build tool
- **HTML5 Canvas** — 2D floor plan rendering
- **CSS animations** — Robot pulse, goal marker, scan lines
- Pure CSS/JS — No heavy 3D dependencies needed for 2D map

## Project Structure

```
src/
  App.jsx            # Root component, state management
  components/
    Sidebar.jsx      # Left navigation bar
    TopBar.jsx       # Status bar + controls
    MapView.jsx      # 2D floor plan + goal setting
    CameraView.jsx   # Camera feed + minimap
    ControlPanel.jsx # E-Stop + WASD joystick
public/
  camera.mp4         # (add your own video here)
  bunny.pcd          # Sample point cloud
```

## Architecture Decisions

- Used **HTML5 Canvas** for the floor plan instead of a heavy 3D library — keeps it lightweight and fast
- **Normalized coordinates** for goal position (0–1 range) so they work across any screen size
- **CSS-only animations** for the robot pulse, goal marker, and scan line overlay
- Video gracefully degrades if no file is present (shows placeholder)
