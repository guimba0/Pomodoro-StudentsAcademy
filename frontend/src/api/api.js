const API = '/api';

// 1. Funcao generica que faz fetch para qualquer endpoint da API
export async function apiFetch(path, options = {}) {
  try {
    const res = await fetch(API + path, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    const data = await res.json();

    if (!res.ok) {
      return { erro: data.erro || 'Erro desconhecido.' };
    }

    return data;
  } catch {
    return { erro: 'Erro de conexão com o servidor.' };
  }
}

// 2. Busca dados do usuario logado (GET /api/me)
export function fetchMe() {
  return apiFetch('/me');
}

// 3. Faz login (POST /api/login)
export function fazerLogin(email, senha) {
  return apiFetch('/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha }),
  });
}

// 4. Faz cadastro (POST /api/cadastro)
export function fazerCadastro(nome, email, senha) {
  return apiFetch('/cadastro', {
    method: 'POST',
    body: JSON.stringify({ nome, email, senha }),
  });
}

// 5. Faz logout (POST /api/logout)
export function fazerLogout() {
  return apiFetch('/logout', { method: 'POST' });
}

// 6. Busca ranking semanal ou mensal (GET /api/ranking?periodo=weekly|monthly)
export function fetchRanking(periodo = 'weekly') {
  return apiFetch(`/ranking?periodo=${periodo}`);
}
