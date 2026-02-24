import { adminDb } from "@/lib/firebase-auth";
import { Timestamp } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const {
      reportId,
      sessionId,
      type,
      items,
      Allocations,
      userNote,
      budgetInputs,
      email,
      projectId,
      principles,
      interation_data
    } = await request.json();

    if (!projectId) {
      return NextResponse.json(
        { error: "projectId is required" },
        { status: 400 }
      );
    }

    const docRef = adminDb
      .collection("user_projects")
      .doc(projectId);

    const docSnap = await docRef.get();
    const isExisting = docSnap.exists;

    let fields: any = {};

    if (reportId) {
      fields = {
        "Report ID": reportId,
        "Session ID": sessionId,
        "Budget Inputs": budgetInputs,
        "Allocations": Allocations,
        "Owner Email": email ? email : null,
        "items": items,
        "User Notes": userNote,
        "principles": principles,
        "interation_data": interation_data ? interation_data : null
      };
    } else {
      fields = {
        "interation_data": interation_data ? interation_data : null,
        "Owner Email": email ? email : null
      };
    }

    if (type == 1) {
      fields["Magic Link Sent"] = true;
    }

    fields["Project ID"] = projectId;
    fields["Last Updated"] = Timestamp.now();

    // Created At if new document
    if (!isExisting) {
      fields["Created At"] = Timestamp.now();
       await docRef.set(fields);
    }else{
      await docRef.update(fields);
    }


    // Fetch updated document
    const updatedDoc = await docRef.get();

    const projectData = updatedDoc.exists
      ? { id: updatedDoc.id, ...updatedDoc.data() }
      : null;

    return NextResponse.json({
      success: true,
      data: projectData
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
