import Link from "next/link";

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-lg space-y-8 rounded-lg border border-primary/20 bg-surface p-8 shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary">Configuração do Workspace</h2>
          <p className="mt-2 text-sm text-secondary">Ajuste os detalhes do seu escritório para personalizarmos a sua AI</p>
        </div>
        
        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium leading-6 text-secondary">Nome do Escritório</label>
              <div className="mt-2">
                <input type="text" className="block w-full rounded-md border-0 py-2 px-3 text-secondary ring-1 ring-inset ring-primary/20 bg-background focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" placeholder="Ex: Silva & Associados" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium leading-6 text-secondary">Áreas de Atuação (separadas por vírgula)</label>
              <div className="mt-2">
                <input type="text" className="block w-full rounded-md border-0 py-2 px-3 text-secondary ring-1 ring-inset ring-primary/20 bg-background focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" placeholder="Cível, Trabalhista, Tributário..." />
              </div>
            </div>
            
             <div>
              <label className="block text-sm font-medium leading-6 text-secondary">Número OAB do Titular (Opcional)</label>
              <div className="mt-2">
                <input type="text" className="block w-full rounded-md border-0 py-2 px-3 text-secondary ring-1 ring-inset ring-primary/20 bg-background focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" placeholder="Ex: SP 123456" />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Link href="/" className="group relative flex w-full justify-center rounded-md bg-primary px-3 py-2.5 text-sm font-semibold text-background hover:bg-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors">
              Finalizar e Ir para Dashboard
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
