import { api } from "@/trpc/server";
import { columns } from "./columns";
import { DataGrid } from "@/components/List/DataGrid";
import { type Resources } from "@prisma/client";

export default async function DemoPage() {
  const data: Array<Resources> = await api.resource.getAll();

  return (
    <>
      <div className="px-10 py-10">
        <DataGrid _columns={columns} _data={data} />
      </div>
    </>
  );
}
