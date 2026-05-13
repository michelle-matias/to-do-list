"use client";

import { useState } from "react";

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

export default function Home() {
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
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: linear-gradient(135deg, #fdf0f5 0%, #f5eefe 50%, #eef5ff 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.25rem;
        }

        @keyframes fall {
          0%   { transform: translateY(0) rotate(0deg);   opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .todo-card { width: 100%; max-width: 440px; }

        .header { text-align: center; margin-bottom: 1.75rem; }

        .header h1 {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 500;
          color: #b565a7;
          letter-spacing: -0.5px;
          line-height: 1.2;
        }

        .header h1 em { font-style: italic; color: #c97bbf; }

        .header p {
          font-size: 12px;
          color: #c9a0d0;
          margin-top: 4px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .input-section {
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(210,170,230,0.3);
          border-radius: 18px;
          padding: 1.25rem;
          margin-bottom: 1.25rem;
          box-shadow: 0 4px 24px rgba(180,130,210,0.1);
        }

        .input-row { display: flex; gap: 8px; margin-bottom: 10px; }

        .task-input {
          flex: 1;
          padding: 10px 14px;
          border: 1.5px solid #f0d5ec;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #7a4f7f;
          background: rgba(255,255,255,0.8);
          outline: none;
          transition: border-color 0.2s;
        }

        .task-input::placeholder { color: #d4a8d4; }
        .task-input:focus { border-color: #c97bbf; }

        .cat-pills { display: flex; gap: 6px; flex-wrap: wrap; }

        .cat-pill {
          padding: 6px 14px;
          border-radius: 20px;
          border: 1.5px solid transparent;
          font-size: 12px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.18s;
          letter-spacing: 0.3px;
        }

        .add-btn {
          padding: 10px 18px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #d48bbf, #b07dd4);
          color: white;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          letter-spacing: 0.3px;
        }

        .add-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(180,100,200,0.35); }
        .add-btn:active { transform: translateY(0); }

        .stats-row { display: flex; gap: 8px; margin-bottom: 1rem; }

        .stat-chip {
          flex: 1;
          background: rgba(255,255,255,0.6);
          border: 1px solid rgba(210,170,230,0.25);
          border-radius: 12px;
          padding: 8px;
          text-align: center;
        }

        .stat-n {
          font-size: 20px;
          font-weight: 500;
          color: #b565a7;
          font-family: 'Playfair Display', serif;
          display: block;
        }

        .stat-l {
          font-size: 10px;
          color: #c9a0d0;
          letter-spacing: 0.8px;
          text-transform: uppercase;
        }

        .todo-list { display: flex; flex-direction: column; gap: 8px; }

        .todo-item {
          background: rgba(255,255,255,0.75);
          border: 1px solid rgba(210,170,230,0.25);
          border-radius: 14px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.2s;
          animation: slideIn 0.25s ease;
          box-shadow: 0 2px 8px rgba(180,130,210,0.06);
        }

        .todo-item.done { opacity: 0.55; background: rgba(255,255,255,0.4); }

        .check-wrap {
          position: relative;
          width: 22px;
          height: 22px;
          flex-shrink: 0;
          cursor: pointer;
        }

        .check-wrap input {
          position: absolute;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
          z-index: 2;
          margin: 0;
        }

        .custom-check {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 2px solid #e0b0d8;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          font-size: 11px;
          color: white;
        }

        .custom-check.checked {
          background: linear-gradient(135deg, #d48bbf, #b07dd4);
          border-color: transparent;
        }

        .todo-text { flex: 1; min-width: 0; }

        .todo-text-main {
          font-size: 14px;
          color: #5a3f6a;
          font-weight: 400;
          display: block;
          transition: all 0.2s;
        }

        .todo-text-main.done {
          text-decoration: line-through;
          color: #c0a0c8;
        }

        .cat-badge {
          font-size: 10px;
          padding: 2px 8px;
          border-radius: 10px;
          margin-top: 3px;
          display: inline-block;
          letter-spacing: 0.5px;
          font-weight: 500;
        }

        .item-actions { display: flex; gap: 5px; }

        .icon-btn {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          border: 1px solid;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.15s;
        }

        .icon-btn.edit { border-color: #f0c8e0; color: #c070a8; }
        .icon-btn.edit:hover { background: #fce8f3; }
        .icon-btn.del { border-color: #f0c0c0; color: #c06060; }
        .icon-btn.del:hover { background: #fee8e8; }

        .empty-state { text-align: center; padding: 2.5rem 1rem; color: #d4a8d4; }
        .empty-icon { font-size: 36px; display: block; margin-bottom: 8px; opacity: 0.5; }
        .empty-state p { font-size: 13px; font-style: italic; }
      `}</style>

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