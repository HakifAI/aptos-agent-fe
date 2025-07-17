import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {

  return (
    <main className="min-h-screen flex flex-col gap-10 items-center justify-center">
      <h2 className="text-3xl md:text-5xl font-semibold">
        Page not found
      </h2>
      <Button>
        <Link href="/">Home page</Link>
      </Button>
    </main>
  );
}
