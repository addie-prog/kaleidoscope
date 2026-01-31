export const runtime = "nodejs";

import { adminDb } from "@/lib/firebase-auth";
import { NextResponse } from "next/server";
import { FieldPath } from "firebase-admin/firestore";

const chunk = <T>(arr: T[], size = 10): T[][] =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

export async function POST(req: Request) {
  const { layers, category } = await req.json();

  if (!layers?.length) {
    return NextResponse.json({ data: [] });
  }

  let items: any[] = [];

  for (const lc of chunk(layers)) {
    const pairKeys = lc.map(
      (l: any) => `${l.budgetTier}|${l.layerId}`
    );

    let q = adminDb
      .collection("items")
      .where("pairKey", "in", pairKeys)
      .where("Status", "==", "Active");

    if (!category) {
      q = q.where("Tags", "array-contains", "baseline");
    }

    const snap = await q.get();

    items.push(
      ...snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
    );
  }

  if (!items.length) {
    return NextResponse.json({ data: [] });
  }

  // Fetch Steps
  const itemIds = items.map(item => item.id);
  let otherDocs: any[] = [];

  for (const ids of chunk(itemIds)) {
    const snap = await adminDb
      .collection("Steps")
      .where(FieldPath.documentId(), "in", ids)
      .get();

    otherDocs.push(
      ...snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
    );
  }

  // Merge
  const otherMap = new Map(
    otherDocs.map(doc => [doc.id, doc])
  );

  const mergedData = items.map(item => ({
    ...item,
    ...otherMap.get(item.id),
  }));

  return NextResponse.json({ data: mergedData });
}
