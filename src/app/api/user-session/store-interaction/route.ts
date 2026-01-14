import { adminDb } from "@/lib/firebase-auth";
import { Timestamp } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { reportName, itemName, interactionStatus, userNotes, allocatedCost } = await request.json();
  const batch = adminDb.batch();
  const collectionRef = adminDb.collection("interactions");
  const createdIds: string[] = [];

  try {

    itemName?.forEach((itemN: any, i: number) => {
      const docRef = collectionRef.doc(); // auto ID
      createdIds.push(docRef.id);

      batch.set(docRef, {
        "Interaction ID": `Int_${Date.now()}`,
        "Report Name": reportName ?? null,
        "Item Name": itemN ?? null,
        "Interaction Status": interactionStatus,
        "User Notes": userNotes ? userNotes : null,
        "Allocated Cost": allocatedCost[i],
        "Date Created": Timestamp.now(),
      });
    });

    await batch.commit();

    return NextResponse.json({
      success: true,
      ids: createdIds
    });


  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
