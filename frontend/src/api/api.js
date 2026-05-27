const API = 'http://localhost:8080/api';

// 1. Funcao generica que faz fetch para qualquer endpoint da API
export async function apiFetch(path, options = {}) {
  try {
    const res = await fetch(API + path, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { erro: data.erro || 'Erro desconhecido.' };
    }

    return res.json();
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

// 6. Redefinir Senha (POST /api/esqueci-senha)
export function redefinirSenhaApi(email, senha) {
  return apiFetch('/esqueci-senha', {
    method: 'POST',
    body: JSON.stringify({ email, senha }),
  });
}

// 7. Busca ranking (GET /api/ranking)
export function fetchRanking(periodo = 'weekly') {
  return apiFetch(`/ranking?periodo=${periodo}`);
}

// --- Pomodoro ---

// 8. Iniciar/recuperar sessao (POST /api/pomodoro/start)
export function startPomodoro(tipo) {
  return apiFetch('/pomodoro/start', {
    method: 'POST',
    body: JSON.stringify({ tipo }),
  });
}

// 9. Buscar sessao atual (GET /api/pomodoro/current)
export function getCurrentSession() {
  return apiFetch('/pomodoro/current');
}

// 10. Finalizar sessao (POST /api/pomodoro/finish)
export function finishPomodoro() {
  return apiFetch('/pomodoro/finish', { method: 'POST' });
}

// 11. Cancelar sessao (POST /api/pomodoro/reset)
export function resetPomodoro() {
  return apiFetch('/pomodoro/reset', { method: 'POST' });
}

// 12. Progresso do usuario (GET /api/pomodoro/progresso)
export function getProgresso() {
  return apiFetch('/pomodoro/progresso');
}
