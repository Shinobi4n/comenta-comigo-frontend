import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      {/* Banner principal claro */}
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
        <span className="inline-block rounded-full bg-purple-100 px-3.5 py-1 text-xs font-semibold text-purple-700">
          Comunidade de Leitura &amp; Cultura
        </span>

        <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Descubra obras e{' '}
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            comente com a comunidade
          </span>
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
          Um espaço leve e agradável para explorar livros, filmes e séries, ler
          sinopses com conforto e registrar suas resenhas e notas.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="/obras"
            className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
          >
            Explorar catálogo de obras
          </Link>

          <Link
            href="/obras/1"
            className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-purple-400 hover:bg-purple-50/50 hover:text-purple-700"
          >
            Ver obra em destaque
          </Link>
        </div>
      </section>

      {/* Cards informativos claros */}
      <section className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900">Catálogo Organizado</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Consulte, cadastre e gerencie obras com visualização limpa de capa,
            ano de lançamento e categoria.
          </p>
          <Link
            href="/obras"
            className="mt-4 inline-block text-xs font-semibold text-purple-600 hover:underline"
          >
            Acessar catálogo →
          </Link>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900">Leitura Confortável</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Página de detalhes pensada para leitura agradável de sinopses e
            resenhas sem cansaço visual.
          </p>
          <Link
            href="/obras/1"
            className="mt-4 inline-block text-xs font-semibold text-purple-600 hover:underline"
          >
            Ver exemplo de obra →
          </Link>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900">Resenhas e Notas</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Avalie de 1 a 5 estrelas e troque impressões com outros leitores e
            espectadores.
          </p>
        </article>
      </section>
    </main>
  );
}