"use client";

import { CAT_CONFIG } from "./catConfig";

export default function TodoItemComponent({ todo, onToggle, onEdit, onDelete }) {
    const cfg = CAT_CONFIG[todo.category] || CAT_CONFIG.personal;

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
            </div>

            <div className="item-actions">
                <button className="icon-btn edit" onClick={() => onEdit(todo)} aria-label="edit task">✎</button>
                <button className="icon-btn del" onClick={() => onDelete(todo.id)} aria-label="delete task">✕</button>
            </div>
        </div>
    );
}
