import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/mongodb";
import Recipe from "@/models/Recipe";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    await dbConnect();

    const session = await getServerSession(authOptions);
    const isAdmin = (session?.user as any)?.role === "admin";

    const query: any = { slug: resolvedParams.slug };
    if (!isAdmin) query.isVisible = { $ne: false };

    const recipe = await Recipe.findOne(query).lean();

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    return NextResponse.json(recipe);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch recipe" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    await dbConnect();
    const data = await request.json();

    const { _id, authorId, createdAt, updatedAt, ...updateData } = data;

    const recipe = await Recipe.findOneAndUpdate(
      { slug: resolvedParams.slug },
      updateData,
      { new: true, runValidators: true }
    );

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    return NextResponse.json(recipe);
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error.code === 11000) {
      return NextResponse.json({ error: "A recipe with this slug already exists." }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Failed to update recipe" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    await dbConnect();

    const recipe = await Recipe.findOneAndDelete({ slug: resolvedParams.slug });

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Recipe deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete recipe" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    await dbConnect();
    const data = await request.json();

    if (typeof data.isVisible !== "boolean") {
      return NextResponse.json({ error: "isVisible must be a boolean" }, { status: 400 });
    }

    const recipe = await Recipe.findOneAndUpdate(
      { slug: resolvedParams.slug },
      { isVisible: data.isVisible },
      { new: true, runValidators: true }
    );

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    return NextResponse.json(recipe);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update recipe visibility" }, { status: 500 });
  }
}
