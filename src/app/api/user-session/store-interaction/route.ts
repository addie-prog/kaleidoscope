export async function POST(request: Request) {
     const { reportName, itemName, interactionStatus, DateCreated, userNotes, allocatedCost } = await request.json()
    try {
        const token = process.env.AIRTABLE_TOKEN;
        const APIDomain = process.env.AIRTABLE_DOMAIN;
        const appID = process.env.AIRTABLE_APPID;
        const records = itemName.map((itemN: any, i: number) => {
            return  {
                    fields: {
                    "Interaction ID": `Int_${Date.now()}`,
                    "Report Name": reportName,
                    "Item Name":itemN ?? [],
                    "Interaction Status": interactionStatus,
                    "User Notes": userNotes,
                    "Allocated Cost":allocatedCost[i],
                    "Date Created": DateCreated
                }
            };
        });

        
        const res = await fetch(`${APIDomain}/v0/${appID}/Interactions`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
            records
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
