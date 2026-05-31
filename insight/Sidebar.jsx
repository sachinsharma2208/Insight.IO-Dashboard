import "./Sidebar.css";

const icons = [
  { id: "dashboard", svg: "M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 5h2v-2h-2v-2h-2v2h-2v2h2v2h2v-2z" },
  { id: "map", svg: "M9 3L3 6.5v14l6-3.5 6 3.5 6-3.5v-14L15 10.5 9 7V3zm0 2.31l6 3.5v8.88l-6-3.5V5.31zM3 8.19l4.5-2.62v8.88L3 17.07V8.19zm12 8.88V8.19l4.5 2.62v8.88L15 17.07z" },
  { id: "location", svg: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" },
  { id: "waypoint", svg: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" },
  { id: "clock", svg: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" },
  { id: "analytics", svg: "M3.5 18.5l4-8 4 3 4-6.5 4 11.5" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span>ERIC</span>
      </div>
      <nav className="sidebar-nav">
        {icons.map((icon, i) => (
          <button key={icon.id} className={`nav-btn ${i === 0 ? "active" : ""}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d={icon.svg} />
            </svg>
          </button>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <button className="nav-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/>
          </svg>
        </button>
      </div>
    </aside>
  );
}
