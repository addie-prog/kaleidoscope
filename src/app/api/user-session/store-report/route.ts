import { adminDb } from "@/lib/firebase-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const snap = await adminDb.collection("reports").get();
  const data = snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  return NextResponse.json(data);
}