import React, { useEffect, useState } from "react";
import { api, getRoll } from "../api";
import "./Seats.css";

export default function Seats() {
    const [seats, setSeats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [closed, setClosed] = useState(false);

    async function loadSeats() {
        try {
            setLoading(true);
            const res = await api.seats.status();
            if (res.closed) {
                setClosed(true);
                setSeats([]);
            } else {
                setClosed(false);
                setSeats(res.seats || []);
            }
        } catch (e) {
            setError(e.message || "Failed to load seats");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadSeats();
        const t = setInterval(loadSeats, 8000); // auto-refresh every 8s
        return () => clearInterval(t);
    }, []);

    async function handleBook(seatId) {
        try {
            await api.seats.book(seatId);
            loadSeats();
        } catch (e) {
            alert(e.message);
        }
    }

    async function handleOccupy(seatId) {
        try {
            await api.seats.occupy(seatId);
            loadSeats();
        } catch (e) {
            alert(e.message);
        }
    }

    async function handleRelease(seatId) {
        try {
            await api.seats.release(seatId);
            loadSeats();
        } catch (e) {
            alert(e.message);
        }
    }

    function seatColor(status) {
        switch (status) {
            case "available":
                return "green";
            case "booked":
                return "orange";
            case "occupied":
                return "red";
            case "disabled":
                return "gray";
            default:
                return "white";
        }
    }

    return (
        <div className="page seats">
            <h2>Library Seat Booking</h2>
            {closed && <p className="alert">📢 Library is closed / under maintenance.</p>}
            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}

            <div className="seat-grid">
                {seats.map((s) => (
                    <div
                        key={s._id}
                        className="seat"
                        style={{ backgroundColor: seatColor(s.status) }}
                    >
                        <div className="label">{s.number}</div>
                        <div className="status">{s.status}</div>

                        {s.status === "available" && (
                            <button onClick={() => handleBook(s._id)}>Book</button>
                        )}

                        {s.status === "booked" && s.studentId === getRoll() && (
                            <>
                                <button onClick={() => handleOccupy(s._id)}>Occupy</button>
                                <button onClick={() => handleRelease(s._id)}>Release</button>
                            </>
                        )}

                        {s.status === "occupied" && s.studentId === getRoll() && (
                            <button onClick={() => handleRelease(s._id)}>Leave</button>
                        )}
                    </div>
                ))}
            </div>


        </div>
    );
}