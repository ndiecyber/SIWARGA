import { Plus } from "lucide-react";

import { fraunces } from "@/lib/fonts";
import { FilterCategory } from "@/lib/types/filter";
import { HouseStatus } from "@/generated/prisma/enums";
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

type User = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  phoneNumber: string;
};

type House = {
  id: string;
  houseNumber: string;
  block: string;
  status: HouseStatus;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string | null;
  owner: User;
  residents?: number;
};

export const dummyUsers: User[] = [
  {
    id: "usr_001",
    createdAt: new Date("2025-01-10T08:00:00Z"),
    updatedAt: new Date("2025-01-10T08:00:00Z"),
    name: "John Doe",
    phoneNumber: "+6281234567890",
  },
  {
    id: "usr_002",
    createdAt: new Date("2025-01-12T09:30:00Z"),
    updatedAt: new Date("2025-03-01T14:20:00Z"),
    name: "Jane Smith",
    phoneNumber: "+6289876543210",
  },
  {
    id: "usr_003",
    createdAt: new Date("2025-02-05T11:15:00Z"),
    updatedAt: new Date("2025-02-20T16:45:00Z"),
    name: "Michael Johnson",
    phoneNumber: "+628111223344",
  },
];

export const dummyHouses: House[] = [
  {
    id: "house_001",
    houseNumber: "A1",
    block: "A",
    status: HouseStatus.OCCUPIED,
    createdAt: new Date("2025-01-15T08:00:00Z"),
    updatedAt: new Date("2025-02-01T10:00:00Z"),
    ownerId: dummyUsers[0].id,
    owner: dummyUsers[0],
  },
  {
    id: "house_002",
    houseNumber: "A2",
    block: "A",
    status: HouseStatus.OCCUPIED,
    createdAt: new Date("2025-01-16T08:00:00Z"),
    updatedAt: new Date("2025-02-02T10:00:00Z"),
    ownerId: dummyUsers[1].id,
    owner: dummyUsers[1],
  },
  {
    id: "house_003",
    houseNumber: "B1",
    block: "B",
    status: HouseStatus.OCCUPIED,
    createdAt: new Date("2025-01-17T08:00:00Z"),
    updatedAt: new Date("2025-02-03T10:00:00Z"),
    ownerId: dummyUsers[2].id,
    owner: dummyUsers[2],
  },
  {
    id: "house_004",
    houseNumber: "B2",
    block: "B",
    status: HouseStatus.VACANT,
    createdAt: new Date("2025-01-18T08:00:00Z"),
    updatedAt: new Date("2025-01-18T08:00:00Z"),
    ownerId: null,
    owner: {
      id: "",
      name: "",
      phoneNumber: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
];

export default async function HousesIndex() {
  return (
    <main className="container mx-auto py-10">
      <header className="flex items-center justify-between py-4 md:py-6">
        <h1 className={(fraunces.className, "text-3xl font-bold")}>Houses</h1>
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
        data={dummyHouses}
        filterCategories={FILTER_CATEGORIES}
      />
    </main>
  );
}
