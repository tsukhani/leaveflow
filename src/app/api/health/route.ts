import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Health probe. Also the first thing an agent will call to confirm the
 * MCP database server and the app point at the same database.
 */
export async function GET() {
  try {
    const employees = await prisma.employee.count();
    return NextResponse.json({
      status: "ok",
      employeeCount: employees,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: (error as Error).message },
      { status: 503 },
    );
  }
}
