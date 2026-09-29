"use client";

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Check, X, Eye, RefreshCw, DollarSign, Clock, ShieldCheck, 
  Sparkles, CheckCircle2, AlertCircle, Loader2, History
} from 'lucide-react';
import { 
  fetchPublicationPlans, 
  fetchAdminPendingPayments,
  fetchAdminHistoryPayments,
  approvePaymentOrder, 
  rejectPaymentOrder, 
  updatePublicationPlanPrice,
  PublicationPlanItem,
  AdminPendingOrder
} from '@/lib/paymentsApi';
import { getAllManagedProperties, saveManagedProperties } from '@/lib/propertiesStore';

export const AdminPaymentsSection: React.FC = () => {
  const [plans, setPlans] = useState<Record<string, PublicationPlanItem>>({});
  const [pendingOrders, setPendingOrders] = useState<AdminPendingOrder[]>([]);
  const [historyOrders, setHistoryOrders] = useState<AdminPendingOrder[]>([]);
  const [activeTab, setActiveTab] = useState<'pendientes' | 'historial'>('pendientes');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Estados para editar precios configurables
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState<number>(0);

  const loadData = async () => {
    setLoading(true);
    try {
      const [plansData, ordersData, historyData] = await Promise.all([
        fetchPublicationPlans(),
        fetchAdminPendingPayments(),
        fetchAdminHistoryPayments()
      ]);
      setPlans(plansData);
      setPendingOrders(ordersData);
      setHistoryOrders(historyData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSavePrice = async (planId: string) => {
    setActionLoading(`price-${planId}`);
    const ok = await updatePublicationPlanPrice(planId, Number(newPrice));
    if (ok) {
      showToast(`Precio del plan ${planId.toUpperCase()} actualizado a U$S ${newPrice}`);
      setEditingPlanId(null);
      loadData();
    } else {
      showToast('Error al actualizar el precio en el servidor.');
    }
    setActionLoading(null);
  };

  const handleApprove = async (orderId: string) => {
    setActionLoading(orderId);
    const targetOrder = pendingOrders.find(o => o.id === orderId);

    // Eliminación visual inmediata de la lista de pendientes
    setPendingOrders(prev => prev.filter(o => o.id !== orderId));
    if (targetOrder) {
      setHistoryOrders(prev => [{ ...targetOrder, status: 'aprobado' }, ...prev]);
    }

    const ok = await approvePaymentOrder(orderId);
    if (ok) {
      if (targetOrder?.propertyId) {
        try {
          await fetch(`http://localhost:4000/api/properties/${targetOrder.propertyId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'Activo' })
          });
        } catch {}
        const all = getAllManagedProperties();
        const idx = all.findIndex(p => p.id === targetOrder.propertyId);
        if (idx !== -1) {
          all[idx].status = 'Activo';
          all[idx].isPaid = true;
          saveManagedProperties(all);
        }
      }
      showToast(`Pago ${orderId} aprobado exitosamente. La propiedad ahora está ACTIVA y pública.`);
      loadData();
    } else {
      showToast('Error al aprobar el pago en el servidor.');
      loadData();
    }
    setActionLoading(null);
  };

  const handleReject = async (orderId: string) => {
    const reason = prompt('Indica el motivo del rechazo del comprobante:', 'Comprobante no legible o monto incorrecto');
    if (!reason) return;

    setActionLoading(orderId);
    const targetOrder = pendingOrders.find(o => o.id === orderId);

    // Eliminación visual inmediata de la lista de pendientes
    setPendingOrders(prev => prev.filter(o => o.id !== orderId));
    if (targetOrder) {
      setHistoryOrders(prev => [{ ...targetOrder, status: 'rechazado' }, ...prev]);
    }

    const ok = await rejectPaymentOrder(orderId, reason);
    if (ok) {
      showToast(`Pago ${orderId} rechazado.`);
      loadData();
    } else {
      showToast('Error al procesar rechazo.');
      loadData();
    }
    setActionLoading(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      
      {/* Toast Notificación */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-surface-dark text-white px-5 py-3 rounded-2xl shadow-2xl border border-gray-700 flex items-center gap-2.5 animate-in slide-in-from-bottom-3">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-surface-dark flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-accent" />
            <span>Gestión de Planes y Pagos QR</span>
          </h2>
          <p className="text-xs text-content-muted mt-1">
            Configuración de precios de publicación y validación notarial de comprobantes bancarios.
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-surface-light border border-gray-200 hover:bg-gray-100 rounded-xl text-xs font-bold text-surface-dark transition-all cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualizar</span>
        </button>
      </div>

      {/* 1. SECCIÓN: PRECIOS CONFIGURABLES DE LOS PLANES */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-black text-surface-dark flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" /> Precios de Publicación (Configurables en Vivo)
            </h3>
            <p className="text-[11px] text-content-muted">
              Modifica los montos de cada plan. Los cambios impactan de inmediato en la pantalla flotante de los vendedores.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.values(plans).map((plan) => {
            const isEditing = editingPlanId === plan.id;
            return (
              <div 
                key={plan.id}
                className="p-4 rounded-xl border border-gray-200 bg-surface-light/30 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md text-white ${
                    plan.id === 'diamante' ? 'bg-[#EA580C]' : plan.id === 'oro' ? 'bg-[#F59E0B]' : 'bg-slate-500'
                  }`}>
                    {plan.name}
                  </span>
                  <span className="text-xs text-content-muted font-bold">{plan.durationLabel}</span>
                </div>

                <div className="pt-2">
                  <span className="text-[11px] text-content-muted block">Precio Actual:</span>
                  {isEditing ? (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-surface-dark">U$S</span>
                      <input
                        type="number"
                        min="0"
                        value={newPrice}
                        onChange={(e) => setNewPrice(Number(e.target.value))}
                        className="w-24 px-2 py-1 bg-white border border-gray-300 rounded-lg text-sm font-black text-surface-dark focus:outline-hidden focus:ring-1 focus:ring-accent"
                      />
                    </div>
                  ) : (
                    <span className="text-2xl font-black text-surface-dark tracking-tight">
                      U$S {plan.price}
                    </span>
                  )}
                </div>

                <div className="pt-2 border-t border-gray-200 flex items-center justify-end gap-2">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setEditingPlanId(null)}
                        className="px-2.5 py-1 text-xs font-bold text-content-muted hover:text-surface-dark cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        disabled={actionLoading === `price-${plan.id}`}
                        onClick={() => handleSavePrice(plan.id)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                      >
                        {actionLoading === `price-${plan.id}` ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                        Guardar
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPlanId(plan.id);
                        setNewPrice(plan.price);
                      }}
                      className="px-3 py-1 bg-white border border-gray-300 hover:border-gray-400 text-surface-dark rounded-lg text-xs font-bold shadow-2xs transition-all cursor-pointer"
                    >
                      Editar Precio
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. SECCIÓN: BANDEJA DE AUDITORÍA DE PAGOS QR */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-black text-surface-dark flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" /> Control y Auditoría de Pagos QR
            </h3>
            <p className="text-[11px] text-content-muted">
              Valida los vouchers de transferencia bancaria para activar publicaciones o consulta el historial.
            </p>
          </div>
          
          <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl border border-gray-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('pendientes')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'pendientes'
                  ? 'bg-white text-surface-dark shadow-2xs font-black'
                  : 'text-content-muted hover:text-surface-dark'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Pendientes ({pendingOrders.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('historial')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'historial'
                  ? 'bg-white text-surface-dark shadow-2xs font-black'
                  : 'text-content-muted hover:text-surface-dark'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Historial ({historyOrders.length})</span>
            </button>
          </div>
        </div>

        {activeTab === 'pendientes' ? (
          pendingOrders.length === 0 ? (
            <div className="text-center py-12 text-content-muted">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
              <p className="text-xs font-bold text-surface-dark">No hay pagos pendientes de revisión</p>
              <p className="text-[11px]">Todos los comprobantes han sido aprobados y las publicaciones están activas.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-light border-b border-gray-200 text-content-muted font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3.5">ID Orden</th>
                    <th className="p-3.5">Inmueble / Referencia</th>
                    <th className="p-3.5">Vendedor</th>
                    <th className="p-3.5">Plan / Monto</th>
                    <th className="p-3.5 text-center">Comprobante</th>
                    <th className="p-3.5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pendingOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-surface-dark">
                        {order.id}
                      </td>
                      <td className="p-3.5 font-bold text-surface-dark">
                        {order.propertyTitle || `Inmueble #${order.propertyId}`}
                      </td>
                      <td className="p-3.5 text-content-main">
                        <p className="font-semibold">{order.sellerName || 'Propietario'}</p>
                        <p className="text-[10px] text-content-muted">{order.sellerEmail}</p>
                      </td>
                      <td className="p-3.5">
                        <span className="font-extrabold text-surface-dark block">{order.planName}</span>
                        <span className="text-[11px] font-black text-emerald-700">U$S {order.amount}</span>
                      </td>
                      <td className="p-3.5 text-center">
                        {order.receiptUrl ? (
                          <button
                            type="button"
                            onClick={() => setSelectedReceipt(order.receiptUrl || null)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-sky-50 text-sky-700 border border-sky-200 rounded-lg font-bold text-[11px] hover:bg-sky-100 transition-all cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" /> Ver Voucher
                          </button>
                        ) : (
                          <span className="text-[10px] text-content-muted italic">Pendiente de subida</span>
                        )}
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          type="button"
                          disabled={actionLoading === order.id}
                          onClick={() => handleApprove(order.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                        >
                          {actionLoading === order.id ? 'Aprobando...' : 'Aprobar'}
                        </button>
                        <button
                          type="button"
                          disabled={actionLoading === order.id}
                          onClick={() => handleReject(order.id)}
                          className="px-2.5 py-1.5 border border-rose-300 text-rose-600 hover:bg-rose-50 font-bold text-[11px] rounded-lg transition-all cursor-pointer disabled:opacity-50"
                        >
                          Rechazar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          historyOrders.length === 0 ? (
            <div className="text-center py-12 text-content-muted">
              <Clock className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-surface-dark">No hay pagos en el historial</p>
              <p className="text-[11px]">Los pagos aprobados o rechazados aparecerán registrados aquí.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-light border-b border-gray-200 text-content-muted font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3.5">ID Orden</th>
                    <th className="p-3.5">Inmueble / Referencia</th>
                    <th className="p-3.5">Vendedor</th>
                    <th className="p-3.5">Monto</th>
                    <th className="p-3.5 text-center">Estado</th>
                    <th className="p-3.5 text-center">Comprobante</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {historyOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-surface-dark">
                        {order.id}
                      </td>
                      <td className="p-3.5 font-bold text-surface-dark">
                        {order.propertyTitle || `Inmueble #${order.propertyId}`}
                      </td>
                      <td className="p-3.5 text-content-main">
                        <p className="font-semibold">{order.sellerName || 'Propietario'}</p>
                        <p className="text-[10px] text-content-muted">{order.sellerEmail}</p>
                      </td>
                      <td className="p-3.5">
                        <span className="font-extrabold text-surface-dark block">{order.planName}</span>
                        <span className="text-[11px] font-black text-emerald-700">U$S {order.amount}</span>
                      </td>
                      <td className="p-3.5 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          order.status === 'aprobado'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {order.status === 'aprobado' ? (
                            <>
                              <Check className="w-3 h-3" /> Aprobado
                            </>
                          ) : (
                            <>
                              <X className="w-3 h-3" /> Rechazado
                            </>
                          )}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        {order.receiptUrl ? (
                          <button
                            type="button"
                            onClick={() => setSelectedReceipt(order.receiptUrl || null)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-sky-50 text-sky-700 border border-sky-200 rounded-lg font-bold text-[11px] hover:bg-sky-100 transition-all cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" /> Ver Voucher
                          </button>
                        ) : (
                          <span className="text-[10px] text-content-muted italic">Sin archivo</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      {/* MODAL DE VISTA PREVIA DEL VOUCHER */}
      {selectedReceipt && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in"
          onClick={() => setSelectedReceipt(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-lg w-full p-4 overflow-hidden shadow-2xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <h4 className="text-xs font-black text-surface-dark uppercase tracking-wider">
                Comprobante de Transferencia Bancaria
              </h4>
              <button 
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="p-1 text-content-muted hover:text-surface-dark cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="max-h-[70vh] overflow-auto rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center p-2">
              <img 
                src={selectedReceipt} 
                alt="Comprobante de Pago" 
                className="w-full h-auto object-contain rounded-lg"
              />
            </div>

            <button
              type="button"
              onClick={() => setSelectedReceipt(null)}
              className="w-full py-2 bg-surface-dark text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Cerrar Vista Previa
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
