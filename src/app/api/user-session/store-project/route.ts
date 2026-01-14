import { adminDb } from "@/lib/firebase-auth";
import { Timestamp } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { reportId, sessionId, Allocations, budgetInputs, email, projectId } = await request.json()
  try {
    let docRef: any;

    const fields: any = {
      "Report ID": reportId,
      "Session ID": sessionId,
      "Project ID": projectId,
      "Budget Inputs": budgetInputs,
      "Allocations": Allocations,
      "Owner Email": email ? email : null,
      "Created At": Timestamp.now()
    }
    docRef = await adminDb
      .collection("user_projects")
      .add({
        ...fields
      });


    return NextResponse.json({
      success: true,
      id: docRef.id,
    });


  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
