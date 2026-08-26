"use client";
import React, { useState } from 'react';
import { TransactionRow, Transaction } from '../molecules/TransactionRow';
import { StatCard } from '../atoms/StatCard';
import { Modal } from '../atoms/Modal';

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "TX-901",
    code: "ANT-2026-004",
    propertyTitle: "Anticrético Departamento Sopocachi (Terraza)",
    type: "Anticrético",
    amount: "$us 45,000",
    commission: "$us 1,350",
    clientName: "Dr. Marcelo Zeballos",
    advisorName: "Carlos Vega",
    date: "25 Ago 2026",
    status: "Completado",
    notary: "Notaría de Fe Pública Nº 42"
  },
  {
    id: "TX-902",
    code: "VTA-2026-012",
    propertyTitle: "Casa Familiar en Achumani Calle 22",
    type: "Venta",
    amount: "$us 320,000",
    commission: "$us 9,600",
    clientName: "Familia Claros Benavides",
    advisorName: "Mariana Ríos",
    date: "22 Ago 2026",
    status: "En Notaría",
    notary: "Notaría de Fe Pública Nº 18"
  },
  {
    id: "TX-903",
    code: "ANT-2026-003",
    propertyTitle: "Penthouse Calacoto Vista Panorámica",
    type: "Anticrético",
    amount: "$us 75,000",
    commission: "$us 2,250",
    clientName: "Lic. Andrea Tapia",
    advisorName: "Carlos Vega",
    date: "18 Ago 2026",
    status: "Depósito en Custodia",
    notary: "Notaría de Fe Pública Nº 09"
  },
  {
    id: "TX-904",
    code: "ALQ-2026-029",
    propertyTitle: "Oficina Torre Empresarial San Jorge",
    type: "Alquiler",
    amount: "$us 1,200/mes",
    commission: "$us 1,200",
    clientName: "Consultora Andina S.R.L.",
    advisorName: "Andrea Morales",
    date: "14 Ago 2026",
    status: "Completado",
    notary: "Notaría de Fe Pública Nº 33"
  }
];

export const AdminTransactionsSection = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [filterType, setFilterType] = useState('todos');

  const filteredTx = transactions.filter(t => 
    filterType === 'todos' || t.type.toLowerCase() === filterType.toLowerCase()
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* KPIS FINANCIEROS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Capital Total Gestionado"
          value="$us 441,200"
          subtitle="Transacciones activas en Bolivia"
          icon="💼"
          trend="+22.5% vs mes anterior"
          trendType="positive"
          bgColor="bg-emerald-50 text-emerald-700"
        />

        <StatCard
          title="Comisiones Inmobiliarias"
          value="$us 14,400"
          subtitle="3% por corretaje y minutas"
          icon="📈"
          trend="Recaudación mensual"
          trendType="neutral"
          bgColor="bg-blue-50 text-primary"
        />

        <StatCard
          title="Contratos Notariados"
          value={transactions.length}
          subtitle="100% de operaciones registradas"
          icon="📜"
          trend="Respaldo Legal Total"
          trendType="positive"
          bgColor="bg-purple-50 text-purple-700"
        />
      </div>

      {/* TABLA DE CONTRATOS Y TRANSACCIONES */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-lg text-surface-dark">Libro Notarial de Transacciones</h3>
            <p className="text-xs text-content-muted">Monitoreo de minutas de compraventa, anticréticos y arrendamientos</p>
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-content-main outline-none cursor-pointer"
          >
            <option value="todos">Todas las Modalidades</option>
            <option value="Anticrético">Anticréticos</option>
            <option value="Venta">Ventas</option>
            <option value="Alquiler">Alquileres</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-extrabold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Código</th>
                <th className="py-3.5 px-4">Inmueble / Cliente</th>
                <th className="py-3.5 px-4">Tipo</th>
                <th className="py-3.5 px-4">Monto Contrato</th>
                <th className="py-3.5 px-4">Comisión</th>
                <th className="py-3.5 px-4">Asesor / Notaría</th>
                <th className="py-3.5 px-4">Estado Notarial</th>
                <th className="py-3.5 px-4 text-right">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredTx.map((tx) => (
                <TransactionRow
                  key={tx.id}
                  transaction={tx}
                  onViewContract={(t) => setSelectedTx(t)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE CONTRATO Y DETALLE NOTARIAL */}
      <Modal
        isOpen={!!selectedTx}
        onClose={() => setSelectedTx(null)}
        title={`Respaldo Notarial: ${selectedTx?.code}`}
        subtitle={`Registro de ${selectedTx?.type} • InmoVax Bolivia`}
      >
        {selectedTx && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-2xl space-y-3 border border-gray-100 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200 font-bold">
                <span className="text-gray-600">Inmueble:</span>
                <span className="text-surface-dark">{selectedTx.propertyTitle}</span>
              </div>
              <div className="flex justify-between items-center font-medium">
                <span className="text-gray-600">Cliente Firmante:</span>
                <span className="text-surface-dark font-bold">{selectedTx.clientName}</span>
              </div>
              <div className="flex justify-between items-center font-medium">
                <span className="text-gray-600">Monto Transaccional:</span>
                <span className="text-primary font-black text-sm">{selectedTx.amount}</span>
              </div>
              <div className="flex justify-between items-center font-medium">
                <span className="text-gray-600">Comisión de Intermediación (3%):</span>
                <span className="text-emerald-700 font-black">{selectedTx.commission}</span>
              </div>
              <div className="flex justify-between items-center font-medium">
                <span className="text-gray-600">Notaría Designada:</span>
                <span className="text-surface-dark font-bold">{selectedTx.notary}</span>
              </div>
              <div className="flex justify-between items-center font-medium">
                <span className="text-gray-600">Asesor a Cargo:</span>
                <span className="text-surface-dark font-bold">{selectedTx.advisorName}</span>
              </div>
            </div>

            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-medium">
              ✓ Documentación protocolizada con reconocimiento de firmas y depósito en custodia verificado.
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Cerrar Expediente
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};
