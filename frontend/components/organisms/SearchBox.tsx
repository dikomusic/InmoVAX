"use client";
import React from 'react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Select } from '../atoms/Select';

export const SearchBox = () => {
  
  const ubicaciones = [
    { value: 'sur', label: 'Zona Sur (Calacoto, Obrajes)' },
    { value: 'sopocachi', label: 'Sopocachi' },
    { value: 'centro', label: 'Centro / Miraflores' },
    { value: 'el-alto', label: 'El Alto' },
  ];

  const tiposContrato = [
    { value: 'anticretico', label: 'Anticrético' },
    { value: 'venta', label: 'Comprar (Venta)' },
    { value: 'alquiler', label: 'Alquilar' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí conectaremos la lógica de Supabase más adelante
    console.log("Buscando propiedades...");
  };

  return (
    // bg-surface-dark aplica el Azul Medianoche (#091033)
    <div className="bg-[#091033] p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-6xl mx-auto -mt-20 relative z-20 border border-gray-800">
      
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
        
        <div className="flex-1">
          {/* Fondo blanco forzado para los inputs para que resalten sobre el azul oscuro */}
          <Select 
            placeholder=" Ubicación ideal" 
            options={ubicaciones} 
            className="bg-white text-gray-900"
          />
        </div>

        <div className="flex-1">
          <Select 
            placeholder=" Tipo de contrato" 
            options={tiposContrato} 
          />
        </div>

        {/* Usamos el átomo Input */}
        <div className="flex-1">
          <Input 
            type="number" 
            placeholder=" Presupuesto máx ($us)" 
          />
        </div>
        
        {/* Usamos el átomo Button con la variante de conversión (Amarillo Sol) */}
        <div className="md:w-1/4">
          <Button type="submit" variant="accent" fullWidth>
            Buscar Propiedades
          </Button>
        </div>

      </form>
    </div>
  );
};