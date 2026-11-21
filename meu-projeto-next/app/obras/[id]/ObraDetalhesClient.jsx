'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/services/api';

export default function ObraDetalhesClient({ id }) {
  const [obra, setObra] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  // Estado local da seção de comentários (aguardando endpoints do backend)
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
      autor: autor.trim() || 'Visitante',
      nota: Number(nota),
      texto: texto.trim(),
    };

    setComentarios((prev) => [novoComentario, ...prev]);
    setTexto('');
    setAvisoComentario(
      'Comentário adicionado localmente na sessão. Conecte o endpoint do backend para persistir no banco.'
    );
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10 text-slate-300">
        Carregando detalhes da obra...
      </main>
    );
  }

  if (erro || !obra) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p className="rounded-xl border border-rose-500/40 bg-rose-950/50 p-4 text-sm text-rose-200">
          {erro || 'Obra não encontrada.'}
        </p>
        <Link
          href="/obras"
          className="mt-4 inline-block text-sm font-semibold text-purple-400 hover:underline"
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
        className="mb-6 inline-flex items-center text-sm font-medium text-purple-400 hover:text-purple-300"
      >
        ← Voltar para o catálogo
      </Link>

      {/* Detalhes da obra */}
      <section className="flex flex-col gap-6 rounded-2xl border border-slate-700/80 bg-slate-800/80 p-6 shadow-lg sm:flex-row">
        {obra.capaUrl ? (
          <img
            src={obra.capaUrl}
            alt={obra.titulo}
            className="h-64 w-44 shrink-0 rounded-xl bg-slate-700 object-cover"
          />
        ) : (
          <div className="flex h-64 w-44 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-xs text-slate-400">
            Sem capa
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-purple-500/30 bg-purple-500/20 px-3 py-0.5 text-xs font-semibold text-purple-300">
              {obra.tipo}
            </span>
            {obra.anoLancamento && (
              <span className="text-sm text-slate-400">{obra.anoLancamento}</span>
            )}
          </div>

          <h1 className="mt-3 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-2xl font-extrabold text-transparent sm:text-3xl">
            {obra.titulo}
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-slate-300">
            {obra.sinopse || 'Nenhuma sinopse cadastrada para esta obra.'}
          </p>
        </div>
      </section>

      {/* Seção de comentários */}
      <section className="mt-8 rounded-2xl border border-slate-700/80 bg-slate-800/60 p-6 shadow-lg">
        <h2 className="text-lg font-bold text-slate-100">Comentários</h2>
        <p className="mt-1 text-xs text-slate-400">
          Deixe sua opinião sobre esta obra.
        </p>

        {avisoComentario && (
          <p className="mt-4 rounded-xl border border-purple-500/30 bg-purple-950/40 px-4 py-2.5 text-xs text-purple-200">
            {avisoComentario}
          </p>
        )}

        <form onSubmit={handleAdicionarComentarioLocal} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-300">
                Seu nome / usuário
              </label>
              <input
                type="text"
                value={autor}
                onChange={(e) => setAutor(e.target.value)}
                placeholder="Ex.: Willyanne"
                className="w-full rounded-lg border border-slate-600 bg-slate-900/80 px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-purple-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">
                Nota (1 a 5)
              </label>
              <select
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                className="w-full rounded-lg border border-slate-600 bg-slate-900/80 px-3.5 py-2 text-sm text-slate-100 focus:border-purple-400 focus:outline-none"
              >
                <option value="5">5 ★</option>
                <option value="4">4 ★</option>
                <option value="3">3 ★</option>
                <option value="2">2 ★</option>
                <option value="1">1 ★</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">
              Comentário
            </label>
            <textarea
              rows={3}
              required
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="O que você achou desta obra?"
              className="w-full rounded-lg border border-slate-600 bg-slate-900/80 px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-purple-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2 text-sm font-semibold text-white shadow transition hover:opacity-90"
          >
            Publicar comentário
          </button>
        </form>

        <div className="mt-6 space-y-3 border-t border-slate-700/70 pt-5">
          {comentarios.length === 0 ? (
            <p className="text-sm text-slate-400">
              Nenhum comentário exibido ainda.
            </p>
          ) : (
            comentarios.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-slate-700/70 bg-slate-900/60 p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-100">
                    {item.autor}
                  </span>
                  <span className="text-xs font-semibold text-purple-300">
                    {item.nota} / 5 ★
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-300">{item.texto}</p>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}