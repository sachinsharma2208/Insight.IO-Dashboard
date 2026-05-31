#!/bin/bash
# Run this from ~/Desktop/insight-dashboard

echo "📁 Setting up Insight.IO dashboard files..."

SRC_DIR="$(dirname "$0")"
DEST="$HOME/Desktop/insight-dashboard/src"
COMP="$DEST/components"

mkdir -p "$COMP"

# Copy main files
cp "$SRC_DIR/App.jsx" "$DEST/App.jsx"
cp "$SRC_DIR/App.css" "$DEST/App.css"
cp "$SRC_DIR/main.jsx" "$DEST/main.jsx"
cp "$SRC_DIR/index.css" "$DEST/index.css"

# Copy components
cp "$SRC_DIR/Sidebar.jsx" "$COMP/Sidebar.jsx"
cp "$SRC_DIR/Sidebar.css" "$COMP/Sidebar.css"
cp "$SRC_DIR/TopBar.jsx" "$COMP/TopBar.jsx"
cp "$SRC_DIR/TopBar.css" "$COMP/TopBar.css"
cp "$SRC_DIR/MapView.jsx" "$COMP/MapView.jsx"
cp "$SRC_DIR/MapView.css" "$COMP/MapView.css"
cp "$SRC_DIR/CameraView.jsx" "$COMP/CameraView.jsx"
cp "$SRC_DIR/CameraView.css" "$COMP/CameraView.css"
cp "$SRC_DIR/ControlPanel.jsx" "$COMP/ControlPanel.jsx"
cp "$SRC_DIR/ControlPanel.css" "$COMP/ControlPanel.css"

# Copy README
cp "$SRC_DIR/README.md" "$HOME/Desktop/insight-dashboard/README.md"

echo "✅ All files copied!"
echo "👉 Now run: cd ~/Desktop/insight-dashboard && npm run dev"
