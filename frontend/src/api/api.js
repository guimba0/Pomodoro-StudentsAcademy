const API = '/api';

export async function apiFetch(path, options = {}) {
  try {
    const res = await fetch(API + path, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    return res.json();
  } catch {
    return { logado: false, erro: 'Erro de conexão com o servidor.' };
  }
}

export function fetchMe() {
  return apiFetch('/me');
}

export function fazerLogin(email, senha) {
  return apiFetch('/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha }),
  });
}

export function fazerCadastro(nome, email, senha) {
  return apiFetch('/cadastro', {
    method: 'POST',
    body: JSON.stringify({ nome, email, senha }),
  });
}

export function fazerLogout() {
  return apiFetch('/logout', { method: 'POST' });
}
