import puppeteer from "puppeteer";

export async function POST(req: Request) {
  const body = await req.json();

  const browser = await puppeteer.launch({
    headless: "new",
  });

  const page = await browser.newPage();

  // Inject data BEFORE page loads
  await page.evaluateOnNewDocument((data) => {
    window.__PDF_DATA__ = data;
  }, body);

  await page.goto(`${process.env.NEXT_PUBLIC_APP_URL}/pdf`, {
    waitUntil: "networkidle0",
  });

  const pdf: any = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=report.pdf",
    },
  });
}
