import { adminDb } from "@/lib/firebase-auth";
import { NextResponse } from "next/server";

export async function GET() {

  const principlesCol = await adminDb.collection("principles").get();
  const principleslist: Array<any> = principlesCol.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }))


  const executionsCol = await adminDb.collection("executions").get();
  const executionslist: Array<any> = executionsCol.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  const merged = principleslist?.sort((a, b) => a["Display Order"] - b["Display Order"])?.map((principle: any) => {
    const principleId = principle["Principle ID"];
    const subPrinciples = executionslist?.sort((a, b) => a["Display Order"] - b["Display Order"])
      .filter((layer: any) => layer.Principle === principleId)
      .map((layer: any) => ({
        id: layer.id,
        executionLayerId: layer["Execution Layer ID"],
        displayName: layer["Display Name"],
        description: layer.Description,
        displayOrder: layer["Display Order"],
      }));

    return {
      ...principle,
      subPrinciples,
    };
  });

  return NextResponse.json(merged);
}