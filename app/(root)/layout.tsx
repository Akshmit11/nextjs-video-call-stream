import StreamVideoProvider from "@/providers/StreamClientProvider";
import { SignedIn, UserButton } from "@clerk/nextjs";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="w-full h-screen flex flex-col">
      <header className="p-4 flex justify-end bg-blue-300 w-full">
        <SignedIn>
          <UserButton showName />
        </SignedIn>
      </header>
      <section className="flex-1 bg-yellow-300">
        <StreamVideoProvider>
          <div className="h-full flex flex-col items-center justify-center">
            {children}
          </div>
        </StreamVideoProvider>
      </section>
      <footer className="h-[10vh] bg-blue-300">
        This a footer
      </footer>
    </main>
  );
}
