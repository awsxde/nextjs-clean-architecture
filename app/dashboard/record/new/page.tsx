import { CreateRecord } from './add-record';
import { Separator } from '@/components/ui/separator';

export default async function Page() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Record</h1>
        <p className="text-muted-foreground">
          Add a new income or expense transaction
        </p>
      </div>
      <Separator />
      <CreateRecord />
    </div>
  );
}
