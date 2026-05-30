"use client";

import { useEffect, useState } from "react";
import "./lista.css";
import AddToTaskListComponent from "./components/AddToTaskListComponent";
import TodoItemComponent from "./components/TodoItemComponent";

const CONFETTI_COLORS = ["#f4a7c3", "#b8a0e8", "#a0c8f0", "#a8d8b8", "#f4d0a0", "#e8a0b8", "#c8b0f0"];
const STRAPI_API = "http://localhost:1337/api/todos";
const LOCAL_STORAGE_KEY = "todo_list_local";
const LOCAL_STORAGE_MODE = "todo_list_sync_mode";

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

function normalizeStrapiPayload(entry) {
    const attributes = entry.attributes || entry;
    return {
        id: entry.documentId ?? attributes.documentId ?? entry.id ?? `${Date.now()}-${Math.random()}`,
        text: attributes.text ?? "",
        category: attributes.category ?? "personal",
        done: attributes.done ?? false,
        createdAt: attributes.createdAt ?? null,
        updatedAt: attributes.updatedAt ?? null,
    };
}

function parseStrapiResponse(payload) {
    if (!payload) return [];
    const list = Array.isArray(payload.data)
        ? payload.data
        : Array.isArray(payload)
            ? payload
            : payload.data?.data;
    if (!Array.isArray(list)) return [];
    return list.map(normalizeStrapiPayload);
}

export default function Lista() {
    const [localTodos, setLocalTodos] = useState([]);
    const [remoteTodos, setRemoteTodos] = useState([]);
    const [input, setInput] = useState("");
    const [category, setCategory] = useState("personal");
    const [editId, setEditId] = useState(null);
    const [confetti, setConfetti] = useState([]);
    const [syncMode, setSyncMode] = useState("local");
    const [syncStatus, setSyncStatus] = useState("idle");
    const [statusMessage, setStatusMessage] = useState("Local mode active");
    const [offlineFallback, setOfflineFallback] = useState(false);
    const [isMigrating, setIsMigrating] = useState(false);

    const activeTodos = syncMode === "strapi" && !offlineFallback ? remoteTodos : localTodos;
    const activeSetTodos = syncMode === "strapi" && !offlineFallback ? setRemoteTodos : setLocalTodos;
    const isStrapiActive = syncMode === "strapi" && !offlineFallback;

    const setSyncMessage = (status, message) => {
        setSyncStatus(status);
        setStatusMessage(message);
    };

    const fallbackToLocal = (message) => {
        setSyncMode("local");
        setOfflineFallback(true);
        setSyncMessage("error", message);
    };

    const loadLocalStorage = () => {
        try {
            const storedLocal = window.localStorage.getItem(LOCAL_STORAGE_KEY);
            if (storedLocal) setLocalTodos(JSON.parse(storedLocal));
            const savedMode = window.localStorage.getItem(LOCAL_STORAGE_MODE);
            if (savedMode === "local" || savedMode === "strapi") setSyncMode(savedMode);
        } catch (error) {
            console.warn("Unable to read local storage", error);
        }
    };

    const saveLocalStorage = () => {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localTodos));
    };

    const saveRemoteTask = async (taskData, existingId) => {
        const url = existingId ? `${STRAPI_API}/${existingId}` : STRAPI_API;
        const method = existingId ? "PUT" : "POST";
        let response;
        try {
            response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: taskData }),
            });
        } catch (networkErr) {
            throw new Error(`Network error when contacting Strapi: ${networkErr.message}`);
        }

        if (!response.ok) {
            let details = "";
            try {
                const text = await response.text();
                try {
                    const json = JSON.parse(text);
                    details = JSON.stringify(json, null, 2);
                } catch {
                    details = text;
                }
            } catch (readErr) {
                details = `failed to read error body: ${readErr.message}`;
            }
            throw new Error(`Strapi responded ${response.status}: ${details}`);
        }

        const payload = await response.json().catch((e) => ({ error: `invalid json response: ${e.message}` }));
        return normalizeStrapiPayload(payload.data ?? payload);
    };

    const removeRemoteTask = async (taskId) => {
        let response;
        try {
            response = await fetch(`${STRAPI_API}/${taskId}`, { method: "DELETE" });
        } catch (networkErr) {
            throw new Error(`Network error when contacting Strapi: ${networkErr.message}`);
        }
        if (!response.ok) {
            let details = "";
            try {
                const text = await response.text();
                try {
                    const json = JSON.parse(text);
                    details = JSON.stringify(json, null, 2);
                } catch {
                    details = text;
                }
            } catch (readErr) {
                details = `failed to read error body: ${readErr.message}`;
            }
            throw new Error(`Strapi replied ${response.status}: ${details}`);
        }
    };

    const loadStrapiTodos = async () => {
        setOfflineFallback(false);
        setSyncMessage("syncing", "Connecting to Strapi...");

        try {
            const response = await fetch(`${STRAPI_API}?pagination[pageSize]=100`);
            if (!response.ok) throw new Error(`Strapi replied ${response.status}`);
            const payload = await response.json();
            const todos = parseStrapiResponse(payload);
            setRemoteTodos(todos);
            setSyncMessage("connected", `Strapi sync active • ${todos.length} task${todos.length === 1 ? "" : "s"}`);
        } catch (error) {
            console.error("Strapi load failed", error);
            fallbackToLocal("Strapi is unavailable — continuing in local mode.");
        }
    };

    const migrateLocalToStrapi = async () => {
        if (!localTodos.length) return;
        setIsMigrating(true);
        setSyncMessage("syncing", "Migrating local tasks into Strapi...");

        try {
            const uploaded = [];
            for (const todo of localTodos) {
                const created = await saveRemoteTask({ text: todo.text, category: todo.category, done: todo.done });
                uploaded.push(created);
            }
            setRemoteTodos((prev) => [...prev, ...uploaded]);
            setLocalTodos([]);
            setSyncMessage("connected", "All local tasks have been migrated to Strapi.");
        } catch (error) {
            console.error("Migration failed", error);
            fallbackToLocal("Migration failed — staying in local mode.");
        } finally {
            setIsMigrating(false);
        }
    };

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

    const handleAdd = async () => {
        if (!input.trim()) return;
        const trimmedText = input.trim();

        if (editId) {
            const taskUpdate = { text: trimmedText, category };
            if (isStrapiActive) {
                try {
                    const updated = await saveRemoteTask(taskUpdate, editId);
                    setRemoteTodos((prev) => prev.map((task) => (task.id === editId ? updated : task)));
                    setStatusMessage("Edited task on Strapi.");
                } catch (error) {
                    console.error(error);
                    fallbackToLocal("Could not update task on Strapi — edit preserved locally.");
                }
            } else {
                const now = new Date().toISOString();
                setLocalTodos((prev) => prev.map((task) => (task.id === editId ? { ...task, ...taskUpdate, updatedAt: now } : task)));
            }
            setEditId(null);
        } else {
            if (isStrapiActive) {
                try {
                    const created = await saveRemoteTask({ text: trimmedText, category, done: false });
                    setRemoteTodos((prev) => [...prev, created]);
                    setStatusMessage("New task saved in Strapi.");
                } catch (error) {
                    console.error(error);
                    fallbackToLocal("Unable to save to Strapi — task saved locally.");
                    const now = new Date().toISOString();
                    setLocalTodos((prev) => [...prev, { id: Date.now(), text: trimmedText, category, done: false, createdAt: now, updatedAt: now }]);
                }
            } else {
                const now = new Date().toISOString();
                setLocalTodos((prev) => [...prev, { id: Date.now(), text: trimmedText, category, done: false, createdAt: now, updatedAt: now }]);
            }
        }

        setInput("");
    };

    const toggleDone = async (id) => {
        const todo = activeTodos.find((task) => task.id === id);
        if (!todo) return;

        if (isStrapiActive) {
            try {
                const updated = await saveRemoteTask(
                    { text: todo.text, category: todo.category, done: !todo.done },
                    id
                );
                setRemoteTodos((prev) => prev.map((task) => (task.id === id ? { ...task, done: updated.done } : task)));
                if (!todo.done) spawnConfetti();
                setStatusMessage("Task status synced with Strapi.");
            } catch (error) {
                console.error(error);
                fallbackToLocal("Unable to update Strapi — falling back to local mode.");
            }
        } else {
            if (!todo.done) spawnConfetti();
            const now = new Date().toISOString();
            activeSetTodos((prev) => prev.map((task) => (task.id === id ? { ...task, done: !task.done, updatedAt: now } : task)));
        }
    };

    const editTodo = (todo) => {
        setInput(todo.text);
        setCategory(todo.category);
        setEditId(todo.id);
    };

    const deleteTodo = async (id) => {
        if (isStrapiActive) {
            try {
                await removeRemoteTask(id);
                setRemoteTodos((prev) => prev.filter((task) => task.id !== id));
                setStatusMessage("Task deleted from Strapi.");
                return;
            } catch (error) {
                console.error(error);
                fallbackToLocal("Unable to delete from Strapi — using local mode.");
            }
        }
        activeSetTodos((prev) => prev.filter((task) => task.id !== id));
    };

    const doneCount = activeTodos.filter((t) => t.done).length;
    const statusLabel = syncStatus === "connected"
        ? "connected"
        : syncStatus === "syncing"
            ? "connecting"
            : syncStatus === "error"
                ? "offline"
                : "idle";
    const showMigrationPanel = syncMode === "strapi" && !offlineFallback && localTodos.length > 0;

    useEffect(() => {
        loadLocalStorage();
    }, []);

    useEffect(() => {
        saveLocalStorage();
    }, [localTodos]);

    useEffect(() => {
        window.localStorage.setItem(LOCAL_STORAGE_MODE, syncMode);
    }, [syncMode]);

    useEffect(() => {
        if (syncMode === "strapi") {
            loadStrapiTodos();
        } else if (!offlineFallback) {
            setSyncMessage("idle", "Local mode active");
        }
    }, [syncMode, offlineFallback]);

    const handleModeChange = (mode) => {
        setSyncMode(mode);
        setOfflineFallback(false);
        if (mode === "local") {
            setSyncMessage("idle", "Local mode active");
        }
    };

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

                <div className="sync-card">
                    <div className="sync-row">
                        <div>
                            <div className="sync-title">Sync mode</div>
                            <div className="sync-tip sync-small">Choose Local to keep tasks in your browser, or Strapi to sync with the backend.</div>
                        </div>
                        <span className={`status-pill status-${statusLabel}`}>{statusLabel}</span>
                    </div>

                    <div className="mode-switch">
                        <button className={`mode-btn ${syncMode === "local" ? "active" : ""}`} onClick={() => handleModeChange("local")}>Local</button>
                        <button className={`mode-btn ${syncMode === "strapi" ? "active" : ""}`} onClick={() => handleModeChange("strapi")}>Strapi</button>
                    </div>

                    <p className="sync-tip">{statusMessage}</p>
                    <p className="sync-tip">{syncMode === "strapi"
                        ? "Run `npm run develop` inside my-strapi-project to keep your tasks synced with Strapi."
                        : "Your tasks are stored in the browser until Strapi Sync is enabled."}
                    </p>
                </div>

                {syncMode === "strapi" && offlineFallback && (
                    <div className="alert-panel">
                        <strong>Strapi is unavailable.</strong> The app has fallen back to local mode so you can keep working.
                    </div>
                )}

                {showMigrationPanel && (
                    <div className="migration-panel">
                        <div className="migration-text">
                            Found {localTodos.length} local task{localTodos.length === 1 ? "" : "s"}. Migrate them into Strapi so nothing is lost.
                        </div>
                        <button className="migration-btn" onClick={migrateLocalToStrapi} disabled={isMigrating}>
                            {isMigrating ? "Migrating..." : "Migrate Tasks ✿"}
                        </button>
                    </div>
                )}

                <AddToTaskListComponent
                    input={input}
                    setInput={setInput}
                    category={category}
                    setCategory={setCategory}
                    editId={editId}
                    onAdd={handleAdd}
                />

                {activeTodos.length > 0 && (
                    <div className="stats-row">
                        <div className="stat-chip">
                            <span className="stat-n">{activeTodos.length}</span>
                            <span className="stat-l">total</span>
                        </div>
                        <div className="stat-chip">
                            <span className="stat-n">{doneCount}</span>
                            <span className="stat-l">done</span>
                        </div>
                        <div className="stat-chip">
                            <span className="stat-n">{activeTodos.length - doneCount}</span>
                            <span className="stat-l">left</span>
                        </div>
                    </div>
                )}

                <div className="todo-list">
                    {activeTodos.length === 0 ? (
                        <div className="empty-state">
                            <span className="empty-icon">✿</span>
                            <p>your list is empty — add something lovely!</p>
                        </div>
                    ) : (
                        activeTodos.map((todo) => (
                            <TodoItemComponent
                                key={todo.id}
                                todo={todo}
                                onToggle={toggleDone}
                                onEdit={editTodo}
                                onDelete={deleteTodo}
                            />
                        ))
                    )}
                </div>
            </div>
        </>
    );
}