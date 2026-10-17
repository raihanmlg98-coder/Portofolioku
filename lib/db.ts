import Database from "better-sqlite3"
import path from "path"
import fs from "fs"

const DB_DIR = path.join(process.cwd(), "data")
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true })
}

const DB_PATH = path.join(DB_DIR, "chat.db")

const globalForDb = globalThis as unknown as {
  chatDb: Database.Database | undefined
}

export const db: Database.Database =
  globalForDb.chatDb ?? new Database(DB_PATH)

if (process.env.NODE_ENV !== "production") {
  globalForDb.chatDb = db
}

// Enable Write-Ahead Logging for concurrency and performance
db.pragma("journal_mode = WAL")

// Create table and indices
db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    sender TEXT NOT NULL CHECK(sender IN ('user', 'bot')),
    text TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_messages_session_id_created ON messages(session_id, created_at);
`)

export interface ChatMessageRecord {
  id: string
  session_id: string
  sender: "user" | "bot"
  text: string
  created_at: number
}

// Prepared statements
const insertStmt = db.prepare(`
  INSERT INTO messages (id, session_id, sender, text, created_at)
  VALUES (@id, @sessionId, @sender, @text, @createdAt)
`)

const getSessionMessagesStmt = db.prepare(`
  SELECT id, session_id, sender, text, created_at
  FROM messages
  WHERE session_id = ?
  ORDER BY created_at ASC
`)

const getRecentMessagesStmt = db.prepare(`
  SELECT id, session_id, sender, text, created_at
  FROM messages
  WHERE session_id = ?
  ORDER BY created_at DESC
  LIMIT ?
`)

const deleteSessionMessagesStmt = db.prepare(`
  DELETE FROM messages
  WHERE session_id = ?
`)

export function saveMessage(params: {
  id: string
  sessionId: string
  sender: "user" | "bot"
  text: string
  createdAt: number
}) {
  insertStmt.run({
    id: params.id,
    sessionId: params.sessionId,
    sender: params.sender,
    text: params.text,
    createdAt: params.createdAt,
  })
}

export function getSessionMessages(sessionId: string): ChatMessageRecord[] {
  return getSessionMessagesStmt.all(sessionId) as ChatMessageRecord[]
}

export function getRecentHistory(
  sessionId: string,
  limit = 10
): { role: "user" | "assistant"; content: string }[] {
  const rows = getRecentMessagesStmt.all(sessionId, limit) as ChatMessageRecord[]
  return rows.reverse().map((r) => ({
    role: r.sender === "user" ? ("user" as const) : ("assistant" as const),
    content: r.text,
  }))
}

export function clearSessionMessages(sessionId: string) {
  deleteSessionMessagesStmt.run(sessionId)
}
