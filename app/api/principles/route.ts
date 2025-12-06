export async function GET() {
  try {
    const token = process.env.AIRTABLE_TOKEN;
    const APIDomain = process.env.AIRTABLE_DOMAIN;
    const appID = process.env.AIRTABLE_APPID;

    // Fetch Principles
    const principlesRes = await fetch(
      `${APIDomain}/v0/${appID}/Principles?view=Grid%20view`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const principlesData = await principlesRes.json();

    // Fetch Execution Layers (Subprinciples)
    const layersRes = await fetch(
      `${APIDomain}/v0/${appID}/Execution_Layers?view=Grid%20view`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const layersData = await layersRes.json();

    // Merge execution layers into principles
    const merged = principlesData.records.map((principle: any) => {
      const principleId = principle.fields["Principle ID"];
      const subPrinciples = layersData.records
        .filter((layer: any) => layer.fields.Principle === principleId)
        .map((layer: any) => ({
          id: layer.id,
          executionLayerId: layer.fields["Execution Layer ID"],
          displayName: layer.fields["Display Name"],
          description: layer.fields.Description,
          displayOrder: layer.fields["Display Order"],
        }));

      return {
        ...principle,
        subPrinciples,
      };
    });

    return Response.json({ records: merged });

  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
