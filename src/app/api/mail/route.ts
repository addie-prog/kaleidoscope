import { adminDb } from "@/lib/firebase-auth";
import { NextResponse } from "next/server";

// export async function POST() {
//   const snap = await adminDb.collection("mail").add({
//     to: "ashima.sharma@brihaspatitech.com",
//     message: {
//       subject: "Welcome to Kaleidoscope",
//       text: "This is a test email sent via Firebase extension.",
//       html: "<p>This is a <strong>test email</strong> sent via Firebase extension.</p>",
//     },
//   });
//    console.log("Mail document created with ID:", snap.id);

//   return NextResponse.json({ success: true, snap }, { status: 200 });
// }
