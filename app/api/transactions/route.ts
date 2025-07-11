import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("finance");
  const transactions = await db.collection("transactions").find().toArray();
  return NextResponse.json(transactions);
}

export async function POST(req: NextRequest) {
  const { amount, date, description } = await req.json();
  const client = await clientPromise;
  const db = client.db("finance");
  const result = await db.collection("transactions").insertOne({ amount, date, description });
  return NextResponse.json(result);
}