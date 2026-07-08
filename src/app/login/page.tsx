import { redirect } from "next/navigation";
import { readSession } from "@/lib/auth/session-cookie";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  // Já autenticado? Não faz sentido ver o login.
  if (await readSession()) redirect("/");

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <LoginForm />
    </main>
  );
}
