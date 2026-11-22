'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cadastrarUsuario } from '@/services/authService';
import { useUserStore } from '@/store/userStore';

export default function CadastroPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const login = useUserStore((state) => state.login);

  async function handleCadastro(e) {
    e.preventDefault();
    setErro('');

    if (senha !== confirmarSenha) {
      setErro('As senhas não são iguais!');
      return;
    }

    setCarregando(true);

    try {
      const usuario = await cadastrarUsuario({
        nome,
        email,
        senha,
      });

      login(usuario);

      alert('Conta criada com sucesso!');

      window.location.href = '/obras';
    } catch (error) {
      if (error.response?.status === 409) {
        setErro('Este e-mail já está cadastrado.');
      } else {
        setErro(
          error.response?.data?.message ||
          'Não foi possível realizar o cadastro. Verifique se o servidor está funcionando.'
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
          Criar conta
        </h1>

        <p className="mb-8 text-center text-sm text-slate-500">
          Faça parte da comunidade Comenta Comigo!
        </p>

        <form onSubmit={handleCadastro} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite seu nome"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">E-mail</label>
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
            <label className="mb-2 block text-sm font-medium">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Crie uma senha"
              required
              minLength={6}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Confirmar senha
            </label>
            <input
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              placeholder="Digite a senha novamente"
              required
              minLength={6}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />
          </div>

          {erro && (
            <p className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full rounded-lg bg-purple-600 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:opacity-60"
          >
            {carregando ? 'Criando conta...' : 'Criar minha conta'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Já tem uma conta?{' '}
          <Link
            href="/login"
            className="font-semibold text-purple-600 hover:underline"
          >
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
