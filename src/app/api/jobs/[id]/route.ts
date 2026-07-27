import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      slug,
      titleId,
      titleEn,
      departmentId,
      location,
      type,
      summaryId,
      summaryEn,
      responsibilitiesId,
      responsibilitiesEn,
      requirementsId,
      requirementsEn,
      applyUrl,
      sortOrder,
      isActive,
    } = body;

    const job = await prisma.job.update({
      where: { id: parseInt(id) },
      data: {
        ...(slug !== undefined && { slug }),
        ...(titleId !== undefined && { titleId }),
        ...(titleEn !== undefined && { titleEn }),
        ...(departmentId !== undefined && { departmentId }),
        ...(location !== undefined && { location }),
        ...(type !== undefined && { type }),
        ...(summaryId !== undefined && { summaryId }),
        ...(summaryEn !== undefined && { summaryEn }),
        ...(responsibilitiesId !== undefined && {
          responsibilitiesId: JSON.stringify(responsibilitiesId),
        }),
        ...(responsibilitiesEn !== undefined && {
          responsibilitiesEn: JSON.stringify(responsibilitiesEn),
        }),
        ...(requirementsId !== undefined && {
          requirementsId: JSON.stringify(requirementsId),
        }),
        ...(requirementsEn !== undefined && {
          requirementsEn: JSON.stringify(requirementsEn),
        }),
        ...(applyUrl !== undefined && { applyUrl }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(isActive !== undefined && { isActive }),
      },
      include: { department: true },
    });

    return NextResponse.json({ job });
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const job = await prisma.job.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ job });
  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
