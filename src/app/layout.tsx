import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nucleo",
  description:
    "Hub central para organizar workspaces, clientes, projetos, agenda, documentos e credenciais.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
