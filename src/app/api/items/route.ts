import { adminDb } from "@/lib/firebase-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { layers, category } = await req.json();

  let query = adminDb.collection("items").where("Budget Tier", "in", layers.map((l: any) => l.budgetTier)).where("Execution Layer", "in", layers.map((l: any) => l.layerId)).where("Status", "==", "Active");

  if (!category) {
    query = query.where("Tags", "array-contains-any", ["baseline"]);
  }

  const snap = await query.get();
  const data = snap.docs.map(doc => {
    const d = doc.data();
    return {
      id: doc.id,
      ...d,
    };
  });

  return NextResponse.json({ data });
}
