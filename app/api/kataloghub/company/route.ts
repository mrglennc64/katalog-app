import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    companyName: "Example Publishing AB",
    orgnr: "556123-4567",
    contact: "Anna Andersson",
    email: "anna@example.se",
  });
}
