import { LoginForm } from "@/components/organisms/LoginForm";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex bg-surface-light">
      
      {/* Columna Izquierda: Imagen (Se oculta en celulares) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-surface-dark items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop"
          alt="Interior de lujo"
          fill
          className="object-cover opacity-50"
        />
        <div className="relative z-10 text-center px-12 max-w-lg">
          <h1 className="text-4xl font-extrabold text-content-inverse mb-4">
            La nueva era de los <span className="text-accent">Anticréticos</span>
          </h1>
          <p className="text-lg text-content-inverse/80 font-medium">
            Gestiona tus propiedades, visualiza tours 3D y cierra contratos con respaldo legal total.
          </p>
        </div>
      </div>

      {/* Columna Derecha: Formulario */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative">
        
        {/* Logo flotante (Para volver al inicio) */}
        <Link href="/" className="absolute top-8 left-8 text-2xl font-extrabold text-content-main tracking-tight">
          <span className="text-accent">INMO</span>PAZ
        </Link>

        {/* Contenedor del Formulario */}
        <div className="w-full max-w-md mt-12 lg:mt-0">
          <LoginForm />
          
          <p className="text-center mt-8 text-content-muted text-sm font-medium">
            ¿No tienes una cuenta? {' '}
            <Link href="#" className="text-primary hover:text-primary-hover font-bold">
              Regístrate aquí
            </Link>
          </p>
        </div>

      </div>
    </main>
  );
}