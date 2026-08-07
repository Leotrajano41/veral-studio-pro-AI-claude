import { cn } from '../../lib/utils';

export default function Table({ columns = [], data = [], emptyMessage = 'Nenhum item encontrado.', className }) {
  return (
    <div className={cn('w-full overflow-x-auto rounded-card border border-[#444444] bg-[#2a2a2a]', className)}>
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-[#444444] text-[#B0B0B0] uppercase tracking-wider font-semibold bg-[#333333]/50">
            {columns.map((col, idx) => (
              <th key={idx} className={cn('p-3.5', col.headerClassName)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#444444]/50">
          {data.map((row, rowIdx) => (
            <tr key={row.id || rowIdx} className="hover:bg-[#333333]/40 transition duration-150">
              {columns.map((col, colIdx) => (
                <td key={colIdx} className={cn('p-3.5 text-white', col.cellClassName)}>
                  {col.cell ? col.cell(row) : row[col.accessorKey]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && (
        <div className="text-center py-10 text-[#B0B0B0] text-xs">
          {emptyMessage}
        </div>
      )}
    </div>
  );
}
