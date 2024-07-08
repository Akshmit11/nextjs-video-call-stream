import StreamVideoProvider from "@/providers/StreamClientProvider";
import { SignedIn, UserButton } from "@clerk/nextjs";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="w-full h-screen flex flex-col">
      <header className="p-4 self-end">
        <SignedIn>
          <UserButton showName />
        </SignedIn>
      </header>
      <StreamVideoProvider>
        <div className="h-full flex flex-col items-center justify-center">
          {children}
        </div>
      </StreamVideoProvider>
    </main>
  );
}
