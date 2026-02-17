'use client';

import { ColumnDef } from '@tanstack/react-table';

import { types, categories } from '@/constants/record';
import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { DataTableRowActions } from '@/app/dashboard/record/components/data-table-row-actions';
import { Record } from '@/src/entities/models/record';

export const columns: ColumnDef<Record>[] = [
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Description"
        className="px-4"
      />
    ),
    cell: ({ row }) => {
      return (
        <span className="max-w-[500px] truncate font-medium px-4">
          {row.getValue('description')}
        </span>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      return <span>{row.getValue('amount')}</span>;
    },
  },
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      return <span>{row.getValue('date')}</span>;
    },
  },
  {
    accessorKey: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const category = categories.find(
        (category) => category.value === row.getValue('category')
      );

      if (!category) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {category.icon && (
            <category.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{category.label}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const type = types.find((type) => type.value === row.getValue('type'));

      if (!type) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {type.icon && (
            <type.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{type.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
