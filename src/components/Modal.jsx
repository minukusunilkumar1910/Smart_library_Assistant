import React from "react";

export default function Modal({ open, title, children, onClose }) {
    if (!open) return null;
    return (
        <div className="modal-back" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3 style={{ marginTop: 0 }}>{title}</h3>
                <div style={{ marginTop: 12 }}>{children}</div>
                <div style={{ marginTop: 14, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button className="btn" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}