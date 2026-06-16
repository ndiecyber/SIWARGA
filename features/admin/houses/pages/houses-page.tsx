import { Plus } from "lucide-react";

import prisma from "@/lib/db";
import { cn } from "@/lib/utils";
import { fraunces } from "@/lib/fonts";
import { SortOption } from "@/lib/types/sort";
import { Button } from "@/components/ui/button";
import { FilterCategory } from "@/lib/types/filter";
import { FieldDialog } from "@/components/shared/field-dialog";

import HousesTable from "./houses-table";
import { columns } from "../components/columns";
import { HouseCreateForm } from "../components/create-form";

export default async function HousesPage() {
  const data = await prisma.house.findMany({ include: { owner: true } });

  return (
    <main className="container mx-auto">
      <header className="flex items-center justify-between py-4 md:py-6">
        <h1 className={cn(fraunces.className, "text-3xl font-bold")}>Houses</h1>
        <FieldDialog
          title="Add new house"
          trigger={
            <Button variant="default">
              <Plus className="mr-2" />
              Add
            </Button>
          }
        >
          <HouseCreateForm />
        </FieldDialog>
      </header>

      <HousesTable data={data} columns={columns} />
    </main>
  );
}
