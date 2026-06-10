import { Plus } from "lucide-react";

import prisma from "@/lib/db";
import { cn } from "@/lib/utils";
import { fraunces } from "@/lib/fonts";
import { FilterCategory } from "@/lib/types/filter";
import { DataTable } from "@/components/shared/data-table";
import { FieldDialog } from "@/components/shared/field-dialog";

import { columns } from "../components/columns";
import { HouseCreateForm } from "../components/create-form";

// ─── Constants ───────────────────────────────────────────────────────────────

const FILTER_CATEGORIES: FilterCategory[] = [
  {
    id: "block",
    label: "Block",
    options: [
      {
        label: "A",
        value: "A",
        icon: (
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
        ),
      },
      {
        label: "B",
        value: "B",
        icon: <span className="inline-block h-2 w-2 rounded-full bg-red-500" />,
      },
      {
        label: "C",
        value: "C",
        icon: (
          <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
        ),
      },
      {
        label: "D",
        value: "D",
        icon: <span className="inline-block h-2 w-2 rounded-full bg-sky-500" />,
      },
    ],
  },
];

export default async function HousesIndex() {
  const data = await prisma.house.findMany({});

  return (
    <main className="container mx-auto">
      <header className="flex items-center justify-between py-4 md:py-6">
        <h1 className={cn(fraunces.className, "text-3xl font-bold")}>Houses</h1>
        <FieldDialog
          label="Add new house"
          title="Add new house"
          icon={<Plus className="mr-2" />}
        >
          <HouseCreateForm />
        </FieldDialog>
      </header>

      <DataTable
        columns={columns}
        data={data}
        filterCategories={FILTER_CATEGORIES}
      />
    </main>
  );
}
