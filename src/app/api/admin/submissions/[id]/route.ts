import { NextResponse } from "next/server";
import type { SubmissionStatus } from "@prisma/client";
import prisma from "@/lib/prisma";

const statusOptions: SubmissionStatus[] = ["NEW", "IN_PROGRESS", "PROCESSED"];

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "ID заявки не указан." }, { status: 400 });
  }

  try {
    await prisma.contactSubmission.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin delete error:", error);
    return NextResponse.json(
      { error: "Не удалось удалить заявку." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body as { status?: SubmissionStatus | string };
    const statusValue = status as SubmissionStatus;

    console.log(`[PATCH /api/admin/submissions/${id}] Status update request:`, statusValue);

    if (!id) {
      return NextResponse.json({ error: "ID заявки не указан." }, { status: 400 });
    }

    if (!status || !statusOptions.includes(statusValue)) {
      return NextResponse.json({ error: "Неверный статус." }, { status: 400 });
    }

    const updateData: { status: SubmissionStatus } = { status: statusValue as SubmissionStatus };

    const updated = await prisma.contactSubmission.update({
      where: { id },
      data: updateData,
    });

    console.log(`[PATCH /api/admin/submissions/${id}] Updated:`, updated.id);

    return NextResponse.json({ success: true, id: updated.id });
  } catch (error) {
    console.error("Admin update status error:", error);
    return NextResponse.json(
      { error: "Не удалось обновить статус заявки." },
      { status: 500 }
    );
  }
}
