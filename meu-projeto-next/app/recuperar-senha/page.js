
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState('');

  function handleSubmit(e) {
    e.preventDefault();

    alert('Solicitação recebida! A recuperação será conectada ao back-end.');
  }

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-3 text-center text-3xl font-bold text-purple-700">
          Recuperar senha
        </h1>

        <p className="mb-8 text-center text-sm text-slate-500">
          Informe seu e-mail para solicitar a recuperação da sua senha.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">
              E-mail cadastrado
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-purple-600 py-3 font-semibold text-white transition hover:bg-purple-700"
          >
            Solicitar recuperação
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Lembrou sua senha?{' '}
          <Link
            href="/login"
            className="font-semibold text-purple-600 hover:underline"
          >
            Voltar para o login
          </Link>
        </p>
      </div>
    </main>
  );
}
