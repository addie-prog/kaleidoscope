import puppeteer from "puppeteer";
import puppeteerCore from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json();

  const isProd = process.env.NODE_ENV != "development";

  const browser = isProd
    ? await puppeteerCore.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: true,
      })
    : await puppeteer.launch({
        headless: true,
      });

  const page = await browser.newPage();

  await page.evaluateOnNewDocument((data: any) => {
    (window as any).__PDF_DATA__ = data;
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
