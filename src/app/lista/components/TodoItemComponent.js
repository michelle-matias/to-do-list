"use client";

import { CAT_CONFIG } from "./catConfig";

function formatTimestamp(iso) {
    if (!iso) return null;
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleString(undefined, {
        year: "numeric", month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
}

export default function TodoItemComponent({ todo, onToggle, onEdit, onDelete }) {
    const cfg = CAT_CONFIG[todo.category] || CAT_CONFIG.personal;
    const createdLabel = formatTimestamp(todo.createdAt);
    const updatedLabel = formatTimestamp(todo.updatedAt);
    const showUpdated = updatedLabel && updatedLabel !== createdLabel;

    return (
        <div className={`todo-item${todo.done ? " done" : ""}`}>
            <label className="check-wrap">
                <input
                    type="checkbox"
                    checked={todo.done}
                    onChange={() => onToggle(todo.id)}
                />
                <div className={`custom-check${todo.done ? " checked" : ""}`}>
                    {todo.done && "✓"}
                </div>
            </label>

            <div className="todo-text">
                <span className={`todo-text-main${todo.done ? " done" : ""}`}>
                    {todo.text}
                </span>
                <span className="cat-badge" style={{ background: cfg.badge, color: cfg.badgeText }}>
                    {cfg.icon} {cfg.label}
                </span>
                {(createdLabel || showUpdated) && (
                    <div className="todo-meta">
                        {createdLabel && <span>created {createdLabel}</span>}
                        {showUpdated && <span>edited {updatedLabel}</span>}
                    </div>
                )}
            </div>

            <div className="item-actions">
                <button className="icon-btn edit" onClick={() => onEdit(todo)} aria-label="edit task">✎</button>
                <button className="icon-btn del" onClick={() => onDelete(todo.id)} aria-label="delete task">✕</button>
            </div>
        </div>
    );
}
