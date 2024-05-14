import { api } from "@/trpc/server";
import { useMemo, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "@/components/SearchableList/SearchableList";
import { type Resources } from "@prisma/client";

export default async function DemoPage() {
  const data: Array<Resources> = await api.resource.getAll();

  return (
    <>
      <div className="px-10 py-10">
        <DataTable columns={columns} initialData={data} />
      </div>
    </>
  );
}
