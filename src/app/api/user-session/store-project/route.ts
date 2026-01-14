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
      "Owner Email": email ? email : null,
      "Created At": Timestamp.now()
    }

    if (existProjectId) {

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
