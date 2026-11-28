
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fazerLogin } from '@/services/authService';
import { useUserStore } from '@/store/userStore';

export default function LoginPage() {
  const router = useRouter();
  const login = useUserStore((state) => state.login);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const resposta = await fazerLogin({
        email,
        senha,
      });

      if (!resposta?.token) {
        throw new Error('O servidor não retornou um token de autenticação.');
      }

      login(resposta);

      router.replace('/obras');
    } catch (error) {
      if (error.response?.status === 401) {
        setErro('E-mail ou senha inválidos.');
      } else if (error.response?.status === 400) {
        setErro('Informe um e-mail e uma senha válidos.');
      } else if (error.response) {
        setErro(
          error.response.data?.detail ||
          error.response.data?.message ||
          'Não foi possível realizar o login.'
        );
      } else {
        setErro(
          error.message ||
          'Não foi possível conectar ao servidor. Verifique se o backend está funcionando.'
        );
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-center text-3xl font-bold text-purple-700">
          Bem-vindo de volta!
        </h1>

        <p className="mb-8 text-center text-sm text-slate-500">
          Entre na sua conta para participar do Comenta Comigo.
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">
              E-mail
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

          <div>
            <label className="mb-2 block text-sm font-medium">
              Senha
            </label>

            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />
          </div>

          {erro && (
            <p className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              {erro}
            </p>
          )}

          <div className="text-right">
            <Link
              href="/recuperar-senha"
              className="text-sm text-purple-600 hover:underline"
            >
              Esqueci minha senha
            </Link>
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full rounded-lg bg-purple-600 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Ainda não tem conta?{' '}
          <Link
            href="/cadastro"
            className="font-semibold text-purple-600 hover:underline"
          >
            Cadastre-se
          </Link>
        </p>
      </div>
    </main>
  );
}
