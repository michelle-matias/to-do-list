"use client";

import { CAT_CONFIG } from "./catConfig";

export default function AddToTaskListComponent({
    input,
    setInput,
    category,
    setCategory,
    editId,
    onAdd,
}) {
    const handleKeyDown = (e) => {
        if (e.key === "Enter") onAdd();
    };

    return (
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
                    onClick={onAdd}
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
    );
}
