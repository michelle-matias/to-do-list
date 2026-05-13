"use client";
import { useState } from "react";
import "./Lista.module.css";

const CAT_CONFIG = {
    personal: { icon: "✿", label: "personal", badge: "#fce8f3", badgeText: "#b05090", pill: "#e8a0cd", pillText: "#7a1f5e", pillBorder: "#e8a0cd", pilIdle: "#fce8f3", pilIlText: "#c063a0", pillIdleBorder: "#f0c4de" },
    school:   { icon: "◈", label: "school",   badge: "#ede8fe", badgeText: "#6040b0", pill: "#c4b0f0", pillText: "#3d1f8a", pillBorder: "#c4b0f0", pilIdle: "#ede8fe", pilIlText: "#7c5cc4", pillIdleBorder: "#d4c8f8" },
    work:     { icon: "◇", label: "work",     badge: "#e8f0fe", badgeText: "#3060b0", pill: "#a8c0f0", pillText: "#0d2f7a", pillBorder: "#a8c0f0", pilIdle: "#e8f0fe", pilIlText: "#4a78c8", pillIdleBorder: "#c0d4f8" },
    health:   { icon: "♡", label: "health",   badge: "#e8f8ee", badgeText: "#307050", pill: "#a0d8b8", pillText: "#1a5a38", pillBorder: "#a0d8b8", pilIdle: "#e8f8ee", pilIlText: "#4a9a6c", pillIdleBorder: "#b8e8cc" },
};

const CONFETTI_COLORS = ["#f4a7c3", "#b8a0e8", "#a0c8f0", "#a8d8b8", "#f4d0a0", "#e8a0b8", "#c8b0f0"];

function ConfettiPiece({ color, left, size, duration, delay, isRound }) {
    return (
        <div
            style={{
                position: "fixed",
                top: "-20px",
                left: `${left}%`,
                width: `${size}px`,
                height: `${size}px`,
                background: color,
                borderRadius: isRound ? "50%" : "2px",
                animation: `fall ${duration}s ${delay}s linear forwards`,
                pointerEvents: "none",
                zIndex: 9999,
            }}
        />
    );
}

export default function Lista() {
    const [todos, setTodos] = useState([]);
    const [input, setInput] = useState("");
    const [category, setCategory] = useState("personal");
    const [editId, setEditId] = useState(null);
    const [confetti, setConfetti] = useState([]);

    const spawnConfetti = () => {
        const pieces = Array.from({ length: 28 }, (_, i) => ({
            id: Date.now() + i,
            color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
            left: 20 + Math.random() * 60,
            size: 6 + Math.random() * 6,
            duration: 1.5 + Math.random(),
            delay: Math.random() * 0.3,
            isRound: Math.random() > 0.5,
        }));
        setConfetti(pieces);
        setTimeout(() => setConfetti([]), 3000);
    };

    const handleAdd = () => {
        if (!input.trim()) return;
        if (editId) {
            setTodos(todos.map((t) => t.id === editId ? { ...t, text: input, category } : t));
            setEditId(null);
        } else {
            setTodos([...todos, { id: Date.now(), text: input, category, done: false }]);
        }
        setInput("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleAdd();
    };

    const toggleDone = (id) => {
        const todo = todos.find((t) => t.id === id);
        if (!todo.done) spawnConfetti();
        setTodos(todos.map((t) => t.id === id ? { ...t, done: !t.done } : t));
    };

    const editTodo = (todo) => {
        setInput(todo.text);
        setCategory(todo.category);
        setEditId(todo.id);
    };

    const deleteTodo = (id) => setTodos(todos.filter((t) => t.id !== id));

    const done = todos.filter((t) => t.done).length;

    return (
        <>
            {confetti.map((p) => (
                <ConfettiPiece key={p.id} {...p} />
            ))}

            <div className="todo-card">
                <div className="header">
                    <h1><em>my little</em> to-do list ✿</h1>
                    <p>✦ stay soft, stay organised ✦</p>
                </div>

                <div className="input-section">
                    <div className="input-row">
                        <input
                            className="task-input"
                            type="text"
                            placeholder="add something sweet..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            className="add-btn"
                            onClick={handleAdd}
                            style={editId ? { background: "linear-gradient(135deg, #f0a8c0, #d48bbf)" } : {}}
                        >
                            {editId ? "save" : "add"}
                        </button>
                    </div>

                    <div className="cat-pills">
                        {Object.entries(CAT_CONFIG).map(([key, cfg]) => {
                            const active = category === key;
                            return (
                                <button
                                    key={key}
                                    className="cat-pill"
                                    onClick={() => setCategory(key)}
                                    style={{
                                        background: active ? cfg.pill : cfg.pilIdle,
                                        color: active ? cfg.pillText : cfg.pilIlText,
                                        borderColor: active ? cfg.pillBorder : cfg.pillIdleBorder,
                                    }}
                                >
                                    {cfg.icon} {cfg.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {todos.length > 0 && (
                    <div className="stats-row">
                        <div className="stat-chip">
                            <span className="stat-n">{todos.length}</span>
                            <span className="stat-l">total</span>
                        </div>
                        <div className="stat-chip">
                            <span className="stat-n">{done}</span>
                            <span className="stat-l">done</span>
                        </div>
                        <div className="stat-chip">
                            <span className="stat-n">{todos.length - done}</span>
                            <span className="stat-l">left</span>
                        </div>
                    </div>
                )}

                <div className="todo-list">
                    {todos.length === 0 ? (
                        <div className="empty-state">
                            <span className="empty-icon">✿</span>
                            <p>your list is empty — add something lovely!</p>
                        </div>
                    ) : (
                        todos.map((todo) => {
                            const cfg = CAT_CONFIG[todo.category];
                            return (
                                <div key={todo.id} className={`todo-item${todo.done ? " done" : ""}`}>
                                    <label className="check-wrap">
                                        <input
                                            type="checkbox"
                                            checked={todo.done}
                                            onChange={() => toggleDone(todo.id)}
                                        />
                                        <div className={`custom-check${todo.done ? " checked" : ""}`}>
                                            {todo.done && "✓"}
                                        </div>
                                    </label>

                                    <div className="todo-text">
                    <span className={`todo-text-main${todo.done ? " done" : ""}`}>
                      {todo.text}
                    </span>
                                        <span
                                            className="cat-badge"
                                            style={{ background: cfg.badge, color: cfg.badgeText }}
                                        >
                      {cfg.icon} {cfg.label}
                    </span>
                                    </div>

                                    <div className="item-actions">
                                        <button className="icon-btn edit" onClick={() => editTodo(todo)} aria-label="edit task">✎</button>
                                        <button className="icon-btn del" onClick={() => deleteTodo(todo.id)} aria-label="delete task">✕</button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </>
    );
}