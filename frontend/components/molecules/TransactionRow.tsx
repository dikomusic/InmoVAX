import React from 'react';

export interface Transaction {
  id: string;
  code: string;
  propertyTitle: string;
  type: 'Anticrético' | 'Venta' | 'Alquiler';
  amount: string;
  commission: string;
  clientName: string;
  advisorName: string;
  date: string;
  status: 'Completado' | 'En Notaría' | 'Depósito en Custodia';
  notary: string;
}

interface TransactionRowProps {
  transaction: Transaction;
  onViewContract: (t: Transaction) => void;
}

export const TransactionRow = ({
  transaction,
  onViewContract
}: TransactionRowProps) => {
  const statusStyles = {
    Completado: 'bg-emerald-100 text-emerald-800',
    'En Notaría': 'bg-blue-100 text-primary',
    'Depósito en Custodia': 'bg-amber-100 text-amber-800'
  };

  return (
    <tr className="hover:bg-blue-50/30 transition-colors text-xs font-medium">
      <td className="py-4 px-4 font-mono font-bold text-gray-700">
        {transaction.code}
      </td>
      <td className="py-4 px-4">
        <div className="font-extrabold text-surface-dark truncate max-w-xs">{transaction.propertyTitle}</div>
        <div className="text-[11px] text-content-muted">Cliente: {transaction.clientName}</div>
      </td>
      <td className="py-4 px-4">
        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
          transaction.type === 'Anticrético' ? 'bg-amber-100 text-amber-800' :
          transaction.type === 'Venta' ? 'bg-blue-100 text-primary' :
          'bg-purple-100 text-purple-800'
        }`}>
          {transaction.type}
        </span>
      </td>
      <td className="py-4 px-4 font-black text-surface-dark text-sm">
        {transaction.amount}
      </td>
      <td className="py-4 px-4 font-black text-emerald-600">
        {transaction.commission}
      </td>
      <td className="py-4 px-4 text-gray-700">
        <div>{transaction.advisorName}</div>
        <div className="text-[10px] text-gray-400">{transaction.notary}</div>
      </td>
      <td className="py-4 px-4">
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${statusStyles[transaction.status]}`}>
          ● {transaction.status}
        </span>
      </td>
      <td className="py-4 px-4 text-right">
        <button
          type="button"
          onClick={() => onViewContract(transaction)}
          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-surface-dark font-bold rounded-lg transition-colors cursor-pointer text-[11px]"
        >
          📄 Ver Respaldo
        </button>
      </td>
    </tr>
  );
};
