export async function POST(request: Request) {
     const { recordId, sessionId, userType, DateJoined, DateUpdated, type, UTCSource, Email, reportId } = await request.json()
    try {
        const token = process.env.AIRTABLE_TOKEN;
        const APIDomain = process.env.AIRTABLE_DOMAIN;
        const appID = process.env.AIRTABLE_APPID;
        let record: any;
        let method = "POST";

        const fields:any = {
            "Session ID":sessionId,
            "User Type": userType,
            "UTM Source": UTCSource ?? "",
            "Email": Email,
            "Date Updated": DateUpdated
        } 
        if(reportId){
            fields["Reports"] = reportId.split(",");
        }
        if(type == 1){
            fields["Date Joined"] = DateJoined;
        }

        if( recordId ){
            method = "PATCH";
            record =   [
                    {
                        "id": recordId,
                        fields: fields
                }
                ]
        }
        else{
            record =   [
                {
                    fields: fields
            }
            ]
        }
        const res = await fetch(`${APIDomain}/v0/${appID}/Sessions`, {
            method: method,
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
            records: record
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
