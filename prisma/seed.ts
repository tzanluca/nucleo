/**
 * Popular o banco com dados de exemplo para explorar o app.
 * Uso: npm run db:seed
 *
 * Idempotente por slug de workspace: rodar de novo não duplica.
 */
import { PrismaClient } from "@prisma/client";
import { SecretCipher, keyFromBase64 } from "../src/lib/crypto/secret-cipher";

const prisma = new PrismaClient();

function inDays(days: number, hour: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, 0, 0, 0);
  return date;
}

async function main(): Promise<void> {
  const existing = await prisma.workspace.findUnique({
    where: { slug: "estudio-aurora" },
  });
  if (existing) {
    console.log("Seed já aplicado (workspace 'estudio-aurora' existe). Nada a fazer.");
    return;
  }

  const workspace = await prisma.workspace.create({
    data: {
      name: "Estúdio Aurora",
      slug: "estudio-aurora",
      description: "Cliente de exemplo — agência de design.",
      color: "#8b5cf6",
    },
  });

  const client = await prisma.client.create({
    data: {
      workspaceId: workspace.id,
      name: "Aurora Studio Ltda",
      company: "Aurora",
      email: "contato@aurora.example",
    },
  });

  const project = await prisma.project.create({
    data: {
      workspaceId: workspace.id,
      clientId: client.id,
      name: "Redesign do site",
      description: "Nova identidade visual e site institucional.",
      status: "active",
      startDate: inDays(-7, 9),
      dueDate: inDays(30, 18),
    },
  });

  await prisma.event.create({
    data: {
      workspaceId: workspace.id,
      projectId: project.id,
      title: "Reunião de kickoff",
      startsAt: inDays(1, 14),
      endsAt: inDays(1, 15),
      location: "Google Meet",
    },
  });

  await prisma.contact.create({
    data: {
      workspaceId: workspace.id,
      clientId: client.id,
      name: "Marina Alves",
      role: "Diretora de arte",
      email: "marina@aurora.example",
    },
  });

  const encryptionKey = process.env.ENCRYPTION_KEY;
  if (encryptionKey) {
    const cipher = new SecretCipher(keyFromBase64(encryptionKey));
    await prisma.credential.create({
      data: {
        workspaceId: workspace.id,
        projectId: project.id,
        label: "Painel de hospedagem",
        username: "admin",
        url: "https://painel.aurora.example",
        secretCiphertext: cipher.encrypt("troque-esta-senha"),
      },
    });
  } else {
    console.log("ENCRYPTION_KEY não definida: pulei a credencial de exemplo.");
  }

  console.log(`Seed pronto. Workspace criada: /w/${workspace.slug}`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
