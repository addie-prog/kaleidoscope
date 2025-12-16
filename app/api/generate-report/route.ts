import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(
      process.cwd(),
      "app",
      "data",
      "items.json"
    );

    const file = await fs.readFile(filePath, "utf-8");
    const records = JSON.parse(file);

    return Response.json({ records });

  } catch (error: any) {
    return Response.json(
      { error: "Failed to read items.json" },
      { status: 500 }
    );
  }
}
