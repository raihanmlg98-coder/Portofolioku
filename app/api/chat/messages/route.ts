import { NextRequest, NextResponse } from "next/server"
import { getSessionMessages, clearSessionMessages } from "@/lib/db"
import crypto from "crypto"

const COOKIE_NAME = "gilby_chat_session"

export async function GET(req: NextRequest) {
  try {
    let sessionId = req.cookies.get(COOKIE_NAME)?.value
    let isNewSession = false

    if (!sessionId) {
      sessionId = crypto.randomUUID()
      isNewSession = true
    }

    const records = getSessionMessages(sessionId)
    const messages = records.map((r) => ({
      id: r.id,
      sender: r.sender,
      text: r.text,
      timestamp: new Date(r.created_at).toISOString(),
    }))

    const res = NextResponse.json({
      success: true,
      sessionId,
      messages,
    })

    if (isNewSession) {
      res.cookies.set({
        name: COOKIE_NAME,
        value: sessionId,
        path: "/",
        maxAge: 60 * 60 * 24 * 90, // 90 days
        httpOnly: true,
        sameSite: "lax",
      })
    }

    return res
  } catch (error) {
    console.error("Failed to get messages:", error)
    return NextResponse.json(
      { success: false, message: "Gagal memuat pesan dari database." },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const sessionId = req.cookies.get(COOKIE_NAME)?.value

    if (sessionId) {
      clearSessionMessages(sessionId)
    }

    return NextResponse.json({
      success: true,
      message: "Riwayat chat berhasil dihapus.",
    })
  } catch (error) {
    console.error("Failed to delete messages:", error)
    return NextResponse.json(
      { success: false, message: "Gagal menghapus riwayat chat." },
      { status: 500 }
    )
  }
}
