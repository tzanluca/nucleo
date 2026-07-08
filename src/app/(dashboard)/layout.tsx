import { requireSession } from "@/lib/auth/require-session";
import { Sidebar } from "@/components/nav/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Redundante com o middleware, mas garante a sessão mesmo se o matcher mudar.
  await requireSession();

  return (
    <div className="flex">
      <Sidebar />
      <main className="h-screen flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
