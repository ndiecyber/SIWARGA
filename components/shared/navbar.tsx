import { HouseIcon } from "lucide-react";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { fraunces } from "@/lib/fonts";
import { Button } from "@/components/ui/button";

function Navbar() {
  return (
    <header className="w-full border-b border-b-border">
      <div className="flex items-center justify-between w-full px-4 py-4 mx-auto max-w-275">
        <Link href="/" className="flex items-center gap-2 pl-2 pr-4">
          <div className="p-2 rounded-md bg-primary text-primary-foreground">
            <HouseIcon size={24} />
          </div>
          <div className="flex flex-col items-start gap-1">
            <h1 className={cn(fraunces.className, "text-xl font-bold")}>
              Logo
            </h1>
            <span className="text-xs font-semibold text-muted-foreground">
              RT 04 RW 02
            </span>
          </div>
        </Link>

        <nav>
          <ul className="flex items-center gap-4">
            <li>
              <Button variant="ghost">
                <Link href="#">Beranda</Link>
              </Button>
            </li>
            <li>
              <Button variant="ghost">
                <Link href="#">Fitur</Link>
              </Button>
            </li>
            <li>
              <Button variant="ghost">
                <Link href="#">Modul</Link>
              </Button>
            </li>
            <li>
              <Button variant="ghost">
                <Link href="#">FAQ</Link>
              </Button>
            </li>
            <li>
              <Button variant="ghost">
                <Link href="#">Kontak</Link>
              </Button>
            </li>
          </ul>
        </nav>

        <div className="space-x-2">
          <Button variant="outline">Sign-in</Button>
          <Button variant="default">Register</Button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
