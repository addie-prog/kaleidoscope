export async function POST(req: Request) {
  const { itemIds } = await req.json();
  const ServerURL = process.env.SERVER_URL;

  try {
    //  Fetch the blob
    const res = await fetch(`${ServerURL}/items2.json`, { cache: "no-store" });
    const records = await res.json();

    //   filter by IDs
    const idsToFetch = itemIds; 

    const filteredRecords = records.filter((item: any) => idsToFetch.includes(item.id));

    //  Return filtered records
    return Response.json({ records: filteredRecords });
  } catch (error: any) {
    return Response.json(
      { error: "Failed to read items2.json" },
      { status: 500 }
    );
  }
}
