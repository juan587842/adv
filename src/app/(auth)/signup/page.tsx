import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-primary/20 bg-surface p-8 shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary">Criar Escritório</h2>
          <p className="mt-2 text-sm text-secondary">Cadastre-se e inicie o setup do seu CRM</p>
        </div>
        
        <form className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <input id="name" name="name" type="text" required className="relative block w-full rounded-t-md border-0 py-2.5 px-3 text-secondary ring-1 ring-inset ring-primary/20 bg-background focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" placeholder="Nome Completo" />
            </div>
            <div>
              <input id="email-address" name="email" type="email" required className="relative block w-full border-0 py-2.5 px-3 text-secondary ring-1 ring-inset ring-primary/20 bg-background focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" placeholder="E-mail profissional" />
            </div>
            <div>
              <input id="password" name="password" type="password" required className="relative block w-full rounded-b-md border-0 py-2.5 px-3 text-secondary ring-1 ring-inset ring-primary/20 bg-background focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" placeholder="Crie uma senha forte" />
            </div>
          </div>

          <div>
            <button type="submit" className="group relative flex w-full justify-center rounded-md bg-primary px-3 py-2.5 text-sm font-semibold text-background hover:bg-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors">
              Continuar para Onboarding
            </button>
          </div>
        </form>
        
        <p className="mt-4 text-center text-sm text-secondary">
          Já possui conta?{' '}
          <Link href="/login" className="font-semibold text-primary hover:text-primary-light">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
}
