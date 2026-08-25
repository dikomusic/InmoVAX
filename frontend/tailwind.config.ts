import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 1. Color Primario (Acciones regulares y enlaces)
        primary: {
          DEFAULT: "#024EFF", // Azul Eléctrico (Para los botones "Detalles" y "Agendar Visita")
          hover: "#013BCC",   // Un tono más oscuro para cuando pasas el mouse
        },
        // 2. Color de Acento (Conversión y llamadas a la acción críticas)
        accent: {
          DEFAULT: "#FFC300", // Amarillo Sol (Botón de "BUSCAR PROPIEDADES" y etiquetas "NUEVO")
          hover: "#E6B000",
        },
        // 3. Superficies y Fondos
        surface: {
          dark: "#091033",    // Azul Medianoche (Navbar, Footer y la caja del buscador)
          light: "#F2F6FF",   // Blanco Hielo (Fondo general de toda la página web)
          white: "#FFFFFF",   // Blanco puro (Para el fondo de las tarjetas de propiedades y los inputs)
        },
        // 4. Textos (Tipografía)
        content: {
          main: "#091033",    // Texto principal oscuro (Títulos de propiedades)
          muted: "#6B7280",   // Gris para textos secundarios (Detalles como m2, baños)
          inverse: "#FFFFFF", // Texto blanco (Para cuando el fondo es el Azul Medianoche)
        }
      },
    },
  },
  plugins: [],
} satisfies Config;