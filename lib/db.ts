import Database from "better-sqlite3"
import path from "path"
import fs from "fs"

const DB_DIR = process.env.VERCEL ? "/tmp" : path.join(process.cwd(), "data")
const DB_PATH = path.join(DB_DIR, "chat.db")

export interface ChatMessageRecord {
  id: string
  session_id: string
  sender: "user" | "bot"
  text: string
  created_at: number
}

// In-memory fallback if SQLite fails or is not writable in serverless environments
const memoryStore = new Map<string, ChatMessageRecord[]>()

let dbInstance: Database.Database | null = null
let insertStmt: Database.Statement | null = null
let getSessionMessagesStmt: Database.Statement | null = null
let getRecentMessagesStmt: Database.Statement | null = null
let deleteSessionMessagesStmt: Database.Statement | null = null

try {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true })
  }

  const globalForDb = globalThis as unknown as {
    chatDb: Database.Database | undefined
  }

  dbInstance = globalForDb.chatDb ?? new Database(DB_PATH)

  if (process.env.NODE_ENV !== "production") {
    globalForDb.chatDb = dbInstance
  }

  // Enable Write-Ahead Logging for concurrency and performance
  dbInstance.pragma("journal_mode = WAL")

  // Create table and indices
  dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      sender TEXT NOT NULL CHECK(sender IN ('user', 'bot')),
      text TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_messages_session_id_created ON messages(session_id, created_at);
  `)

  insertStmt = dbInstance.prepare(`
    INSERT INTO messages (id, session_id, sender, text, created_at)
    VALUES (@id, @sessionId, @sender, @text, @createdAt)
  `)

  getSessionMessagesStmt = dbInstance.prepare(`
    SELECT id, session_id, sender, text, created_at
    FROM messages
    WHERE session_id = ?
    ORDER BY created_at ASC
  `)

  getRecentMessagesStmt = dbInstance.prepare(`
    SELECT id, session_id, sender, text, created_at
    FROM messages
    WHERE session_id = ?
    ORDER BY created_at DESC
    LIMIT ?
  `)

  deleteSessionMessagesStmt = dbInstance.prepare(`
    DELETE FROM messages
    WHERE session_id = ?
  `)
} catch (err) {
  console.warn("SQLite storage unavailable, using in-memory store for chat messages:", err)
  dbInstance = null
}

export const db = dbInstance

export function saveMessage(params: {
  id: string
  sessionId: string
  sender: "user" | "bot"
  text: string
  createdAt: number
}) {
  if (insertStmt) {
    try {
      insertStmt.run({
        id: params.id,
        sessionId: params.sessionId,
        sender: params.sender,
        text: params.text,
        createdAt: params.createdAt,
      })
      return
    } catch (e) {
      console.warn("Error saving message to SQLite:", e)
    }
  }

  const list = memoryStore.get(params.sessionId) || []
  list.push({
    id: params.id,
    session_id: params.sessionId,
    sender: params.sender,
    text: params.text,
    created_at: params.createdAt,
  })
  memoryStore.set(params.sessionId, list)
}

export function getSessionMessages(sessionId: string): ChatMessageRecord[] {
  if (getSessionMessagesStmt) {
    try {
      return getSessionMessagesStmt.all(sessionId) as ChatMessageRecord[]
    } catch (e) {
      console.warn("Error getting session messages from SQLite:", e)
    }
  }

  return memoryStore.get(sessionId) || []
}

export function getRecentHistory(
  sessionId: string,
  limit = 10
): { role: "user" | "assistant"; content: string }[] {
  if (getRecentMessagesStmt) {
    try {
      const rows = getRecentMessagesStmt.all(sessionId, limit) as ChatMessageRecord[]
      return rows.reverse().map((r) => ({
        role: r.sender === "user" ? ("user" as const) : ("assistant" as const),
        content: r.text,
      }))
    } catch (e) {
      console.warn("Error getting recent history from SQLite:", e)
    }
  }

  const list = memoryStore.get(sessionId) || []
  return list
    .slice(-limit)
    .map((r) => ({
      role: r.sender === "user" ? ("user" as const) : ("assistant" as const),
      content: r.text,
    }))
}

export function clearSessionMessages(sessionId: string) {
  if (deleteSessionMessagesStmt) {
    try {
      deleteSessionMessagesStmt.run(sessionId)
      return
    } catch (e) {
      console.warn("Error clearing session messages from SQLite:", e)
    }
  }

  memoryStore.delete(sessionId)
}
