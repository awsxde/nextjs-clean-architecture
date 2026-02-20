import { Record } from '@/src/entities/models/record';
import { columns } from '@/app/dashboard/record/components/columns';
import { DataTable } from '@/app/dashboard/record/components/data-table';
import { getRecords } from './actions';

export default async function Page() {
  let records: Record[];
  try {
    records = await getRecords();
  } catch (err) {
    throw err;
  }

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <DataTable data={records} columns={columns} />
    </div>
  );
}
