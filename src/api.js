// single-file mock API. Use VITE_USE_MOCK=1 to enable mock. 
// When backend ready, change env and replace mockHttp with real fetch calls.

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "1";
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export function getRoll() {
    return localStorage.getItem("roll") || "22A1A0000";
}
export function setRoll(v) {
    localStorage.setItem("roll", v || "");
}

async function request(path, opts = {}) {
    if (USE_MOCK) return mockHttp(path, opts);
    const headers = {
        "Content-Type": "application/json",
        "x-student-roll": getRoll(),
        ...(opts.headers || {})
    };
    const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
    if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || res.statusText);
    }
    return res.json().catch(() => ({}));
}

export const api = {
    seats: {
        status: () => request("/api/seats/status", { method: "GET" }),
        book: (seatId, endTime) =>
            request("/api/seats/book", {
                method: "POST",
                body: JSON.stringify({ seatId, endTime })
            }),
        occupy: (seatId) =>
            request("/api/seats/occupy", {
                method: "POST",
                body: JSON.stringify({ seatId })
            }),
        release: (seatId) =>
            request("/api/seats/release", {
                method: "POST",
                body: JSON.stringify({ seatId })
            }),
    },
    books: {
        search: ({ q, category } = {}) => {
            const qs = new URLSearchParams();
            if (q) qs.set("q", q);
            if (category) qs.set("category", category);
            return request(`/api/books/search?${qs.toString()}`, { method: "GET" });
        },
    },
    borrow: {
        my: () => request("/api/borrow/my", { method: "GET" }),
        create: (bookId, dueAt) =>
            request("/api/borrow", {
                method: "POST",
                body: JSON.stringify({ bookId, dueAt })
            }),
        extend: (borrowId, newDueAt) =>
            request("/api/borrow/extend", {
                method: "POST",
                body: JSON.stringify({ borrowId, newDueAt })
            }),
    },
    health: () => request("/api/health"),
};

/* ---------------- MOCK ---------------- */
let _id = 100;
const uid = () => String(_id++);

// Library state
let libraryClosed = false; // toggle true = closed/maintenance

const mockDB = {
    seats: [],
    borrows: [],
    books: [
        { _id: "b1", title: "Intro to Algorithms", author: "CLRS", category: "Data Structures", availabilityCount: 2 },
        { _id: "b2", title: "Linear Algebra Done Right", author: "Axler", category: "Maths", availabilityCount: 1 },
        { _id: "b3", title: "Fundamentals of Physics", author: "Halliday", category: "Physics", availabilityCount: 3 }
    ],
};

// Create 20 seats
if (mockDB.seats.length === 0) {
    for (let i = 1; i <= 20; i++) {
        mockDB.seats.push({
            _id: `s${i}`,
            number: `Seat ${i}`,
            status: "available",
            studentId: null,
            bookedAt: null,
        });
    }
}

// Auto-reset expired bookings (10 min)
function cleanupExpiredBookings() {
    const now = Date.now();
    mockDB.seats.forEach(seat => {
        if (seat.status === "booked" && seat.bookedAt) {
            const elapsed = (now - new Date(seat.bookedAt).getTime()) / 1000;
            if (elapsed > 600) { // 10 minutes
                seat.status = "available";
                seat.studentId = null;
                seat.bookedAt = null;
            }
        }
    });
}

function mockHttp(path, opts = {}) {
    return new Promise((resolve, reject) => {
        const ms = 150 + Math.random() * 200;
        setTimeout(() => {
            try {
                const method = (opts.method || "GET").toUpperCase();
                const roll = getRoll() || "demo";

                cleanupExpiredBookings();

                // ----------- LIBRARY CLOSED MODE ------------
                if (path === "/api/seats/status" && method === "GET") {
                    if (libraryClosed) {
                        return resolve({ closed: true, message: "Library closed for maintenance 🚧" });
                    }
                    return resolve({ seats: mockDB.seats });
                }

                // book seat
                if (path === "/api/seats/book" && method === "POST") {
                    const body = JSON.parse(opts.body || "{}");
                    const seat = mockDB.seats.find(s => s._id === body.seatId);
                    if (!seat) throw new Error("Seat not found");
                    if (seat.status !== "available") {
                        const e = new Error("Seat not available");
                        e.status = 400;
                        throw e;
                    }
                    seat.status = "booked";
                    seat.studentId = roll;
                    seat.bookedAt = new Date().toISOString();
                    return resolve({ ok: true, seat });
                }

                if (path === "/api/seats/occupy" && method === "POST") {
                    const body = JSON.parse(opts.body || "{}");
                    const seat = mockDB.seats.find(s => s._id === body.seatId);
                    if (!seat) throw new Error("Seat not found");
                    if (seat.status !== "booked" || seat.studentId !== roll) throw new Error("You must book first");
                    seat.status = "occupied";
                    return resolve({ ok: true, seat });
                }

                if (path === "/api/seats/release" && method === "POST") {
                    const body = JSON.parse(opts.body || "{}");
                    const seat = mockDB.seats.find(s => s._id === body.seatId);
                    if (!seat) throw new Error("Seat not found");
                    if (seat.studentId !== roll) throw new Error("Not your seat");

                    seat.status = "available";
                    seat.studentId = null;
                    seat.bookedAt = null;
                    return resolve({ ok: true, seat });
                }

                // --------------- BOOKS ----------------
                if (path.startsWith("/api/books/search") && method === "GET") {
                    const url = new URL(`${API_BASE}${path}`);
                    const q = (url.searchParams.get("q") || "").toLowerCase();
                    const category = (url.searchParams.get("category") || "").toLowerCase();
                    let books = [...mockDB.books];
                    if (q) books = books.filter(b => (b.title || "").toLowerCase().includes(q) || (b.author || "").toLowerCase().includes(q));
                    if (category) books = books.filter(b => (b.category || "").toLowerCase() === category);
                    return resolve({ books });
                }

                // --------------- BORROW ----------------
                if (path === "/api/borrow/my" && method === "GET") {
                    const items = mockDB.borrows.filter(b => b.studentRoll === roll);
                    return resolve({ items });
                }

                if (path === "/api/borrow" && method === "POST") {
                    const body = JSON.parse(opts.body || "{}");
                    const book = mockDB.books.find(b => b._id === body.bookId);
                    if (!book) throw new Error("Book not found");
                    if (book.availabilityCount <= 0) throw new Error("No copies available");

                    book.availabilityCount -= 1;
                    const rec = { _id: uid(), book: book._id, studentRoll: roll, borrowedAt: new Date().toISOString(), dueAt: body.dueAt, status: "active" };
                    mockDB.borrows.push(rec);
                    return resolve({ ok: true, borrow: rec });
                }

                if (path === "/api/borrow/extend" && method === "POST") {
                    const body = JSON.parse(opts.body || "{}");
                    const rec = mockDB.borrows.find(r => r._id === body.borrowId && r.studentRoll === roll);
                    if (!rec) throw new Error("Record not found");
                    rec.dueAt = body.newDueAt;
                    return resolve({ ok: true, borrow: rec });
                }

                if (path === "/api/health") return resolve({ ok: true, ts: Date.now() });

                throw new Error(`Mock route not implemented ${method} ${path}`);
            } catch (e) {
                reject(e);
            }
        }, ms);
    });
}   