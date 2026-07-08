import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { readSession } from "@/lib/auth/session-cookie";
import { readStored } from "@/lib/storage";

/**
 * Entrega o binário de um documento. O middleware já barra anônimos, mas
 * revalidamos a sessão aqui por defesa em profundidade (rota fora do dashboard).
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  if (!(await readSession())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;
  const document = await prisma.document.findUnique({ where: { id } });
  if (!document) {
    return NextResponse.json({ error: "Documento não encontrado." }, { status: 404 });
  }

  const file = await readStored(document.storedName).catch(() => null);
  if (!file) {
    return NextResponse.json(
      { error: "Arquivo ausente no armazenamento." },
      { status: 410 },
    );
  }

  return new NextResponse(new Uint8Array(file), {
    headers: {
      "Content-Type": document.mimeType,
      "Content-Length": String(document.sizeBytes),
      "Content-Disposition": `inline; filename="${encodeURIComponent(document.originalName)}"`,
    },
  });
}
