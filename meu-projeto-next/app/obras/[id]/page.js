'use client';

import { Suspense, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useUserStore } from '@/store/userStore';

function ObraDetalhesConteudo() {
  const params = useParams();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const queryClient = useQueryClient();

  const usuario = useUserStore((state) => state.usuario);

  const [texto, setTexto] = useState('');
  const [avisoComentario, setAvisoComentario] = useState('');
  const [erroComentario, setErroComentario] = useState('');

  // Busca os dados da obra
  const {
    data: obra,
    isLoading: carregandoObra,
    error: erroObra,
  } = useQuery({
    queryKey: ['obra', id],
    queryFn: async () => {
      const response = await api.get(`/obras/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  // Busca os comentários salvos no banco
  const {
    data: comentarios = [],
    isLoading: carregandoComentarios,
    isError: falhaComentarios,
  } = useQuery({
    queryKey: ['comentarios', id],
    queryFn: async () => {
      const response = await api.get(`/obras/${id}/comentarios`);
      return Array.isArray(response.data) ? response.data : [];
    },
    enabled: !!id,
  });

  // Envia um novo comentário ao back-end
  const adicionarComentario = useMutation({
    mutationFn: async (dados) => {
      return await api.post(`/obras/${id}/comentarios`, dados);
    },
    onSuccess: async () => {
      setTexto('');
      setErroComentario('');
      setAvisoComentario('Comentário publicado com sucesso!');

      await queryClient.invalidateQueries({
        queryKey: ['comentarios', id],
      });
    },
    onError: (error) => {
      setErroComentario(
        error.response?.data?.message ||
        `Não foi possível publicar o comentário${error.response ? ` (HTTP ${error.response.status})` : '. Verifique sua conexão.'}`
      );
      setAvisoComentario('');
    },
  });

  async function handleAdicionarComentario(e) {
    e.preventDefault();

    setAvisoComentario('');
    setErroComentario('');

    if (!usuario?.id) {
      setErroComentario('Você precisa entrar na sua conta para comentar.');
      return;
    }

    if (!texto.trim()) {
      setErroComentario('Escreva seu comentário antes de publicar.');
      return;
    }

    await adicionarComentario.mutateAsync({
      texto: texto.trim(),
      usuarioId: usuario.id,
    }).catch(() => {});
  }

  if (carregandoObra) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12 text-slate-600">
        Carregando detalhes da obra...
      </main>
    );
  }

  if (erroObra || !obra) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12">
        <p className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
          Não foi possível carregar a obra.
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

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-bold text-slate-900">
          Comentários e Resenhas
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Compartilhe sua opinião e leia o que outras pessoas acharam.
        </p>

        {avisoComentario && (
          <p className="mt-4 rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 text-xs font-medium text-purple-800">
            {avisoComentario}
          </p>
        )}

        {erroComentario && (
          <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700">
            {erroComentario}
          </p>
        )}

        <form onSubmit={handleAdicionarComentario} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Seu nome / usuário
            </label>

            <input
              type="text"
              value={usuario?.nome || ''}
              readOnly
              placeholder="Entre na sua conta"
              className="w-full rounded-xl border border-slate-300 bg-slate-100 px-3.5 py-2.5 text-sm text-slate-700"
            />
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
            disabled={adicionarComentario.isPending}
            className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:opacity-60"
          >
            {adicionarComentario.isPending
              ? 'Publicando...'
              : 'Publicar comentário'}
          </button>
        </form>

        <div className="mt-8 space-y-4 border-t border-slate-200 pt-6">
          <h3 className="text-sm font-bold text-slate-800">
            Comentários publicados
          </h3>

          {carregandoComentarios ? (
            <p className="text-sm text-slate-500">
              Carregando comentários...
            </p>
          ) : falhaComentarios ? (
            <p className="text-sm text-rose-600">
              Não foi possível carregar os comentários.
            </p>
          ) : comentarios.length === 0 ? (
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
                    {item.usuario?.nome || 'Usuário'}
                  </span>

                  <span className="text-xs text-slate-500">
                    {item.dataCriacao
                      ? new Date(item.dataCriacao).toLocaleDateString('pt-BR')
                      : ''}
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
