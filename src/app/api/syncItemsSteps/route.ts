import { adminDb } from "@/lib/firebase-auth";
import { put } from "@vercel/blob";

export async function GET() {
  try {
    // 1 Fetch all items
    const itemsSnapshot = await adminDb.collection("items").get();
    const allItems: any[] = [];
    itemsSnapshot.forEach((doc) => {
      allItems.push({ id: doc.id, ...doc.data(), steps: [] }); // initialize steps array
    });

    // 2️ Fetch all steps
    const stepsSnapshot = await adminDb.collection("Steps").get();
    const allSteps: any[] = [];
    stepsSnapshot.forEach((doc) => {
      allSteps.push({ id: doc.id, ...doc.data() });
    });


    // 3️ Map steps to items by matching step.id === item.id
    const itemsWithSteps = allItems.map((item) => {
        const itemSteps = allSteps
            .filter((step) => step.id == item.id) // match by itemid
            .flatMap((s) => s.steps || []);          // flatten steps array
        return { ...item, steps: itemSteps };
        });

    // 4️ Convert to JSON
    const json = JSON.stringify(itemsWithSteps, null, 2);

    // 5️ Write to Vercel Blob
    await put("items2.json", json, {
      access: "public",
      contentType: "application/json",
      allowOverwrite: true,
    });

    return Response.json({
      success: true,
      count: itemsWithSteps.length,
    });
  } catch (error: any) {
    console.error(error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
