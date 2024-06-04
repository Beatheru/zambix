import Nav from "@/components/Nav";

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex h-screen min-h-lvh flex-col">
      <Nav />
      {children}
    </main>
  );
}
