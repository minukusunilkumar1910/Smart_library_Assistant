import React from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import "./Dashboard.css";


export default function Dashboard() {
    const [seats, setSeats] = React.useState([]);
    const [borrows, setBorrows] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const [sResp, bResp] = await Promise.allSettled([
                    api.seats.status(),
                    api.borrow.my(),
                ]);
                if (!mounted) return;
                if (sResp.status === "fulfilled") setSeats(sResp.value.seats || []);
                if (bResp.status === "fulfilled") setBorrows(bResp.value.items || []);
            } catch (e) {
                console.error(e);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => (mounted = false);
    }, []);

    const total = seats.length;
    const available = seats.filter((s) => s.status === "available").length;
    const occupied = seats.filter((s) => s.status === "occupied").length;
    const reserved = seats.filter((s) => s.status === "reserved").length;

    const dueSoon = borrows.filter((b) => {
        const diff = (new Date(b.dueAt) - new Date()) / (1000 * 60 * 60 * 24);
        return diff <= 3 && diff > 0;
    }).length;

    return (
        <div className="dashboard-page">
            {/* Header */}
            <header className="dashboard-header">
                <div>
                    <h1>📚 Smart Library Assistant</h1>
                    <p>Reserve seats, search books & manage borrows — all in one app.</p>
                </div>
            </header>

            {/* Cards */}
            <div className="cards">
                {/* Seat Availability */}
                <div className="card">
                    <h2>Seat Availability</h2>
                    <p className="muted">Quick summary</p>
                    <div className="card-value">
                        {loading ? "..." : `${available} / ${total}`}
                    </div>
                    <div className="muted-small">
                        Reserved: {reserved} · Occupied: {occupied}
                    </div>
                    <Link to="/seats">
                        <button className="btn">View Seats</button>
                    </Link>
                </div>

                {/* My Borrows */}
                <div className="card">
                    <h2>My Borrows</h2>
                    <p className="muted">Active books</p>
                    <div className="card-value">{loading ? "..." : borrows.length}</div>
                    <Link to="/borrow">
                        <button className="btn">View Borrows</button>
                    </Link>
                </div>

                {/* Alerts */}
                <div className="card">
                    <h2>Alerts</h2>
                    <p className="muted">Due in 3 days</p>
                    <div className="card-value">{loading ? "..." : dueSoon}</div>
                    <Link to="/borrow">
                        <button className="btn">Manage Alerts</button>
                    </Link>
                </div>

                {/* Book Search */}
                <div className="card">
                    <h2>Book Search</h2>
                    <p className="muted">Find books by title, author or category</p>
                    <div className="card-value">🔍</div>
                    <Link to="/books">
                        <button className="btn">Search Books</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}