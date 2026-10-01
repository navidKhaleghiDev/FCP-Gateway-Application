import type { ReactNode } from 'react';

export interface DataTableColumn<T> {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  rows: readonly T[];
  columns: readonly DataTableColumn<T>[];
  rowKey: (row: T) => string;
}

/**
 * Generic presentational table driven by typed column accessors.
 * @component
 * @template T Row data type.
 * @param {DataTableProps<T>} props - Rows, columns, and row key configuration.
 * @returns {JSX.Element} A typed data table.
 */


export function DataTable<T>({ rows, columns, rowKey }: DataTableProps<T>) {
  return (
    <table className="w-full min-w-[1100px] border-collapse text-right text-sm">
      <thead>
        <tr className="bg-slate-100 text-xs text-gray-500">
          {columns.map((column) => (
            <th key={column.key} className="sticky top-0 z-10 border-b border-gray-200 bg-slate-100 px-5 py-4 font-medium">
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={rowKey(row)} className="border-b border-gray-200 transition hover:bg-teal-50/50">
            {columns.map((column) => (
              <td key={column.key} className={column.className ?? 'px-5 py-5'}>
                {column.cell(row)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
