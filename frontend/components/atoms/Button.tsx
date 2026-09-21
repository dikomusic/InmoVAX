import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'outline' | 'ghost';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button = ({ variant = 'primary', fullWidth = false, children, className = '', ...props }: ButtonProps) => {
  // Clases base compartidas por todos los botones
  const baseClasses = "font-bold py-3 px-6 rounded-lg transition-all duration-200 text-center flex items-center justify-center gap-2";
  
  // Aplicando la paleta de colores semántica
  const variants = {
    // Azul Eléctrico (Ej: "Detalles", "Agendar Visita")
    primary: "bg-primary hover:bg-primary-hover text-content-inverse shadow-md",
    
    // Amarillo Sol (Ej: "BUSCAR PROPIEDADES", "ENVIAR MENSAJE")
    accent: "bg-accent hover:bg-accent-hover text-content-main shadow-lg hover:-translate-y-0.5",
    
    // Para botones secundarios
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-content-inverse",
    
    // Para enlaces en el Navbar o Footer
    ghost: "text-content-inverse hover:text-accent bg-transparent"
  };

  const widthClass = fullWidth ? "w-full" : "w-auto";

  return (
    <button className={`${baseClasses} ${variants[variant]} ${widthClass} ${className}`} {...props}>
      {children}
    </button>
  );
};