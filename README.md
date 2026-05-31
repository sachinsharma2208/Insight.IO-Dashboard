# Insight.IO Dashboard - FSD Assignment #1

## Overview
This project is a self-hosted implementation of the ERIC Robotics Insight.IO dashboard. It accurately recreates the layout, modern aesthetics, and interactive components of the provided design. 

## Approach & Architecture
The dashboard is built using modern frontend technologies with a focus on modularity, performance, and robotics-oriented data visualization:

*   **Framework**: **React** (bootstrapped with **Vite**). React provides an excellent component-based architecture making the codebase modular and maintainable, while Vite ensures lightning-fast local development and optimal production builds.
*   **3D Point Cloud Rendering**: Used **Three.js** along with `PCDLoader`. This allows for direct, lightweight browser-based parsing and rendering of standard `.pcd` point cloud data without the overhead of external tools. The application also includes a synthetic fallback generator to ensure the interface still functions and looks great even if external `.pcd` data is missing.
*   **2D Map Fallback**: Included a top-down orthographic view feature that serves as a 2D map alternative, closely resembling how a 2D occupancy grid looks in robotics visualization.
*   **Video Streaming**: Implemented native HTML5 video for the Camera feed, supporting standard MP4 formats.
*   **Styling**: Pure CSS with CSS variables for theming, enabling the dark aesthetic, gradients, and micro-animations seen in the demo without the overhead of heavy UI libraries.

## Setup Instructions

### Prerequisites
*   [Node.js](https://nodejs.org/) (v16 or higher recommended)
*   npm or yarn

### 1. Installation
Clone or download the repository to your local machine, then navigate to the project root directory and install the dependencies:
```bash
npm install
```

### 2. Assets Configuration
To view the real sensor data instead of the synthetic fallbacks:
1.  Place a valid Point Cloud file named `bunny.pcd` (or similar) into the `public/` directory.
2.  Place your camera feed video named `camera.mp4` into the `public/` directory.

### 3. Running the Dashboard (Local Dev Server)
Start the Vite development server. This runs completely locally and fulfills the self-hosting requirement:
```bash
npm run dev
```
Open your browser and navigate to the URL provided in your terminal (usually `http://localhost:5173`).

### 4. Production Build (Optional)
To build the application for static hosting deployment:
```bash
npm run build
```
The compiled files will be output to the `dist/` folder, which can be served using any static web server (e.g., Python `http.server` or Nginx).

## Features Implemented
*   **Interactive 3D Map**: Pan, zoom, and rotate around point cloud data. Features raycasted click-to-set waypoint functionality.
*   **Dynamic Views**: Ability to swap between 3D Map, 2D Top-Down Map, and Camera views seamlessly.
*   **Responsive Sidebar**: Functional state-mapped sidebar navigation.
*   **Status Readouts**: Top bar telemetry simulation with battery and signal status.
