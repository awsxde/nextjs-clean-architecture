import { notFound } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { UpdateRecord } from './edit-record';
import { getRecord } from '../../actions';

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  const recordId = parseInt(id, 10);

  if (isNaN(recordId)) {
    notFound();
  }

  const record = await getRecord(recordId);

  if (!record) {
    notFound();
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Update Record</h1>
        <p className="text-muted-foreground">Update the transaction details.</p>
      </div>
      <Separator />
      <UpdateRecord record={record} />
    </div>
  );
}
