import { useRef, useState, useEffect, useCallback } from "react";
import * as THREE from "three";
import { PCDLoader } from "three/addons/loaders/PCDLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import "./MapView.css";

export default function MapView({ goal, setGoal, onCameraClick, viewMode, onViewModeToggle }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const goalMarkerRef = useRef(null);
  const animFrameRef = useRef(null);
  const pointsRef = useRef(null);

  const [zoom, setZoom] = useState(50);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [pointCount, setPointCount] = useState(0);
  const [goalFlash, setGoalFlash] = useState(false);
  const [camPos, setCamPos] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const w = mount.clientWidth;
    const h = mount.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d1117);
    sceneRef.current = scene;

    // Grid
    const grid = new THREE.GridHelper(10, 20, 0x1c2230, 0x161b22);
    scene.add(grid);

    // Axes
    const axes = new THREE.AxesHelper(0.5);
    scene.add(axes);

    // Camera
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.001, 1000);
    camera.position.set(0, 1.5, 3);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = true;
    controls.minDistance = 0.1;
    controls.maxDistance = 20;
    controlsRef.current = controls;

    // Load PCD
    const loader = new PCDLoader();
    loader.load(
      "/bunny.pcd",
      (points) => {
        points.geometry.computeBoundingBox();
        const box = points.geometry.boundingBox;
        const center = new THREE.Vector3();
        box.getCenter(center);
        points.geometry.translate(-center.x, -center.y, -center.z);

        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3 / maxDim;
        points.scale.setScalar(scale);

        // Height-based coloring: cyan bottom → white top
        const positions = points.geometry.attributes.position;
        const colors = new Float32Array(positions.count * 3);
        const minY = box.min.y, rangeY = (box.max.y - box.min.y) || 1;
        for (let i = 0; i < positions.count; i++) {
          const t = (positions.getY(i) - minY) / rangeY;
          colors[i * 3]     = 0.1 + t * 0.9;
          colors[i * 3 + 1] = 0.6 + t * 0.4;
          colors[i * 3 + 2] = 1.0;
        }
        points.geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        points.material = new THREE.PointsMaterial({
          size: 0.008,
          vertexColors: true,
          sizeAttenuation: true,
        });

        scene.add(points);
        pointsRef.current = points;
        setPointCount(positions.count);
        setLoading(false);
        camera.position.set(0, 1.5, 3);
        controls.target.set(0, 0, 0);
        controls.update();
      },
      undefined,
      () => {
        // Fallback: generate demo point cloud
        setLoadError(true);
        setLoading(false);
        const count = 10000;
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
          const theta = Math.random() * Math.PI * 2;
          const r = Math.random() * 2;
          pos[i*3]   = r * Math.cos(theta);
          pos[i*3+1] = Math.random() * 2 - 0.5;
          pos[i*3+2] = r * Math.sin(theta);
          const t = (pos[i*3+1] + 0.5) / 2;
          col[i*3]   = 0.1 + t * 0.9;
          col[i*3+1] = 0.6 + t * 0.4;
          col[i*3+2] = 1.0;
        }
        geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
        const mat = new THREE.PointsMaterial({ size: 0.015, vertexColors: true });
        const pts = new THREE.Points(geo, mat);
        scene.add(pts);
        pointsRef.current = pts;
        setPointCount(count);
      }
    );

    // Animate
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      controls.update();
      const p = camera.position;
      setCamPos({ x: p.x.toFixed(1), y: p.y.toFixed(1), z: p.z.toFixed(1) });
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth, h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animFrameRef.current);
      controls.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  // Click → raycast → goal marker
  const handleClick = useCallback((e) => {
    const mount = mountRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    if (!mount || !scene || !camera) return;

    const rect = mount.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    let hitPoint = null;
    if (pointsRef.current) {
      raycaster.params.Points = { threshold: 0.05 };
      const hits = raycaster.intersectObject(pointsRef.current);
      if (hits.length > 0) hitPoint = hits[0].point.clone();
    }
    if (!hitPoint) {
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      hitPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, hitPoint);
    }
    if (!hitPoint) return;

    // Remove old marker
    if (goalMarkerRef.current) scene.remove(goalMarkerRef.current);

    const group = new THREE.Group();
    group.position.copy(hitPoint);

    // Pole
    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.004, 0.004, 0.5, 8),
      new THREE.MeshBasicMaterial({ color: 0xff6b35 })
    );
    pole.position.y = 0.25;
    group.add(pole);

    // Sphere
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xff6b35 })
    );
    sphere.position.y = 0.52;
    group.add(sphere);

    // Base ring
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.1, 0.15, 32),
      new THREE.MeshBasicMaterial({ color: 0xff6b35, side: THREE.DoubleSide })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.002;
    group.add(ring);

    // Outer ring (larger, faded)
    const ring2 = new THREE.Mesh(
      new THREE.RingGeometry(0.18, 0.2, 32),
      new THREE.MeshBasicMaterial({ color: 0xff6b35, side: THREE.DoubleSide, opacity: 0.4, transparent: true })
    );
    ring2.rotation.x = -Math.PI / 2;
    ring2.position.y = 0.001;
    group.add(ring2);

    scene.add(group);
    goalMarkerRef.current = group;

    setGoal({ x: hitPoint.x.toFixed(2), y: hitPoint.y.toFixed(2), z: hitPoint.z.toFixed(2) });
    setGoalFlash(true);
    setTimeout(() => setGoalFlash(false), 600);
  }, [setGoal]);

  // Zoom slider
  useEffect(() => {
    const controls = controlsRef.current;
    const camera = cameraRef.current;
    if (!controls || !camera) return;
    const dist = 0.5 + (100 - zoom) * 0.18;
    const dir = camera.position.clone().sub(controls.target).normalize();
    camera.position.copy(controls.target.clone().add(dir.multiplyScalar(dist)));
    controls.update();
  }, [zoom]);

  // Handle 2D/3D mode switch
  useEffect(() => {
    const controls = controlsRef.current;
    const camera = cameraRef.current;
    if (!controls || !camera) return;

    if (viewMode === "map2d") {
      // Top down view
      const dist = camera.position.distanceTo(controls.target);
      camera.position.set(controls.target.x, controls.target.y + dist, controls.target.z);
      controls.maxPolarAngle = 0; // Lock to top-down
      controls.minPolarAngle = 0;
      controls.enableRotate = false;
    } else {
      // 3D view
      controls.maxPolarAngle = Math.PI;
      controls.minPolarAngle = 0;
      controls.enableRotate = true;
      // Offset camera slightly if it was pure top-down
      if (camera.position.x === controls.target.x && camera.position.z === controls.target.z) {
        const dist = camera.position.distanceTo(controls.target);
        camera.position.set(controls.target.x, controls.target.y + dist * 0.7, controls.target.z + dist * 0.7);
      }
    }
    controls.update();
  }, [viewMode]);

  return (
    <div className="mapview">
      <div
        ref={mountRef}
        className="map-canvas-wrap"
        onClick={handleClick}
        style={{ cursor: "crosshair", width: "100%", height: "100%" }}
      />

      {loading && (
        <div className="pcd-loading">
          <div className="pcd-spinner" />
          <span>Loading point cloud...</span>
        </div>
      )}

      <div className="map-hud-tl">
        <span className="hud-tag" style={{ cursor: "pointer", userSelect: "none" }} onClick={onViewModeToggle}>
          {viewMode === "map2d" ? "2D MAP VIEW (Click for 3D)" : "3D MAP VIEW (Click for 2D)"}
        </span>
        {!loading && (
          <span className="hud-tag" style={{ color: "var(--accent)" }}>
            {pointCount.toLocaleString()} pts
          </span>
        )}
        {loadError && (
          <span className="hud-tag" style={{ color: "var(--yellow)" }}>
            ⚠ demo cloud (add bunny.pcd to public/)
          </span>
        )}
      </div>

      <div className="map-hud-br">
        <span className="hud-tag mono">CAM  X:{camPos.x}  Y:{camPos.y}  Z:{camPos.z}</span>
      </div>

      <div className="map-controls-hint">
        <span>Left drag: rotate &nbsp;·&nbsp; Right drag: pan &nbsp;·&nbsp; Scroll: zoom &nbsp;·&nbsp; Click: set goal</span>
      </div>

      {goal && (
        <div className={`goal-coords ${goalFlash ? "flash" : ""}`}>
          <span className="coords-label">GOAL SET</span>
          <span className="coords-val">X: {goal.x}m</span>
          <span className="coords-val">Y: {goal.y}m</span>
          <span className="coords-val">Z: {goal.z}m</span>
        </div>
      )}

      <div className="zoom-slider">
        <button onClick={() => setZoom(z => Math.min(z + 10, 100))}>+</button>
        <input
          type="range" min="0" max="100" value={zoom}
          onChange={e => setZoom(Number(e.target.value))}
          className="slider-vertical"
          style={{ writingMode: "vertical-lr", direction: "rtl", height: "100px" }}
        />
        <button onClick={() => setZoom(z => Math.max(z - 10, 0))}>−</button>
      </div>

      <div className="camera-thumb" onClick={onCameraClick}>
        <video
          src="/camera.mp4" autoPlay loop muted playsInline className="thumb-video"
          onError={e => { e.target.style.display="none"; e.target.nextSibling.style.display="flex"; }}
        />
        <div className="thumb-placeholder" style={{ display:"none" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
            <path d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>
          </svg>
          <span>No video</span>
        </div>
        <div className="thumb-overlay">Click to enter camera view</div>
      </div>
    </div>
  );
}
