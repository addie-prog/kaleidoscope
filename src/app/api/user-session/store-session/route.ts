import { adminDb } from "@/lib/firebase-auth";
import { Timestamp } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { recordId, sessionId, userType, type, UTCSource, Email, reportId } = await request.json()
    try {
        let docRef: any;

        const fields: any = {
            "Session ID": sessionId,
            "User Type": userType,
            "UTM Source": UTCSource ?? null,
            "Email": Email ?? null
        }
        if (reportId) {
            fields["Reports"] = reportId.split(",");
        }else{
            fields["Reports"] = null;
        }
        if (type == 1) {
            fields["Date Joined"] = Timestamp.now();
            fields["Date Updated"] = null;
        }

        if (recordId) {

            docRef = adminDb.collection("sessions").doc(recordId);

            // Update document (only fields you pass will be updated)
            await docRef.update({
                ...fields,
                "Date Updated": Timestamp.now() // track update time
            });
        }
        else {
            docRef = await adminDb
                .collection("sessions")
                .add({
                    ...fields
                });
        }


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
