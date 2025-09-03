import React from "react";
import { api } from "../api";

function daysLeft(d) {
    const ms = new Date(d) - new Date();
    return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export default function Borrow() {
    const [items, setItems] = React.useState([]);
    const [bookId, setBookId] = React.useState("");
    const [days, setDays] = React.useState(10);
    const [loading, setLoading] = React.useState(true);

    const load = async () => {
        try {
            setLoading(true);
            const res = await api.borrow.my();
            setItems(res.items || []);
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    React.useEffect(() => { load(); }, []);

    const create = async () => {
        if (!bookId) return alert("bookId required");
        try {
            const dueAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
            await api.borrow.create(bookId, dueAt);
            setBookId(""); setDays(10);
            await load();
            alert("Borrow created");
        } catch (e) { alert(e.message || "Failed"); }
    };

    const extend = async (id) => {
        try {
            const rec = items.find(x => x._id === id);
            const newDue = new Date(new Date(rec.dueAt).getTime() + 5 * 24 * 60 * 60 * 1000).toISOString();
            await api.borrow.extend(id, newDue);
            await load();
            alert("Extended 5 days");
        } catch (e) { alert(e.message || "Failed"); }
    };

    return (
        <div className="page">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h2>Borrowed Books & Alerts</h2>
                    <div className="muted">Create demo borrow or view active items</div>
                </div>
            </div>

            <div className="cards" style={{ marginTop: 12 }}>
                <div className="card span-6">
                    <h2>Create Borrow (demo)</h2>
                    <div className="row" style={{ marginTop: 8 }}>
                        <input className="input" placeholder="Book ID (e.g., b1)" value={bookId} onChange={e => setBookId(e.target.value)} />
                        <input className="input" type="number" value={days} onChange={e => setDays(Number(e.target.value))} />
                        <div className="muted">days</div>
                        <button className="btn" onClick={create}>Create</button>
                    </div>
                </div>

                <div className="card span-6">
                    <h2>My Items</h2>
                    <div className="table-wrap">
                        <table className="table">
                            <thead><tr><th>Title</th><th>Due</th><th>Days Left</th><th>Status</th><th></th></tr></thead>
                            <tbody>
                                {items.map(i => {
                                    const d = daysLeft(i.dueAt);
                                    return (
                                        <tr key={i._id}>
                                            <td>{i.book?.title}</td>
                                            <td>{new Date(i.dueAt).toDateString()}</td>
                                            <td style={{ color: d < 0 ? "#ff7b7b" : d <= 3 ? "#f5b56a" : "#9fe7be" }}>{d}</td>
                                            <td>{i.status}</td>
                                            <td>{i.status === "active" ? <button className="btn" onClick={() => extend(i._id)}>Extend +5d</button> : null}</td>
                                        </tr>
                                    );
                                })}
                                {items.length === 0 && <tr><td colSpan="5" className="muted">No active items.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}