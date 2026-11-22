'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

const FORM_INICIAL = {
  titulo: '',
  tipo: 'FILME',
  anoLancamento: '',
  sinopse: '',
  capaUrl: '',
};

export default function ObrasPage() {
  const queryClient = useQueryClient();

  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const [form, setForm] = useState(FORM_INICIAL);
  const [editandoId, setEditandoId] = useState(null);

  // Busca as obras utilizando TanStack Query
  const {
    data: obrasData = [],
    isLoading: loading,
    isError,
    error,
  } = useQuery({
    queryKey: ['obras'],
    queryFn: async () => {
      const response = await api.get('/obras');
      return Array.isArray(response.data) ? response.data : [];
    },
  });

  const obras = obrasData;

  // Cadastro e edição de obras
  const salvarObraMutation = useMutation({
    mutationFn: async ({ payload, id }) => {
      if (id) {
        return await api.put(`/obras/${id}`, payload);
      }

      return await api.post('/obras', payload);
    },
    onSuccess: async (_, variables) => {
      setMensagem(
        variables.id
          ? 'Obra atualizada com sucesso!'
          : 'Obra cadastrada com sucesso!'
      );

      setErro('');
      setForm(FORM_INICIAL);
      setEditandoId(null);

      await queryClient.invalidateQueries({
        queryKey: ['obras'],
      });
    },
    onError: (e) => {
      if (e.response?.data?.message) {
        setErro(e.response.data.message);
      } else if (e.response) {
        setErro(`Erro ao salvar obra (HTTP ${e.response.status}).`);
      } else {
        setErro('Sem resposta do servidor ao salvar obra.');
      }

      console.error('Erro ao salvar obra:', e.response || e);
    },
  });

  // Exclusão de obras
  const excluirObraMutation = useMutation({
    mutationFn: async (id) => {
      return await api.delete(`/obras/${id}`);
    },
    onSuccess: async (_, id) => {
      setMensagem('Obra removida do catálogo.');
      setErro('');

      if (editandoId === id) {
        handleCancelarEdicao();
      }

      await queryClient.invalidateQueries({
        queryKey: ['obras'],
      });
    },
    onError: (e) => {
      setErro(
        e.response
          ? `Não foi possível excluir a obra (HTTP ${e.response.status}).`
          : 'Erro de conexão ao excluir obra.'
      );

      console.error('Erro DELETE /obras/:id:', e.response || e);
    },
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleEditar(obra) {
    setEditandoId(obra.id);
    setMensagem('');
    setErro('');

    setForm({
      titulo: obra.titulo || '',
      tipo: obra.tipo || 'FILME',
      anoLancamento: obra.anoLancamento
        ? String(obra.anoLancamento)
        : '',
      sinopse: obra.sinopse || '',
      capaUrl: obra.capaUrl || '',
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  function handleCancelarEdicao() {
    setEditandoId(null);
    setForm(FORM_INICIAL);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setErro('');
    setMensagem('');

    const payload = {
      titulo: form.titulo.trim(),
      tipo: form.tipo,
      anoLancamento: form.anoLancamento
        ? Number(form.anoLancamento)
        : null,
      sinopse: form.sinopse.trim() || null,
      capaUrl: form.capaUrl.trim() || null,
    };

    await salvarObraMutation.mutateAsync({
      payload,
      id: editandoId,
    }).catch(() => {});
  }

  async function handleExcluir(id) {
    setErro('');
    setMensagem('');

    await excluirObraMutation.mutateAsync(id).catch(() => {});
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Catálogo de Obras
          </h1>

          <p className="mt-1 text-sm text-slate-600">
            Cadastre novas obras, edite informações e abra os detalhes para ler e comentar.
          </p>
        </div>
      </div>

      {/* Formulário de cadastro / edição */}
      <section className="mb-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-lg font-bold text-slate-900">
          {editandoId
            ? `Editando obra #${editandoId}`
            : 'Cadastrar nova obra'}
        </h2>

        {mensagem && (
          <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800">
            {mensagem}
          </p>
        )}

        {erro && (
          <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">
            {erro}
          </p>
        )}

        {isError && !erro && (
          <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">
            {error?.response
              ? `Falha ao carregar catálogo (HTTP ${error.response.status}).`
              : 'Não foi possível conectar ao backend em http://localhost:8080. Verifique se o Spring Boot está rodando e o CORS está liberado.'}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Título *
              </label>

              <input
                type="text"
                name="titulo"
                required
                value={form.titulo}
                onChange={handleChange}
                placeholder="Ex.: O Senhor dos Anéis"
                className="w-full rounded-xl border border-slate-300 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Tipo
              </label>

              <select
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none"
              >
                <option value="FILME">FILME</option>
                <option value="SERIE">SÉRIE</option>
                <option value="LIVRO">LIVRO</option>
                <option value="ALBUM">ÁLBUM</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Ano de lançamento
              </label>

              <input
                type="number"
                name="anoLancamento"
                value={form.anoLancamento}
                onChange={handleChange}
                placeholder="Ex.: 2001"
                className="w-full rounded-xl border border-slate-300 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                URL da capa
              </label>

              <input
                type="text"
                name="capaUrl"
                value={form.capaUrl}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full rounded-xl border border-slate-300 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Sinopse
            </label>

            <textarea
              name="sinopse"
              rows={3}
              value={form.sinopse}
              onChange={handleChange}
              placeholder="Resumo ou descrição da obra..."
              className="w-full rounded-xl border border-slate-300 bg-slate-50/60 px-3.5 py-2.5 text-sm leading-relaxed text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={salvarObraMutation.isPending}
              className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:opacity-60"
            >
              {salvarObraMutation.isPending
                ? 'Salvando...'
                : editandoId
                ? 'Salvar alterações'
                : 'Cadastrar obra'}
            </button>

            {editandoId && (
              <button
                type="button"
                onClick={handleCancelarEdicao}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Lista de obras */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-slate-900">
          Obras cadastradas ({obras.length})
        </h2>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-600 shadow-sm">
            Carregando obras do catálogo...
          </div>
        ) : obras.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-600 shadow-sm">
            Nenhuma obra cadastrada no momento. Use o formulário acima para adicionar a primeira.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {obras.map((obra) => (
              <article
                key={obra.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row"
              >
                {obra.capaUrl ? (
                  <img
                    src={obra.capaUrl}
                    alt={obra.titulo}
                    className="h-44 w-32 shrink-0 rounded-xl border border-slate-200 bg-slate-100 object-cover"
                  />
                ) : (
                  <div className="flex h-44 w-32 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-xs font-medium text-slate-500">
                    Sem capa
                  </div>
                )}

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-700">
                        {obra.tipo}
                      </span>

                      {obra.anoLancamento && (
                        <span className="text-xs font-medium text-slate-500">
                          {obra.anoLancamento}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-2 text-lg font-bold text-slate-900">
                      {obra.titulo}
                    </h3>

                    <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-slate-600">
                      {obra.sinopse || 'Sem sinopse cadastrada.'}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Link
                      href={`/obras/${obra.id}`}
                      className="rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-purple-700"
                    >
                      Ver detalhes e comentar
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleEditar(obra)}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => handleExcluir(obra.id)}
                      disabled={excluirObraMutation.isPending}
                      className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-60"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
