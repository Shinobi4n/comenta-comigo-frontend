
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { fazerLogout } from '@/services/authService';

export default function Header() {
  const router = useRouter();

  const usuario = useUserStore((state) => state.usuario);
  const token = useUserStore((state) => state.token);
  const limparSessao = useUserStore((state) => state.logout);

  async function handleLogout() {
    try {
      if (token) {
        await fazerLogout();
      }
    } catch (error) {
      console.error('Erro ao encerrar sessão no servidor:', error);
    } finally {
      limparSessao();
      router.replace('/login');
    }
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-xl font-extrabold tracking-tight text-transparent"
        >
          Comenta Comigo
        </Link>

        <nav className="flex items-center gap-4 text-sm font-medium text-slate-600 sm:gap-6">
          <Link href="/" className="transition hover:text-purple-700">
            Início
          </Link>

          <Link href="/obras" className="transition hover:text-purple-700">
            Catálogo de Obras
          </Link>

          {usuario ? (
            <>
              <span className="hidden text-slate-700 sm:inline">
                Olá, {usuario.nome}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-purple-200 px-4 py-2 font-semibold text-purple-700 transition hover:bg-purple-50"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="transition hover:text-purple-700"
              >
                Entrar
              </Link>

              <Link
                href="/cadastro"
                className="rounded-lg bg-purple-600 px-4 py-2 font-semibold text-white transition hover:bg-purple-700"
              >
                Criar conta
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
