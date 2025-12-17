export async function POST(request: Request) {
     const { reportName, sessionId, techType, initialBudget, projectName, status, email } = await request.json()
    try {
        const token = process.env.AIRTABLE_TOKEN;
        const APIDomain = process.env.AIRTABLE_DOMAIN;
        const appID = process.env.AIRTABLE_APPID;

        const res = await fetch(`${APIDomain}/v0/${appID}/Reports`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
            records: [
                {
                    fields: {
                    "Report Name": reportName,
                    "Session ID": sessionId,
                    "Status": status,
                    "Tech Type": techType,
                    "Initial Budget": initialBudget,
                    "Project Name":projectName,
                    "Email": email
                }
            }
            ]
        })
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
