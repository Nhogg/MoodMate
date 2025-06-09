import { NextResponse } from "next/server"
import { checkAndCreateEntriesTable } from "@/lib/check-database"

export async function GET() {
  try {
    const result = await checkAndCreateEntriesTable()
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
