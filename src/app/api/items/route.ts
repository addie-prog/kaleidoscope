import { adminDb } from "@/lib/firebase-auth";
import { NextResponse } from "next/server";
import { FieldPath } from "firebase-admin/firestore";

export async function POST(req: Request) {
  const { layers, category } = await req.json();

  const chunk = (arr: string[], size = 10) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );



  const layerChunks = chunk(layers, 10);

  let items: any[] = [];

  for (const lc of layerChunks) {
    let q = adminDb
      .collection("items")
      .where(
        "Budget Tier",
        "in",
        lc.map((l: any) => l.budgetTier)
      )
      .where(
        "Execution Layer",
        "in",
        lc.map((l: any) => l.layerId)
      )
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
  //  Build items query
  // let query = adminDb.collection("items").where("Budget Tier", "in", layers.map((l: any) => l.budgetTier)).where("Execution Layer", "in", layers.map((l: any) => l.layerId)).where("Status", "==", "Active"); 
  // if (!category) { query = query.where("Tags", "array-contains-any", ["baseline"]); }
  // //  Fetch items
  // const snap = await query.get();

  // const items = snap.docs.map(doc => ({
  //   id: doc.id,
  //   ...doc.data(),
  // }));

  //  No items → return early
  if (!items?.length) {
    return NextResponse.json({ data: [] });
  }

  //  Fetch matching docs from other collection
  const itemIds = items?.map(item => item.id);



  let otherDocs: any[] = [];

  for (const ids of chunk(itemIds)) {
    const otherSnap = await adminDb
      .collection("Steps")
      .where(FieldPath.documentId(), "in", ids)
      .get();

    otherDocs.push(
      ...otherSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
    );
  }

  //  Merge results
  const otherMap = new Map(
    otherDocs.map(doc => [doc.id, doc])
  );

  const mergedData = items.map(item => ({
    ...item,
    ...otherMap.get(item.id), //  merged values
  }));

  //  Return final merged data
  return NextResponse.json({ data: mergedData });
}
