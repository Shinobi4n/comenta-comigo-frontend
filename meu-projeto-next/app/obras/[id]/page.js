'use client';

import { Suspense, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/services/api';

function ObraDetalhesConteudo() {
  const params = useParams();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const [obra, setObra] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  // Estado local da seção de comentários
  const [comentarios, setComentarios] = useState([]);
  const [autor, setAutor] = useState('');
  const [nota, setNota] = useState('5');
  const [texto, setTexto] = useState('');
  const [avisoComentario, setAvisoComentario] = useState('');

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    async function carregarObra() {
      try {
        setLoading(true);
        setErro('');
        const response = await api.get(`/obras/${id}`);
        setObra(response.data);
      } catch (e) {
        if (e.response) {
          setErro(`Erro ao carregar obra (HTTP ${e.response.status}).`);
        } else if (e.request) {
          setErro('Sem resposta do servidor (http://localhost:8080).');
        } else {
          setErro(`Erro: ${e.message}`);
        }
        console.error('Erro GET /obras/:id:', e.response || e);
      } finally {
        setLoading(false);
      }
    }

    carregarObra();
  }, [id]);

  function handleAdicionarComentarioLocal(e) {
    e.preventDefault();
    if (!texto.trim()) return;

    const novoComentario = {
      id: Date.now(),
      autor: autor.trim() || 'Leitor(a)',
      nota: Number(nota),
      texto: texto.trim(),
    };

    setComentarios((prev) => [novoComentario, ...prev]);
    setTexto('');
    setAvisoComentario(
      'Comentário adicionado localmente. Assim que conectarmos o endpoint do backend, ele será salvo no banco.'
    );
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12 text-slate-600">
        Carregando detalhes da obra...
      </main>
    );
  }

  if (erro || !obra) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12">
        <p className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
          {erro || 'Obra não encontrada.'}
        </p>
        <Link
          href="/obras"
          className="mt-4 inline-block text-sm font-semibold text-purple-600 hover:underline"
        >
          ← Voltar para Obras
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Link
        href="/obras"
        className="mb-6 inline-flex items-center text-sm font-semibold text-purple-600 hover:text-purple-800"
      >
        ← Voltar para o catálogo
      </Link>

      {/* Cartão da obra em tema claro e editorial */}
      <section className="flex flex-col gap-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:p-8">
        {obra.capaUrl ? (
          <img
            src={obra.capaUrl}
            alt={obra.titulo}
            className="h-72 w-48 shrink-0 rounded-2xl border border-slate-200 bg-slate-100 object-cover shadow-sm"
          />
        ) : (
          <div className="flex h-72 w-48 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-xs font-medium text-slate-500">
            Sem capa
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
              {obra.tipo}
            </span>
            {obra.anoLancamento && (
              <span className="text-sm font-medium text-slate-500">
                {obra.anoLancamento}
              </span>
            )}
          </div>

          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {obra.titulo}
          </h1>

          <div className="mt-5 border-t border-slate-100 pt-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Sinopse
            </h2>
            <p className="mt-2 text-base leading-7 text-slate-700">
              {obra.sinopse || 'Nenhuma sinopse cadastrada para esta obra.'}
            </p>
          </div>
        </div>
      </section>

      {/* Seção de comentários clara */}
      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-bold text-slate-900">Comentários e Resenhas</h2>
        <p className="mt-1 text-sm text-slate-500">
          Compartilhe sua opinião e leia o que outras pessoas acharam.
        </p>

        {avisoComentario && (
          <p className="mt-4 rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 text-xs font-medium text-purple-800">
            {avisoComentario}
          </p>
        )}

        <form onSubmit={handleAdicionarComentarioLocal} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Seu nome / usuário
              </label>
              <input
                type="text"
                value={autor}
                onChange={(e) => setAutor(e.target.value)}
                placeholder="Ex.: Willyanne"
                className="w-full rounded-xl border border-slate-300 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Avaliação
              </label>
              <select
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none"
              >
                <option value="5">5 ★ — Excelente</option>
                <option value="4">4 ★ — Muito bom</option>
                <option value="3">3 ★ — Bom</option>
                <option value="2">2 ★ — Regular</option>
                <option value="1">1 ★ — Fraco</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Seu comentário
            </label>
            <textarea
              rows={4}
              required
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escreva aqui o que você achou da obra..."
              className="w-full rounded-xl border border-slate-300 bg-slate-50/60 px-3.5 py-2.5 text-sm leading-relaxed text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
          >
            Publicar comentário
          </button>
        </form>

        <div className="mt-8 space-y-4 border-t border-slate-200 pt-6">
          {comentarios.length === 0 ? (
            <p className="text-sm text-slate-500">
              Nenhum comentário publicado ainda. Seja a primeira pessoa a comentar!
            </p>
          ) : (
            comentarios.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">
                    {item.autor}
                  </span>
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                    {item.nota} / 5 ★
                  </span>
                </div>
                <p className="mt-2.5 text-sm leading-6 text-slate-700">
                  {item.texto}
                </p>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

export default function ObraDetalhesPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-4xl px-4 py-12 text-slate-600">
          Carregando detalhes da obra...
        </main>
      }
    >
      <ObraDetalhesConteudo />
    </Suspense>
  );
}