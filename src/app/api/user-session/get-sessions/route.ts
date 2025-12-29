export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const pageSize = searchParams.get("pageSize");
    const offset = searchParams.get("offset");

    try {
        const token = process.env.AIRTABLE_TOKEN;
        const APIDomain = process.env.AIRTABLE_DOMAIN;
        const appID = process.env.AIRTABLE_APPID;
        let record: any;
        let method = "GET";

      let offsetParam = "";
        if(offset){
            offsetParam=`&offset=${offset}`;
        }
        const res = await fetch(`${APIDomain}/v0/${appID}/Sessions?pageSize=${pageSize}${offsetParam}&sort[0][field]=Date%20Joined&sort[0][direction]=desc`, {
            method: method,
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });

        const data = await res.json();
        if (!res.ok) {
            return Response.json(
                { error: data?.error || "Airtable request failed" },
                { status: res.status }
            );
        }

    return Response.json(data, { status: 200 });
    } catch (error: any) {
         return Response.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
            );
    }
}
