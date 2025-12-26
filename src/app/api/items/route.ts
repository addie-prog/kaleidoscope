import { put } from "@vercel/blob";


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
    const json = JSON.stringify(allRecords, null, 2);


    // Overwrite existing blob
    await put("items.json", json, {
      access: "public",
      contentType: "application/json",
      allowOverwrite: true
    });
   return Response.json({
      success: true,
      count: allRecords.length,
    });

  } catch (error: any) {
    console.error(error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
