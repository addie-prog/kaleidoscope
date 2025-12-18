
import { promises as fs } from 'fs';


export async function GET() {
  const file = await fs.readFile(process.cwd() + '/app/data/items.json', 'utf8');
  const data = JSON.parse(file);
  const ServerURL = process.env.SERVER_URL;
  try {

    // const res = await fetch(
    //   `${ServerURL}/items.json`,
    //   { cache: "no-store" }
    // );

    const records = data;

    return Response.json({ records });

  } catch (error: any) {
    return Response.json(
      { error: "Failed to read items.json" },
      { status: 500 }
    );
  }
}
