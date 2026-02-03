import { adminDb } from "@/lib/firebase-auth";
import { render } from "@react-email/render";
import { NextResponse } from "next/server";
import ProjectAccessEmail from "@/email/ProjectAccessEmail";

export async function POST(request: Request) {
  const { projectName, email, link } = await request.json();
  
  const html = await render(
    <ProjectAccessEmail
      projectName={projectName}
      accessLink={link}
    />
  );
  const snap = await adminDb.collection("mail").add({
    to: email,
    message: {
      subject: "Your Secure Project Access Link",
      text: "Please visit the link to access your project.",
      html: html,
    },
  });
  console.log("Mail document created with ID:", snap.id);

  return NextResponse.json({ success: true, snap }, { status: 200 });
}
