import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasKey: !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    keyLength: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.length || 0,
    keyPreview: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      ? `${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.substring(0, 10)}...`
      : "none",
    allEnvKeys: Object.keys(process.env).filter(
      (k) => k.includes("GOOGLE") || k.includes("MAPS") || k.includes("NEXT_PUBLIC")
    ),
  });
}

