import { adminDb } from "@/lib/firebase-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  const pageToken = searchParams.get("pageToken");

  // Order by "Date Created" descending (latest first)
  let query = adminDb.collection("reports").orderBy("Date Created", "desc").limit(pageSize);

  if (pageToken) {
    const lastDocSnap = await adminDb.collection("reports").doc(pageToken).get();
    if (lastDocSnap.exists) {
      query = query.startAfter(lastDocSnap);
    }
  }

  const snap = await query.get();

  const data = snap.docs.map(doc => {
    const d = doc.data();
    const dateJoined = d['Date Created']
      ? new Date(d['Date Created'].seconds * 1000 + d['Date Created'].nanoseconds / 1000000).toLocaleDateString()
      : null;

    return {
      id: doc.id,
      ...d,
      "Date Created": dateJoined, // readable ISO string
    };
  });

  // Last doc ID for next page
  const lastVisible = snap.docs[snap.docs.length - 1];
  const nextPageToken = lastVisible ? lastVisible.id : null;

  return NextResponse.json({ data, nextPageToken });
}
