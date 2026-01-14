import { adminDb } from "@/lib/firebase-auth";
import { Timestamp } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { reportId, sessionId, Allocations, budgetInputs, email, projectId, existProjectId } = await request.json()
  try {
    let docRef: any;

    const fields: any = {
      "Report ID": reportId,
      "Session ID": sessionId,
      "Budget Inputs": budgetInputs,
      "Allocations": Allocations,
      "Owner Email": email ? email : null
    }

    if (existProjectId) {
      fields["Last Updated"] = Timestamp.now();
      const snapshot = await adminDb
      .collection("user_projects")
      .where("Project ID", "==", existProjectId)
      .limit(1)
      .get();

      const docRef = snapshot.docs[0].ref;

      await docRef.update({
        ...fields
      });

    } else {
      fields["Project ID"] = projectId;
      fields["Created At"] = Timestamp.now();
      fields["Last Updated"] = null;

      docRef = await adminDb
        .collection("user_projects")
        .add({
          ...fields
        });
    }

    return NextResponse.json({
      success: true,
      id: existProjectId ? existProjectId : projectId,
    });


  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
