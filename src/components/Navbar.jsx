import React from "react";
import { NavLink } from "react-router-dom";
import { getRoll, setRoll } from "../api";

export default function Navbar() {
    const [menu, setMenu] = React.useState(false);
    const [roll, setRollState] = React.useState(getRoll());

    const save = () => {
        setRoll(roll);
        setMenu(false);
    };

    return (
        <header className="navbar">
            <div className="brand">
                <div className="logo" />
                <div>SLA Library</div>
            </div>

            <button className="menu-toggle" onClick={() => setMenu(!menu)} aria-label="menu">☰</button>

            <nav className={`nav-links${menu ? " active" : ""}`}>
                <NavLink to="/dashboard" onClick={() => setMenu(false)}>Dashboard</NavLink>
                <NavLink to="/seats" onClick={() => setMenu(false)}>Seats</NavLink>
                <NavLink to="/books" onClick={() => setMenu(false)}>Books</NavLink>
                <NavLink to="/borrow" onClick={() => setMenu(false)}>Borrow</NavLink>
            </nav>

            <div className="right">
                <div className="badge">Dev</div>
                <input className="input" value={roll} onChange={e => setRollState(e.target.value)} placeholder="Roll No" />
                <button className="btn" onClick={save}>Use</button>
            </div>
        </header>
    );
}