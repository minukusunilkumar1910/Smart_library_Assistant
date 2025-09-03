import React from "react";
import { api } from "../api";
import Blueprint, { defaultZones } from "../components/Blueprint";
import "./books.css";

export default function Books() {
    const [q, setQ] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [results, setResults] = React.useState([]);
    const [highlight, setHighlight] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    const search = async () => {
        setLoading(true);
        try {
            // Demo: hardcoded B.Tech books, replace with api.books.search later
            const books = [
                { _id: 1, title: "Intro to Algorithms", author: "CLRS", category: "Data Structures" },
                { _id: 2, title: "Linear Algebra Done Right", author: "Axler", category: "Maths" },
                { _id: 3, title: "Fundamentals of Physics", author: "Halliday", category: "Physics" },
                { _id: 4, title: "Deep Learning", author: "Goodfellow", category: "AI / ML" },
                { _id: 5, title: "Computer Networks", author: "Tanenbaum", category: "Computer Networks" },
                { _id: 6, title: "Microelectronic Circuits", author: "Sedra/Smith", category: "Electronics" },
                { _id: 7, title: "Operating System Concepts", author: "Silberschatz", category: "General" },
            ];

            const filtered = books.filter(
                b =>
                    (!q || b.title.toLowerCase().includes(q.toLowerCase()) || b.author.toLowerCase().includes(q.toLowerCase())) &&
                    (!category || b.category.toLowerCase().includes(category.toLowerCase()))
            );
            setResults(filtered);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        search();
    }, []);

    function handleShowOnMap(cat, shelfRow, shelfColumn) {
        const zone = defaultZones.find(z => z.category === cat);
        if (!zone) return;

        const label = (shelfRow && shelfColumn) ? `Row ${shelfRow}, Col ${shelfColumn}` : zone.name;
        setHighlight({ x: zone.point.x, y: zone.point.y, label });

        setTimeout(() => setHighlight(null), 3000);
    }

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h2>Book Search & Locator</h2>
                    <div className="muted">Search, then “Show on Map” to navigate.</div>
                </div>
                <div className="search-bar">
                    <input
                        className="input"
                        placeholder="Search title or author…"
                        value={q}
                        onChange={e => setQ(e.target.value)}
                    />
                    <input
                        className="input"
                        placeholder="Category (e.g., Maths)"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                    />
                    <button className="btn" onClick={search}>Search</button>
                </div>
            </div>

            <div className="cards">
                <div className="card span-6">
                    <h2>Results</h2>
                    <div className="muted">{loading ? "Searching..." : `${results.length} found`}</div>
                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                                <tr><th>Title</th><th>Author</th><th>Category</th><th></th></tr>
                            </thead>
                            <tbody>
                                {results.map(b => (
                                    <tr key={b._id}>
                                        <td>{b.title}</td>
                                        <td>{b.author}</td>
                                        <td>{b.category}</td>
                                        <td>
                                            <button className="btn"
                                                onClick={() => handleShowOnMap(b.category, b.shelfRow, b.shelfColumn)}>
                                                Show on Map
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {results.length === 0 && <tr><td colSpan="4" className="muted">No books found.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card span-6">
                    <h2>Library Map</h2>
                    <div className="muted">Search a book and tap “Show on Map”.</div>
                    <Blueprint highlight={highlight} />
                </div>
            </div>
        </div>
    );
}