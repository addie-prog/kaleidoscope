


export async function GET() {
  const ServerURL = process.env.SERVER_URL;
  try {

    const res = await fetch(
      `${ServerURL}/items.json`,
      { cache: "no-store" }
    );

    const records = await res.json();

    return Response.json({ records });

  } catch (error: any) {
    return Response.json(
      { error: "Failed to read items.json" },
      { status: 500 }
    );
  }
}
