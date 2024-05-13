import { DataTable } from '@/components/SearchableList/SearchableList';
import { columns } from './columns';
import { PrismaClient, Resources } from '@prisma/client';

const prisma = new PrismaClient();

async function getData(): Promise<Resources[]> {
    return await prisma.resources.findMany();
}

export default async function DemoPage() {
    const data = await getData();

    return (
        <>
            <div className='flex px-10 py-10'>
                <DataTable columns={columns} initialData={data} />
            </div>
        </>
    );
}
