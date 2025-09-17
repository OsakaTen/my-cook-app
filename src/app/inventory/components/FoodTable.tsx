import React from "react";
import {FoodTableProps} from "../types"

const FoodTable: React.FC <FoodTableProps>= ({items,onEdit,onDelete}) => {

  const tableHeaders = ['食材', '数量', '賞味期限', '状態', '操作'];

  return (
    <div className="rounded-lg  overflow-hidden border border-slate-200">
      <table className="w-full">
        <thead className="bg-slate-100">
          <tr>
            {tableHeaders.map(header => (
              <th
                key={header}
                className="px-6 py-4 text-left text-slate-600 text-lg font-semibold  tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
            {items.map(item=>(
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  
                </td>
              </tr>
            ))}
          {/* <tr>
            <td className="px-6 py-4 whitespace-nowrap text-slate-800 text-base font-medium">りんご</td>
            <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-base">5個</td>
            <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-base">2024-08-15</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: 'var(--success-100)', color: 'var(--success-800)' }}>新鮮</span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <button className="font-semibold text-sm mr-4" style={{ color: 'var(--primary-600)' }}>編集</button>
              <button className="text-red-500 hover:text-red-700 font-semibold text-sm">削除</button>
            </td>
          </tr> */}
        </tbody>
      </table>
    </div>
  );
};

export default FoodTable;