import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-primary mb-8 text-center">
          Juris AI - CRM Jurídica
        </h1>
        <div className="bg-surface border border-primary/20 rounded-md p-8 shadow-lg max-w-2xl mx-auto flex flex-col gap-4">
          <p className="text-lg text-secondary text-center">
            Plataforma Multiagente em Construção
          </p>
          <div className="flex justify-center gap-4 mt-8">
             <Link href="/login" className="bg-primary text-background font-bold px-6 py-3 rounded-md hover:bg-primary-light transition-colors">
              Fazer Login
             </Link>
             <Link href="/signup" className="bg-transparent border border-primary text-primary font-bold px-6 py-3 rounded-md hover:bg-surface transition-colors">
              Cadastrar
             </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
