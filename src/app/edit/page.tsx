import { DataTable } from "@/components/SearchableList/SearchableList";
import { columns } from "./columns";
import { PrismaClient, type Resources } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import { api } from "@/trpc/server";

const prisma = new PrismaClient();

export default async function DemoPage() {
  const data = useMemo(async () => {
    return await api.resource.getAll();
  }, []);

  return (
    <>
      <div className="flex px-10 py-10">
        <DataTable columns={columns} initialData={data} />
      </div>
    </>
  );
}
