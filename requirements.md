# Requirements — Pomodoro com Gamificação (Árvore do Foco)
Versão: **1.0**  
Data: **2026-04-28**  
Entrega: **2026-06-16**  
Equipe: **Guilherme, Andressa, Henry**  
Plataforma: **Web (100%)** · Execução **local**

---

## 1. Objetivo
Desenvolver uma aplicação web baseada no método **Pomodoro** com **gamificação** por meio de uma **árvore virtual** que evolui com sessões de foco concluídas. Usuários **sem login** usam apenas o temporizador; usuários **logados** participam do sistema de árvore, pontos e moedas (maçãs).

---

## 2. Escopo

### 2.1 Entregável mínimo (MVP)
- Timer Pomodoro clássico **25/5/15**.
- Modo visitante (sem login): apenas timer.
- Cadastro/Login/Logout (e-mail + senha com hash).
- Sessão de foco persistida (logado) com:
  - árvore (semente → muda → árvore),
  - regra de abandono (fechar página) com **graça de 120s**,
  - recuperação de sessão ao retornar dentro de 120s.
- Gamificação (logado):
  - pontos por minuto de foco + bônus por foco concluído,
  - 1 maçã a cada 5 minutos de foco válido.
- Notificação sonora ao final de foco/pausa.
- Acessibilidade mínima (contraste e teclado nos controles do timer).
- Testes automatizados mínimos no backend.

### 2.2 Opcional (nice-to-have)
- Histórico por dia/semana.
- Ranking global (semana/mês).
- Amigos + filtro de ranking por amigos.
- Otimização para mobile.
- Loja/skins para gastar maçãs.

---

## 3. Atores e perfis
- **Visitante:** usuário não autenticado.
- **Usuário autenticado:** usuário com conta.

---

## 4. Requisitos Funcionais (RF)

### 4.1 Autenticação e conta
**RF-01 — Cadastro**  
O sistema deve permitir cadastro com e-mail e senha.

**RF-02 — E-mail único**  
O sistema deve impedir cadastro com e-mail já existente.

**RF-03 — Login**  
O sistema deve permitir login com e-mail e senha.

**RF-04 — Logout**  
O sistema deve permitir que o usuário encerre a sessão.

**RF-05 — Hash de senha**  
O sistema deve armazenar a senha usando hash (ex.: BCrypt), nunca em texto puro.

---

### 4.2 Modo visitante (sem login)
**RF-06 — Timer disponível sem conta**  
O sistema deve permitir uso do timer Pomodoro sem login.

**RF-07 — Sem gamificação no visitante**  
No modo visitante, o sistema não deve disponibilizar árvore, pontos e maçãs.

---

### 4.3 Timer Pomodoro
**RF-08 — Durações fixas**  
O sistema deve oferecer os períodos:
- foco: 25 min
- pausa curta: 5 min
- pausa longa: 15 min

**RF-09 — Controles do timer**  
O sistema deve permitir iniciar, pausar, retomar e resetar o timer.

**RF-10 — Notificação sonora**  
O sistema deve tocar um som ao finalizar cada período (foco/pausa).

**RF-11 — Sem auto-início**  
O sistema não deve iniciar automaticamente o próximo período.

---

### 4.4 Sessão de foco com árvore (usuário autenticado)
**RF-12 — Criar sessão ao iniciar foco**  
Ao iniciar um foco autenticado, o sistema deve criar/persistir uma sessão em andamento.

**RF-13 — Exibir árvore**  
Durante foco autenticado, o sistema deve exibir a árvore associada ao progresso (estágio atual).

**RF-14 — Evolução por foco concluído**  
Ao concluir um foco, o sistema deve evoluir a árvore para o próximo estágio.

**RF-15 — Abandono por fechar a página**  
Se o usuário fechar a página durante foco e não retornar em até 120s, o sistema deve falhar a sessão e marcar a árvore como “morta” (para aquela sessão).

**RF-16 — Recuperação em até 120s**  
Se o usuário retornar em até 120s após fechar a página durante foco, o sistema deve recuperar o estado da sessão (tempo restante e status).

**RF-17 — Abandono não se aplica à pausa**  
A regra de “árvore morre” não deve ser aplicada durante pausas (MVP).

---

### 4.5 Pontos e moedas (usuário autenticado)
**RF-18 — Pontos por tempo focado**  
O sistema deve atribuir pontos proporcionalmente ao tempo de foco válido.

**RF-19 — Bônus por foco concluído**  
O sistema deve conceder bônus ao completar um foco com sucesso.

**RF-20 — Maçãs por tempo**  
O sistema deve conceder 1 maçã a cada 5 minutos de foco válido.

**RF-21 — Visualização de saldo**  
O sistema deve permitir ao usuário visualizar pontos e maçãs acumulados.

---

### 4.6 Requisitos opcionais (nice-to-have)
**RF-22 (Opcional) — Histórico**  
O sistema pode permitir ao usuário visualizar histórico por dia e por semana.

**RF-23 (Opcional) — Ranking**  
O sistema pode exibir ranking global por semana/mês, ordenado por pontos.

**RF-24 (Opcional) — Amigos**  
O sistema pode permitir adicionar amigos e filtrar o ranking apenas para amigos.

---

## 5. Regras de Negócio (RN)

**RN-01 — Sem persistência no visitante**  
No modo visitante, progresso não é persistido em banco (apenas timer).

**RN-02 — Pontos/maçãs só em foco**  
Pontos e maçãs só são contabilizados durante foco válido; pausas não contam.

**RN-03 — Graça de 120 segundos**  
Ao fechar a página durante foco, a sessão permanece recuperável por 120s.

**RN-04 — Condição de falha por abandono**  
Se o retorno ocorrer após 120s, a sessão deve ser marcada como falha e não deve conceder recompensas daquele foco.

**RN-05 — Sem auto-início**  
Mesmo ao finalizar um período, a transição depende de ação manual do usuário.

---

## 6. Requisitos Não Funcionais (RNF)

**RNF-01 — Plataforma**  
A aplicação deve ser acessível via navegador moderno (Chrome/Edge/Firefox).

**RNF-02 — Execução local**  
A aplicação deve ser executável localmente com instruções no README.

**RNF-03 — Segurança**  
- Senhas com hash (BCrypt).
- Rotas de usuário autenticado devem exigir autenticação.

**RNF-04 — Persistência (logado)**  
Dados do usuário autenticado e sessões devem ser persistidos em MySQL.

**RNF-05 — Testes automatizados**  
Deve haver testes automatizados mínimos, especialmente para regras críticas (abandono 120s, cálculo de pontos/maçãs).

**RNF-06 — Acessibilidade mínima**  
O timer deve ser operável por teclado e manter contraste adequado.

**RNF-07 — Desempenho (mínimo)**  
A interface do timer deve responder às ações (start/pause/resume/reset) sem travamentos perceptíveis em máquina comum.

---

## 7. Critérios de Aceite (MVP)

1. Visitante usa o timer completo sem criar conta.
2. Usuário se cadastra, faz login e logout.
3. Usuário autenticado inicia foco e visualiza árvore.
4. Ao concluir um foco, usuário recebe pontos/maçãs e árvore evolui.
5. Se fechar a página durante foco e retornar em até 120s, a sessão é recuperada.
6. Se retornar após 120s, a sessão falha e não há recompensa daquele foco.
7. O sistema toca som ao final de foco/pausa.
8. O próximo período não inicia automaticamente.
9. Os testes automatizados rodam via comando documentado e passam.

---

## 8. Dependências e restrições técnicas (contexto)
- Backend: **Spring Boot**
- Frontend: **React ou Vue**
- Banco: **MySQL**
- Deploy: **local**
- Documentação/UML obrigatória: casos de uso, classes e sequência
- Testes automatizados exigidos

---
```