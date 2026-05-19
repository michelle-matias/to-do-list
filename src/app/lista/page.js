/* ✿ page.js — INTERACTIVE TO-DO LIST (React / JavaScript Logic & HTML) ✿
   This is the main engine of your interactive task manager!
   
   In modern React, we build interactive user interfaces using:
     1. CLIENT-SIDE directive ("use client"): Enables React state in the browser.
     2. JAVASCRIPT STATE CONTROLS: Manages the application memory (tasks list, input typing, active categories).
     3. EVENT HANDLERS: Actions triggered by clicking buttons, checking boxes, or typing.
     4. JSX HTML TEMPLATES: The structure rendered inside the `return` statement which reacts dynamically to state changes.
*/

// Tells Next.js to run this file in the browser (client-side) because it uses state hook controls and actions
"use client"; 

// Imports the React state management hook (useState) to dynamically hold and modify browser memory
import { useState } from "react";

// Imports the dedicated stylesheet styling for our card layouts, custom inputs, and animations
import "./lista.css";

/* ─── 1. CONFIGURATION SYSTEM (Configurações Estáticas) ───
   CAT_CONFIG maps color tokens for the category badges and pills.
   It keeps style constants separate from the interactive code, making colors clean and modular!
*/
const CAT_CONFIG = {
    personal: { 
        icon: "✿", label: "personal", 
        badge: "#fce8f3", badgeText: "#b05090",       /* Style when shown as a small task tag */
        pill: "#e8a0cd", pillText: "#7a1f5e", pillBorder: "#e8a0cd", /* Style when active as a selection pill */
        pilIdle: "#fce8f3", pilIlText: "#c063a0", pillIdleBorder: "#f0c4de" /* Style when inactive/unselected */
    },
    school: { 
        icon: "◈", label: "school",   
        badge: "#ede8fe", badgeText: "#6040b0", 
        pill: "#c4b0f0", pillText: "#3d1f8a", pillBorder: "#c4b0f0", 
        pilIdle: "#ede8fe", pilIlText: "#7c5cc4", pillIdleBorder: "#d4c8f8" 
    },
    work: { 
        icon: "◇", label: "work",     
        badge: "#e8f0fe", badgeText: "#3060b0", 
        pill: "#a8c0f0", pillText: "#0d2f7a", pillBorder: "#a8c0f0", 
        pilIdle: "#e8f0fe", pilIlText: "#4a78c8", pillIdleBorder: "#c0d4f8" 
    },
    health: { 
        icon: "♡", label: "health",   
        badge: "#e8f8ee", badgeText: "#307050", 
        pill: "#a0d8b8", pillText: "#1a5a38", pillBorder: "#a0d8b8", 
        pilIdle: "#e8f8ee", pilIlText: "#4a9a6c", pillIdleBorder: "#b8e8cc" 
    },
};

// Colors used for the falling celebration confetti sparks!
const CONFETTI_COLORS = ["#f4a7c3", "#b8a0e8", "#a0c8f0", "#a8d8b8", "#f4d0a0", "#e8a0b8", "#c8b0f0"];

/* ─── 2. SUB-COMPONENTS (Sub-elementos React) ───
   ConfettiPiece renders a single falling square or circle.
   We inject inline dynamic styles for individual falling trajectories.
*/
function ConfettiPiece({ color, left, size, duration, delay, isRound }) {
    return (
        <div
            style={{
                position: "fixed",
                top: "-20px",
                left: `${left}%`,                        /* Random horizontal starting point */
                width: `${size}px`,                      /* Random size */
                height: `${size}px`,
                background: color,                       /* Colorful random color */
                borderRadius: isRound ? "50%" : "2px",   /* Random shapes: 50% makes it a circle, 2px a tiny square */
                animation: `fall ${duration}s ${delay}s linear forwards`, /* Triggers CSS fall animation */
                pointerEvents: "none",                   /* Ignores clicks so user can still interact through it */
                zIndex: 9999,                            /* Keeps confetti floating on top of all card interfaces */
            }}
        />
    );
}

/* ─── 3. MAIN COMPONENT (O Componente Principal) ─── */
export default function Lista() {
    // ─── A. REACT STATES (Memória do Componente) ───
    // Modifying these state functions automatically causes React to update the HTML on the user's screen.
    const [todos, setTodos] = useState([]);         // Array of tasks: [{ id, text, category, done }]
    const [input, setInput] = useState("");         // Holds the active text typed in the input box
    const [category, setCategory] = useState("personal"); // Currently selected task category for new items
    const [editId, setEditId] = useState(null);     // If active editing, holds the unique ID of the edited task
    const [confetti, setConfetti] = useState([]);   // List of active confetti pieces on screen

    // ─── B. ACTION FUNCTIONS (Lógica do Javascript) ───

    // Spawns 28 colorful confetti pieces with random angles/sizes/speeds
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
        // Automatically clears the confetti after 3 seconds to keep memory clean
        setTimeout(() => setConfetti([]), 3000); 
    };

    // Adds a new task to the array, or saves changes to an existing one
    const handleAdd = () => {
        if (!input.trim()) return; // Exits if input is empty or just spaces
        
        if (editId) {
            // Edit Mode: Finds the active task by ID and updates its description and category
            setTodos(todos.map((t) => t.id === editId ? { ...t, text: input, category } : t));
            setEditId(null); // Resets edit state back to normal addition mode
        } else {
            // Addition Mode: Spends a new task object and appends it to the list
            setTodos([...todos, { id: Date.now(), text: input, category, done: false }]);
        }
        setInput(""); // Clears input box text after successfully saving
    };

    // Submits the input when the "Enter" key is hit
    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleAdd();
    };

    // Toggles a task completion state (checked/unchecked) and triggers confetti celebration
    const toggleDone = (id) => {
        const todo = todos.find((t) => t.id === id);
        // If checking a task as completed (transitioning false -> true), spawn confetti!
        if (todo && !todo.done) spawnConfetti(); 
        
        setTodos(todos.map((t) => t.id === id ? { ...t, done: !t.done } : t));
    };

    // Populates the input boxes with selected task values to enter Editing Mode
    const editTodo = (todo) => {
        setInput(todo.text);
        setCategory(todo.category);
        setEditId(todo.id);
    };

    // Deletes selected task by filtering it out of the array
    const deleteTodo = (id) => setTodos(todos.filter((t) => t.id !== id));

    // ─── C. METRICS & COUNTERS ───
    const done = todos.filter((t) => t.done).length; // Calculates number of completed tasks

    // ─── D. HTML / JSX TEMPLATE VIEW (Visualização de Layout) ───
    return (
        <>
            {/* HTML: Loops and renders active confetti pieces */}
            {confetti.map((p) => (
                <ConfettiPiece key={p.id} {...p} />
            ))}

            {/* HTML: Main card structure */}
            <div className="todo-card">
                {/* HTML: Card Title Header */}
                <div className="header">
                    <h1><em>my little</em> to-do list ✿</h1>
                    <p>✦ stay soft, stay organised ✦</p>
                </div>

                {/* HTML: Task Input Panel */}
                <div className="input-section">
                    <div className="input-row">
                        {/* HTML: Text input box linking text state and key triggers */}
                        <input
                            className="task-input"
                            type="text"
                            placeholder="add something sweet..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)} // Updates state variable dynamically as you type!
                            onKeyDown={handleKeyDown}
                        />
                        {/* HTML: Add/Save Action button changing colors dynamically in Edit Mode */}
                        <button
                            className="add-btn"
                            onClick={handleAdd}
                            style={editId ? { background: "linear-gradient(135deg, #f0a8c0, #d48bbf)" } : {}}
                        >
                            {editId ? "save" : "add"}
                        </button>
                    </div>

                    {/* HTML: Category pill selection filter list */}
                    <div className="cat-pills">
                        {Object.entries(CAT_CONFIG).map(([key, cfg]) => {
                            const active = category === key; // Checks if this pill is currently selected
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

                {/* HTML: Progress Statistics Chips (Only visible if list contains tasks) */}
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

                {/* HTML: Tasks List rendering */}
                <div className="todo-list">
                    {todos.length === 0 ? (
                        /* HTML: If list is empty, render lovely Empty State view */
                        <div className="empty-state">
                            <span className="empty-icon">✿</span>
                            <p>your list is empty — add something lovely!</p>
                        </div>
                    ) : (
                        /* HTML: Loops and renders every single task item from todos array */
                        todos.map((todo) => {
                            const cfg = CAT_CONFIG[todo.category]; // Grabs category visual style config
                            return (
                                <div key={todo.id} className={`todo-item${todo.done ? " done" : ""}`}>
                                    {/* HTML: Circular Checkbox wrapping standard hidden checkbox */}
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

                                    {/* HTML: Task content (Title & Category Badge tag) */}
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

                                    {/* HTML: Actions (Pencil for Edit and Cross for Delete) */}
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