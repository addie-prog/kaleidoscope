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
      });

      const data = await res.json();

      allRecords.push(...data.records);

      offset = data.offset; // if undefined → last page
    } while (offset);

    return Response.json({ records: allRecords });

  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
