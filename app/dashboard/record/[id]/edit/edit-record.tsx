'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { types, categories } from '@/constants/record';
import { updateRecord, deleteRecord } from '../../actions';
import { Record } from '@/src/entities/models/record';

const incomeCategoryValues = ['salary', 'freelance', 'investment', 'gift'];
const expenseCategoryValues = categories
  .map((c) => c.value)
  .filter((v) => !incomeCategoryValues.includes(v));

const formSchema = z.object({
  id: z.number(), // hidden field for record ID
  description: z
    .string()
    .min(1, 'Description is required.')
    .max(500, 'Description must be at most 500 characters.'),
  amount: z
    .number({ invalid_type_error: 'Amount must be a number.' })
    .positive('Amount must be positive.'),
  date: z.date({ required_error: 'Date is required.' }),
  type: z.enum(types.map((t) => t.value) as [string, ...string[]], {
    required_error: 'Please select a type.',
  }),
  category: z.enum(categories.map((c) => c.value) as [string, ...string[]], {
    required_error: 'Please select a category.',
  }),
});

type FormData = z.infer<typeof formSchema>;

interface UpdateRecordProps {
  record: Record; // the record fetched server-side
}

export function UpdateRecord({ record }: UpdateRecordProps) {
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    resetField,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: record.id,
      description: record.description,
      amount: record.amount,
      date: new Date(record.date), // convert string/ISO to Date
      type: record.type,
      category: record.category,
    },
  });

  const selectedType = watch('type');

  // Reset category when type changes
  useEffect(() => {
    resetField('category');
  }, [selectedType, resetField]);

  // Filter categories based on selected type
  const filteredCategories = categories.filter((cat) => {
    if (selectedType === 'income') {
      return incomeCategoryValues.includes(cat.value);
    } else if (selectedType === 'expense') {
      return expenseCategoryValues.includes(cat.value);
    }
    return false; // hide all when no type selected
  });

  async function onSubmit(data: FormData) {
    if (loading) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('id', String(data.id));
    formData.append('description', data.description);
    formData.append('amount', String(data.amount));
    formData.append('date', format(data.date, 'yyyy-MM-dd'));
    formData.append('type', data.type);
    formData.append('category', data.category);

    const res = await updateRecord(formData);

    if (res) {
      if (res.error) {
        toast.error(res.error);
      } else if (res.success) {
        toast.success('Record updated!');
        router.push('/dashboard/record');
      }
    }
    setLoading(false);
  }

  async function handleDelete() {
    setDeleteLoading(true);
    const res = await deleteRecord(record.id);
    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success('Record deleted');
      router.push('/dashboard/record');
    }
    setDeleteLoading(false);
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Record</CardTitle>
        <CardDescription>Update the transaction details.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="update-record-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Hidden ID field */}
          <input type="hidden" {...control.register('id')} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    disabled={loading}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                    value={field.value ?? ''}
                    aria-invalid={!!errors.amount}
                    className="w-full"
                  />
                )}
              />
              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount.message}</p>
              )}
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label>Date</Label>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                        disabled={loading}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.date && (
                <p className="text-sm text-red-500">{errors.date.message}</p>
              )}
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={loading}
                  >
                    <SelectTrigger
                      id="type"
                      className="w-full"
                      aria-invalid={!!errors.type}
                    >
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          <div className="flex items-center">
                            <t.icon className="mr-2 h-4 w-4" />
                            {t.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={loading || !selectedType}
                  >
                    <SelectTrigger
                      id="category"
                      className="w-full"
                      aria-invalid={!!errors.category}
                    >
                      <SelectValue
                        placeholder={
                          !selectedType
                            ? 'Select a type first'
                            : 'Select a category'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredCategories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          <div className="flex items-center">
                            <cat.icon className="mr-2 h-4 w-4" />
                            {cat.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <p className="text-sm text-red-500">
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="description"
                  placeholder="Grocery shopping"
                  disabled={loading}
                  aria-invalid={!!errors.description}
                  rows={5}
                  className="min-h-[120px]"
                />
              )}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={loading || deleteLoading}>
              {deleteLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                record.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => reset()}
            disabled={loading || !isDirty}
          >
            Reset
          </Button>
          <Button
            type="submit"
            form="update-record-form"
            disabled={loading || !isDirty}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Record
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
