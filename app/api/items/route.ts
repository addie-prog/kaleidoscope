import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const token = process.env.AIRTABLE_TOKEN!;
    const APIDomain = process.env.AIRTABLE_DOMAIN!;
    const appID = process.env.AIRTABLE_APPID!;

    const baseUrl = `${APIDomain}/v0/${appID}/items?pageSize=3`;

    let allRecords: any[] = [];
    let offset: string | undefined = undefined;

    do {
      const url = new URL(baseUrl);
      if (offset) url.searchParams.set("offset", offset);

      const res = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch Airtable data");
      }

      const data = await res.json();
      allRecords.push(...data.records);
      offset = data.offset;
    } while (offset);

    // 📁 Save to file
    const dirPath = path.join(process.cwd(), "app", "data");
    const filePath = path.join(dirPath, "items.json");

    await fs.mkdir(dirPath, { recursive: true });

    await fs.writeFile(
      filePath,
      JSON.stringify(allRecords, null, 2),
      "utf-8"
    );

    return Response.json({
      success: true,
      count: allRecords.length,
      records: allRecords,
    });

  } catch (error: any) {
    console.error(error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
