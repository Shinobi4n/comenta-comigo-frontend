import './globals.css';
import Providers from './providers';
import Header from '@/components/Header';

export const metadata = {
  title: 'Comenta Comigo | Leitura e Resenhas de Obras',
  description: 'Explore obras, leia sinopses e compartilhe seus comentários.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-purple-200 selection:text-purple-900">
        <Header />

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
