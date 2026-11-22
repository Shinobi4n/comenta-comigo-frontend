import Link from 'next/link';
import './globals.css';
import Providers from './providers';

export const metadata = {
  title: 'Comenta Comigo | Leitura e Resenhas de Obras',
  description: 'Explore obras, leia sinopses e compartilhe seus comentários.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-purple-200 selection:text-purple-900">
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

              <Link href="/login" className="transition hover:text-purple-700">
                Entrar
              </Link>

              <Link
                href="/cadastro"
                className="rounded-lg bg-purple-600 px-4 py-2 font-semibold text-white transition hover:bg-purple-700"
              >
                Criar conta
              </Link>
            </nav>
          </div>
        </header>

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
