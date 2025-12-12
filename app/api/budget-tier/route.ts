export async function GET() {
  try {
    const token = process.env.AIRTABLE_TOKEN;
    const APIDomain = process.env.AIRTABLE_DOMAIN;
    const appID = process.env.AIRTABLE_APPID;

    const res = await fetch(`${APIDomain}/v0/${appID}/Budget%20Tiers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    return Response.json(data);

  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}


// export async function POST(request) {
//   const body = await request.json();

//   return Response.json({
//     received: body
//   });
// }
