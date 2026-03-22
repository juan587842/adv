"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // To handle missing env config gracefully during dev
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
       setError("Configurações do Supabase ausentes no Frontend (.env.local).");
       setLoading(false);
       return;
    }

    const supabase = createClient();

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("Credenciais inválidas. Tente novamente.");
      setLoading(false);
    } else {
      // User authenticated successfully!
      // For Next.js client router to pick up the session cookie properly, you should ideally refresh the route, 
      // but simpler navigation is enough for MVP
      router.push("/dashboard");
      router.refresh(); 
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-primary/20 bg-surface p-8 shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary">Juris AI</h2>
          <p className="mt-2 text-sm text-secondary">Acesse sua conta corporativa</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-500 text-sm flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">E-mail</label>
              <input 
                 id="email-address" 
                 name="email" 
                 type="email" 
                 required 
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="relative block w-full rounded-t-md border-0 py-2.5 px-3 text-secondary ring-1 ring-inset ring-primary/20 bg-background focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" 
                 placeholder="E-mail profissional" 
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Senha</label>
              <input 
                 id="password" 
                 name="password" 
                 type="password" 
                 required 
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="relative block w-full rounded-b-md border-0 py-2.5 px-3 text-secondary ring-1 ring-inset ring-primary/20 bg-background focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" 
                 placeholder="Senha" 
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-primary/20 bg-background text-primary focus:ring-primary focus:ring-offset-background" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-secondary">Lembrar-me</label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-primary hover:text-primary-light">Esqueceu a senha?</a>
            </div>
          </div>

          <div>
            <button 
              type="submit" 
              disabled={loading}
              className="group relative flex w-full justify-center items-center gap-2 rounded-md bg-primary px-3 py-2.5 text-sm font-semibold text-background hover:bg-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Entrando..." : "Entrar no Sistema"}
            </button>
          </div>
        </form>
        
        <p className="mt-4 text-center text-sm text-secondary">
          Não tem uma conta?{' '}
          <Link href="/signup" className="font-semibold text-primary hover:text-primary-light">
            Crie seu escritório
          </Link>
        </p>
      </div>
    </div>
  );
}
