

export async function GET() {
  const ServerURL = process.env.SERVER_URL;
  try {
    // const filePath = path.join(
    //   process.cwd(),
    //   "app",
    //   "data",
    //   "items.json"
    // );
const res = await fetch(
    `${ServerURL}/kaleidoscope/items.json`,
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
