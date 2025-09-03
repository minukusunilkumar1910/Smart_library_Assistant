import React from "react";
import "./Blueprint.css";
import mapImg from "../assets/lb.png"; // your PNG blueprint

// Default zones with calibrated center points
const defaultZones = [
    { id: "maths", name: "Maths Section", category: "Maths", point: { x: 0.20, y: 0.15 } },
    { id: "physics", name: "Physics Section", category: "Physics", point: { x: 0.50, y: 0.15 } },
    { id: "ds", name: "Data Structures", category: "Data Structures", point: { x: 0.80, y: 0.15 } },
    { id: "ai", name: "AI / ML", category: "AI / ML", point: { x: 0.35, y: 0.30 } },
    { id: "cn", name: "Computer Networks", category: "Computer Networks", point: { x: 0.65, y: 0.30 } },
    { id: "electronics", name: "Electronics", category: "Electronics", point: { x: 0.50, y: 0.45 } },
    { id: "general", name: "General Section", category: "General", point: { x: 0.75, y: 0.60 } },
    { id: "desk", name: "Librarian Desk", category: "Desk", point: { x: 0.25, y: 0.75 } },
    { id: "entrance", name: "Entrance", category: "Entrance", point: { x: 0.18, y: 0.88 } },
    { id: "stairs", name: "Stairs", category: "Stairs", point: { x: 0.80, y: 0.85 } },
];

export default function Blueprint({ highlight }) {
    return (
        <div className="bp-wrap">
            <div className="bp-container">
                <img src={mapImg} alt="Library Map" className="bp-img" />
                {highlight && (
                    <div
                        className="marker ripple"
                        style={{
                            left: `${highlight.x * 100}%`,
                            top: `${highlight.y * 100}%`,
                        }}
                    >
                        <span className="marker-label">{highlight.label}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export { defaultZones };