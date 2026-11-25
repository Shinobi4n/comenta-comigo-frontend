'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/services/api';

export default function HomePage() {
  const [obraDestaque, setObraDestaque] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarObraDestaque() {
      try {
        const response = await api.get('/obras');

        const obras = response.data;

        if (!Array.isArray(obras) || obras.length === 0) {
          setObraDestaque(null);
          return;
        }

        // Recupera o ID da última obra exibida
        const ultimaObra = localStorage.getItem(
          'ultimaObraDestaque'
        );

        // Evita repetir a última obra, quando possível
        let obrasDisponiveis = obras.filter(
          (obra) => String(obra.id) !== ultimaObra
        );

        // Se só existir uma obra, ela poderá ser exibida novamente
        if (obrasDisponiveis.length === 0) {
          obrasDisponiveis = obras;
        }

        // Escolhe uma obra aleatória
        const indiceAleatorio = Math.floor(
          Math.random() * obrasDisponiveis.length
        );

        const escolhida = obrasDisponiveis[indiceAleatorio];

        setObraDestaque(escolhida);

        // Salva o ID para evitar repetição no próximo acesso
        localStorage.setItem(
          'ultimaObraDestaque',
          String(escolhida.id)
        );

      } catch (error) {
        console.error(
          'Erro ao buscar obra em destaque:',
          error
        );

        setObraDestaque(null);
      } finally {
        setCarregando(false);
      }
    }

    buscarObraDestaque();
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">

      {/* Banner principal */}
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
          Um espaço leve e agradável para explorar livros,
          filmes e séries, ler sinopses com conforto e
          registrar suas resenhas e notas.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">

          <Link
            href="/obras"
            className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
          >
            Explorar catálogo de obras
          </Link>

          {obraDestaque && (
            <Link
              href={`/obras/${obraDestaque.id}`}
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-purple-400 hover:bg-purple-50/50 hover:text-purple-700"
            >
              Ver obra em destaque
            </Link>
          )}

        </div>

      </section>

      {/* Cards informativos */}
      <section className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-base font-bold text-slate-900">
            Catálogo Organizado
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Consulte, cadastre e gerencie obras com
            visualização limpa de capa, ano de lançamento
            e categoria.
          </p>

          <Link
            href="/obras"
            className="mt-4 inline-block text-xs font-semibold text-purple-600 hover:underline"
          >
            Acessar catálogo →
          </Link>

        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-base font-bold text-slate-900">
            Leitura Confortável
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Página de detalhes pensada para leitura agradável
            de sinopses e resenhas sem cansaço visual.
          </p>

          {obraDestaque && (
            <Link
              href={`/obras/${obraDestaque.id}`}
              className="mt-4 inline-block text-xs font-semibold text-purple-600 hover:underline"
            >
              Ver exemplo de obra →
            </Link>
          )}

          {carregando && (
            <p className="mt-4 text-xs text-slate-400">
              Carregando obra...
            </p>
          )}

        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-base font-bold text-slate-900">
            Resenhas e Notas
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Avalie de 1 a 5 estrelas e troque impressões
            com outros leitores e espectadores.
          </p>

        </article>

      </section>

      {/* Obra selecionada */}
      {obraDestaque && (
        <section className="mt-10 rounded-2xl border border-purple-100 bg-purple-50/50 p-6">

          <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
            Destaque aleatório
          </span>

          <h2 className="mt-2 text-xl font-bold text-slate-900">
            {obraDestaque.titulo}
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Uma obra selecionada do nosso catálogo para você
            descobrir e compartilhar sua opinião.
          </p>

          <Link
            href={`/obras/${obraDestaque.id}`}
            className="mt-4 inline-block text-sm font-semibold text-purple-700 hover:underline"
          >
            Conhecer esta obra →
          </Link>

        </section>
      )}

      {!carregando && !obraDestaque && (
        <p className="mt-10 text-center text-sm text-slate-500">
          Nenhuma obra cadastrada no momento.
          Explore novamente em breve!
        </p>
      )}

    </main>
  );
}
