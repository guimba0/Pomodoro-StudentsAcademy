# SPECS — Pomodoro com Gamificação (Árvore do Foco)
Versão: **1.0**  
Data: **2026-04-28**  
Entrega prevista: **2026-06-16**  
Equipe: **Guilherme, Andressa, Henry**  
Plataforma: **Web (100%)** — execução **local** (apresentação)

---

## 1. Visão geral

### 1.1 Objetivo
Construir uma aplicação web de produtividade baseada no método **Pomodoro** com **gamificação**:

- **Visitante (sem login):** usa somente o temporizador.
- **Usuário autenticado:** usa temporizador + **árvore virtual**, **pontos** e **moedas (maçãs)**.

A árvore cresce enquanto o usuário mantém o foco. Se o usuário **fechar a página** durante o foco e não retornar em até **120s**, a árvore **morre** e a sessão é considerada falha.

### 1.2 Fora de escopo (para manter o prazo)
- Suporte completo a mobile (apenas “não quebrar”, sem otimização).
- Loja/skins (a moeda existe, mas sem loja no MVP).
- Notificações push / integração com sistema operacional.
- Multi-idioma.
- Deploy em nuvem (execução local).

---

## 2. Escopo de entrega

### 2.1 MVP (obrigatório)
1. Timer Pomodoro clássico (**25/5/15**).
2. **Modo visitante** (sem login): apenas timer.
3. **Cadastro/Login/Logout** com e-mail e senha (senha com hash).
4. Sessão de foco autenticada com:
   - árvore por sessão (estágios),
   - regra “fechou a página” com **graça de 120s** e **recuperação**.
5. Gamificação:
   - **pontos por minuto** + **bônus por foco concluído**,
   - **moedas (maçãs)** a cada **5 minutos** de foco válido.
6. Notificação sonora no fim de foco/pausa.
7. Acessibilidade mínima (contraste + teclado nos controles).
8. Testes automatizados mínimos (backend).

### 2.2 Incremental (entregar se houver tempo)
- Histórico por dia/semana.
- Ranking global semanal/mensal.
- Amigos + filtro de ranking por amigos.

---

## 3. Stakeholders e perfis

### 3.1 Perfis
- **Visitante:** usuário sem conta.
- **Usuário autenticado:** usuário com conta (e-mail + senha).

### 3.2 Permissões
- Visitante: usar timer; não salva progresso em banco.
- Autenticado: timer + gamificação + (incrementais).

---

## 4. Regras de negócio

### 4.1 Pomodoro
- Durações fixas:
  - **Foco:** 25 minutos
  - **Pausa curta:** 5 minutos
  - **Pausa longa:** 15 minutos
- A aplicação **não auto-inicia** o próximo ciclo ao término; o usuário deve iniciar manualmente.
- Notificação sonora ao término de cada período.

### 4.2 Árvore e abandono
- A regra de “morte” aplica-se **apenas durante foco**.
- Considera “abandono” apenas quando o usuário **fecha a página** durante foco.
- Há **graça de 120 segundos**:
  - se retornar em até 120s → sessão é recuperada,
  - se retornar após 120s → sessão falha e árvore morre.

> Observação: “fechar a página” inclui fechar aba, fechar navegador, ou encerrar o processo. (Minimizar/trocar de aba fica fora do escopo do MVP, para reduzir falsos positivos.)

### 4.3 Pontos e moedas
- Pontos: acumulados por tempo de foco + bônus por foco concluído.
- Maçãs: 1 unidade a cada **5 minutos** de foco válido.
- Pausas não geram pontos nem maçãs.

### 4.4 Persistência
- Visitante: sem persistência (ou persistência local apenas para conveniência, sem ranking).
- Autenticado: persistência em MySQL de usuário, sessões e saldo.

---

## 5. Requisitos Funcionais (RF)

### 5.1 Autenticação e conta
- **RF-01** — Cadastro com e-mail e senha.
- **RF-02** — Login com e-mail e senha.
- **RF-03** — Logout.
- **RF-04** — E-mail deve ser único.
- **RF-05** — Senha armazenada com hash (ex.: BCrypt).

### 5.2 Modo visitante
- **RF-06** — Usuário sem login consegue usar timer (iniciar/pausar/retomar/resetar).
- **RF-07** — Visitante não acessa árvore, pontos e moedas.

### 5.3 Timer Pomodoro
- **RF-08** — Timer com períodos 25/5/15.
- **RF-09** — Controles: iniciar, pausar, retomar, resetar.
- **RF-10** — Notificação sonora ao finalizar um período.
- **RF-11** — Não iniciar automaticamente o próximo período.

### 5.4 Sessão de foco (autenticado)
- **RF-12** — Ao iniciar foco, criar sessão e exibir árvore no estágio inicial.
- **RF-13** — Persistir sessão em andamento para permitir recuperação (até 120s).
- **RF-14** — Se o usuário não retornar em 120s, marcar sessão como falha e árvore como morta.
- **RF-15** — Ao concluir foco, avançar estágio da árvore.

### 5.5 Gamificação
- **RF-16** — Acumular pontos durante foco válido.
- **RF-17** — Conceder bônus ao concluir foco.
- **RF-18** — Conceder 1 maçã a cada 5 minutos de foco válido.
- **RF-19** — Exibir saldo (pontos e maçãs) ao usuário autenticado.

### 5.6 Incrementais
- **RF-20 (Inc.)** — Histórico por dia/semana.
- **RF-21 (Inc.)** — Ranking global semanal/mensal por pontos.
- **RF-22 (Inc.)** — Amigos + ranking filtrado por amigos.

---

## 6. Requisitos Não Funcionais (RNF)

- **RNF-01 (Web)** — Deve funcionar em navegadores modernos (Chrome/Edge/Firefox).
- **RNF-02 (Execução local)** — Deve rodar localmente com instruções no README.
- **RNF-03 (Segurança)** — Senhas com hash; endpoints protegidos por autenticação.
- **RNF-04 (Persistência)** — MySQL como banco principal.
- **RNF-05 (Testes)** — Cobertura mínima de testes nos serviços críticos (auth + cálculo de recompensas).
- **RNF-06 (Acessibilidade mínima)** — Contraste e navegação por teclado nos controles do timer.
- **RNF-07 (Observabilidade mínima)** — Logs básicos no backend para login e criação/finalização de sessão.

---

## 7. Casos de Uso (para UML)

### UC-01 — Usar Pomodoro como visitante
**Ator:** Visitante  
**Pré-condição:** app acessível  
**Fluxo principal:**
1. Visitante abre o app
2. Inicia foco
3. Pausa/retoma quando desejar
4. Finaliza foco (som)
5. Inicia pausa manualmente  
**Pós-condição:** sem dados persistidos em banco.

### UC-02 — Cadastrar conta
**Ator:** Visitante  
**Fluxo:**
1. Abre tela de cadastro
2. Informa e-mail e senha
3. Sistema valida e-mail único
4. Cria usuário e autentica  
**Exceções:** e-mail já existe; senha inválida.

### UC-03 — Login
**Ator:** Usuário  
**Fluxo:**
1. Abre tela de login
2. Informa credenciais
3. Sistema autentica e inicia sessão

### UC-04 — Iniciar foco com árvore (autenticado)
**Ator:** Usuário autenticado  
**Fluxo:**
1. Usuário inicia foco
2. Sistema cria sessão “em andamento”
3. Sistema exibe árvore no estágio “semente”
4. Sistema acumula tempo e recompensas parciais  
**Extensão (abandono):**
- Usuário fecha a página
- Se retornar <= 120s → recuperar estado
- Se retornar > 120s → sessão falha; árvore morre

### UC-05 — Concluir foco e ganhar recompensas
**Ator:** Usuário autenticado  
**Fluxo:**
1. Timer chega a 0
2. Sistema toca som
3. Usuário encerra período
4. Sistema marca foco como concluído
5. Sistema soma pontos + bônus + maçãs correspondentes
6. Sistema evolui árvore

### UC-06 (Inc.) — Ver ranking
**Ator:** Usuário autenticado  
**Fluxo:**
1. Abre tela de ranking
2. Seleciona período (semana/mês)
3. Visualiza ranking global ou amigos (se existir)

---

## 8. Critérios de aceite (MVP)

1. Visitante consegue usar timer completo sem login.
2. Usuário cadastra, faz login e logout.
3. Usuário autenticado inicia foco e vê árvore no estágio inicial.
4. Ao concluir foco, o usuário recebe pontos e bônus e a árvore evolui.
5. Durante foco, ao fechar a página e voltar em até 120s, o estado do foco é recuperado.
6. Durante foco, ao fechar a página e voltar após 120s, a sessão falha e árvore morre.
7. A cada 5 minutos de foco válido, o saldo de maçãs aumenta.
8. Ao final de cada período, ocorre notificação sonora.
9. Existe comando documentado para rodar testes (ex.: `mvn test`) e eles passam.

---

## 9. Dados e modelo (alto nível)

### 9.1 Entidades mínimas (sugestão)
- **User**
  - id, email, passwordHash, createdAt
  - pointsTotal, applesTotal (ou via agregação de sessões)
- **PomodoroSession**
  - id, userId, type (FOCUS/SHORT_BREAK/LONG_BREAK)
  - status (IN_PROGRESS/COMPLETED/FAILED/CANCELED)
  - startedAt, endsAt (previsto), finishedAt
  - focusSecondsAccumulated (opcional)
  - pointsEarned, applesEarned
- **TreeState**
  - id, userId, stage (SEED/SEEDLING/TREE), isDead, updatedAt
  - sessionId (opcional: árvore por sessão) ou “árvore do usuário” (decidir)

> Para MVP simples: manter **TreeState por usuário** e evoluir ao concluir focos; e registrar em PomodoroSession o “resultado” (concluída/falha).

---

## 10. API (alto nível)

> Endpoints exatos podem variar, mas a ideia é:

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Pomodoro
- `POST /api/pomodoro/start` (type=FOCUS/BREAK)
- `POST /api/pomodoro/pause`
- `POST /api/pomodoro/resume`
- `POST /api/pomodoro/reset` (cancela)
- `GET /api/pomodoro/current` (recuperação do estado)
- `POST /api/pomodoro/finish` (marca como concluído)

### Gamificação
- `GET /api/profile/progress` (pontos, maçãs, árvore)

### Incrementais
- `GET /api/history?range=day|week`
- `GET /api/ranking?range=week|month&scope=global|friends`
- `POST /api/friends/add` / `GET /api/friends`

---

## 11. Testes (mínimo recomendado)

### Backend
- Testes unitários:
  - validação de cadastro/login (serviço)
  - cálculo de pontos e maçãs por tempo de foco
  - regra da graça de 120s (recupera vs falha)

### Frontend (opcional)
- Timer: mudanças de estado e rendering
- Fluxo básico de login

---

## 12. Cronograma sugerido (compatível com o prazo)

- **Semana 1–2:** setup repo, UI do timer (visitante), estrutura Spring, auth básica
- **Semana 3–4:** sessão de foco persistida + recuperação 120s + árvore (estágios)
- **Semana 5–6:** pontos + maçãs + telas de progresso + testes
- **Semana 7:** ajustes, UX, acessibilidade mínima, documentação e UML
- **Semana 8 (buffer):** incrementais (histórico/ranking/amigos) + estabilização

---

## 13. Decisões em aberto (confirmar)
1. **Árvore é “por usuário” (evolução contínua) ou “por sessão” (uma árvore por pomodoro)?**  
   Recomendação MVP: **por usuário** (mais simples).
2. **Reset durante foco**: cancela sem recompensa ou conta como falha (mata árvore)?  
   Recomendação MVP: **cancela sem recompensa** (não mata árvore).
3. Semana do ranking: “semana calendário” ou “últimos 7 dias”?  
   Recomendação: **semana calendário**.

---