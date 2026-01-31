import { adminDb } from "@/lib/firebase-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const project = searchParams.get("project");

    if (!project) {
        return Response.json({ error: "Project ID is required" }, { status: 400 });
    }

    // Query Firestore for this project
    const snapshot = await adminDb
        .collection("user_projects")
        .where("Project ID", "==", project)
        .get();

    // results
    const projectData: any[] = [];
    snapshot.forEach((doc) => {
        projectData.push({ id: doc.id, ...doc.data() });
    });

    return NextResponse.json({ data: projectData });
}
