import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ButtonActionDropdownProps {
  children: React.ReactNode;
}

export default function ButtonActionDropdown({
  children,
}: ButtonActionDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground hover:text-foreground"
        >
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Buka menu aksi</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="flex flex-col gap-1 p-1">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
