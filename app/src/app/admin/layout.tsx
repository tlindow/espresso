import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Operations - Espresso",
  description: "Internal operations dashboard",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold tracking-tight">
            espresso <span className="text-zinc-500">/ ops</span>
          </h1>
        </div>
        <div className="text-xs text-zinc-500">internal</div>
      </header>
      <main>{children}</main>
    </div>
  );
}
