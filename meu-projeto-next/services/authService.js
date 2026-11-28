import { api } from './api';

export async function fazerLogin(dados) {
  const resposta = await api.post('/auth/login', dados);
  return resposta.data;
}

export async function cadastrarUsuario(dados) {
  const resposta = await api.post('/usuarios', dados);
  return resposta.data;
}

export async function solicitarRecuperacao(email) {
  const resposta = await api.post('/auth/recuperar-senha', { email });
  return resposta.data;
}

export async function fazerLogout() {
  return api.post('/auth/logout');
}
