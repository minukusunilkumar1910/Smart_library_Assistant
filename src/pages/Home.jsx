import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>📚 Smart Library Application</h1>
            <p>Select a feature:</p>
            <div style={{ marginTop: "20px" }}>
                <Link to="/seats"><button>Seat Booking</button></Link>
                <br /><br />
                <Link to="/books"><button>Book Search</button></Link>
                <br /><br />
                <Link to="/borrowed"><button>Borrowed Books</button></Link>
            </div>
        </div>
    );
}