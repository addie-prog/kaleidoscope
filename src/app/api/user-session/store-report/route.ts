import { adminDb } from "@/lib/firebase-auth";
import { Timestamp } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { reportName, sessionId, techType, initialBudget, projectName, status, email } = await request.json()
  try {
    let docRef: any;

    const fields: any = {
      "Session ID": sessionId,
      "Report Name": reportName ?? null,
      "Date Created": Timestamp.now(),
      "Initial Budget": initialBudget,
      "Project Name": projectName ? projectName : null,
      "Status": status,
      "Tech Type": techType ?? null,
      "Email": email ?? null
    }
    docRef = await adminDb
      .collection("reports")
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
