import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/mongodb";
import Recipe from "@/models/Recipe";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");

    const recipes = await Recipe.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json(recipes);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch recipes" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const data = await request.json();

    const recipe = await Recipe.create({
      ...data,
      authorId: "000000000000000000000000", // Dummy ID since we don't have real users in DB
    });

    return NextResponse.json(recipe, { status: 201 });
  } catch (error: any) {
    // Check for duplicate slug error (code 11000 in MongoDB)
    if (error.code === 11000) {
      return NextResponse.json({ error: "A recipe with this slug already exists." }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Failed to create recipe" }, { status: 500 });
  }
}
