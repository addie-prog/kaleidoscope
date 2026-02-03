import { adminDb } from "@/lib/firebase-auth";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { NextResponse } from "next/server";


// Function to upsert a session document
async function upsertSession(sessionID: string, sessionData: any) {
    const sessionRef = sessionID
    ? adminDb.collection("sessions").doc(sessionID)
    : adminDb.collection("sessions").doc();

    await sessionRef.set(sessionData, { merge: true });

    return sessionRef.id;
}

export async function POST(request: Request) {
    const { recordId, userType, type, UTCSource, Email, reportId } = await request.json()
    try {
        const fields: any = {
            "User Type": userType,
            "UTM Source": UTCSource ?? null,
            "Email": Email ?? null
        }
        if (reportId) {
            fields["Reports"] = FieldValue.arrayUnion(reportId);
        }
        if (type == 1) {
            fields["Date Joined"] = Timestamp.now();
        }
        const docId = await upsertSession(recordId, fields);

        return NextResponse.json({
            success: true,
            id: docId,
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
