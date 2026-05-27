# AGENTS — Guia de Trabalho da Equipe
Projeto: **Pomodoro com Gamificação (Árvore do Foco)**  
Equipe: **Guilherme, Andressa, Henry**  
Início: **2026-04-28** · Entrega: **2026-06-16**

Este documento define **papéis**, **rituais**, **padrões de branch/commit**, **qualidade**, e um **plano de execução** para o time trabalhar de forma organizada.

---

## 1) Papéis (sugestão)

> Ajustem como preferirem. O importante é ter “dono” por área e revisão cruzada.

### Guilherme — Integração + Backend Core
- Estrutura do **Spring Boot** (camadas, configuração, dependências)
- Autenticação (cadastro/login/logout, hash de senha)
- Regras do Pomodoro no backend (sessão, recuperação 120s)
- Integração API (contratos/DTOs)

### Andressa — Frontend + UX
- UI do Timer (visitante e logado)
- Telas: Login/Cadastro, Dashboard (timer + árvore), Progresso
- Acessibilidade mínima (teclado/contraste)
- Integração com API (fetch/axios)

### Henry — Qualidade + Gamificação + Documentação
- Regras de pontuação/tomate/árvore (validação e testes)
- Testes automatizados (prioridade no backend)
- Documentos (UML em `/docs`, ajustes do `SPECS.md`)
- Apoio em ranking/histórico (incrementais), se houver tempo

> Observação: mesmo com “donos”, toda PR deve ser revisada por pelo menos **1 pessoa**.

---

## 2) Ritmo de trabalho (rituais)

### Daily rápida (10 min)
- O que fez ontem
- O que fará hoje
- Bloqueios

### Checkpoint semanal (30–45 min)
- Revisar escopo do MVP
- Ajustar prioridades
- Planejar a próxima semana

### Regra de ouro
**MVP primeiro.** Incrementais (histórico/ranking/amigos) só entram quando o MVP estiver estável e testado.

---

## 3) Gestão de tarefas

### Kanban simples (GitHub Projects ou Issues)
Colunas sugeridas:
- Backlog
- Em andamento
- Em revisão (PR)
- Concluído

### Tamanho de tarefa
Preferir tarefas que caibam em **até 1 dia** de trabalho.

---

## 4) Padrões de branch e Pull Request

### Branch
- `main`: estável / pronto para apresentar
- `dev` (opcional): integração contínua antes de subir pra main
- `feature/<descricao-curta>`: novas funcionalidades
- `fix/<descricao-curta>`: correções
- `docs/<descricao-curta>`: documentação/UML

Exemplos:
- `feature/auth-register-login`
- `feature/pomodoro-session-recovery`
- `fix/timer-notification-audio`
- `docs/uml-use-cases`

### Pull Requests
- PR pequeno (idealmente < 300 linhas alteradas)
- Deve incluir:
  - descrição do que mudou
  - como testar
  - prints (se UI)
  - referência à Issue (se existir)

Checklist de PR (mínimo):
- [ ] Compila/roda local
- [ ] Testes passam
- [ ] Não quebrou o fluxo do MVP
- [ ] Revisado por 1 colega

---

## 5) Convenção de commits

Sugestão (Conventional Commits simplificado):
- `feat: ...` nova funcionalidade
- `fix: ...` correção
- `test: ...` testes
- `docs: ...` documentação
- `chore: ...` config, dependências

Exemplos:
- `feat: add user registration and password hashing`
- `feat: implement pomodoro focus session persistence`
- `fix: prevent timer from auto-starting next cycle`
- `test: add unit tests for apple rewards calculation`
- `docs: add UML use case diagrams`

---

## 6) Qualidade e Definition of Done (DoD)

Uma tarefa é “concluída” quando:
1. Está implementada e integrada
2. Passa nos testes (ou inclui testes novos quando necessário)
3. Não quebra o MVP (fluxo visitante + fluxo logado)
4. Está documentada quando necessário (README/SPECS/UML)
5. Foi revisada (pelo menos 1 pessoa)

---

## 7) Estrutura do repositório (recomendada)

```text
/
├─ backend/                 # Spring Boot
├─ frontend/                # React ou Vue
├─ docs/                    # UML + documentação
│  ├─ uml/
│  ├─ requisitos/
│  └─ imagens/
├─ README.md
├─ SPECS.md
└─ AGENTS.md
```

---

## 8) Contratos e integração Front ↔ Back

### Regra prática
- Backend expõe API REST em `/api/*`
- Frontend consome via `BASE_URL` configurável (env)

Sugestões:
- `frontend/.env.development`: `VITE_API_BASE_URL=http://localhost:8080`
- CORS habilitado somente para ambiente local

### Dados críticos
- Estado do timer (principalmente para recuperação 120s)
- Progresso (pontos, tomate, estágio da árvore)

---

## 9) Planejamento por marcos (milestones)

### Marco 1 — Base do projeto (até ~Semana 2)
- Front: tela timer visitante
- Back: projeto Spring Boot + conexão MySQL
- Auth básica (cadastro/login)
- Documentação inicial + README rodando

### Marco 2 — MVP funcional (até ~Semana 4)
- Sessão de foco persistida (IN_PROGRESS)
- Recuperação em 120s (retoma vs falha)
- Árvore com estágios
- Notificação sonora
- UI integrada com API

### Marco 3 — Gamificação completa do MVP (até ~Semana 6)
- Pontos por minuto + bônus
- Maçãs a cada 5 min
- Tela de progresso
- Testes do backend cobrindo regras principais

### Marco 4 — Finalização (até 16/06)
- Polimento UI + acessibilidade mínima
- Ajustes finais e bugs
- UML final (casos de uso, classes, sequência)
- (Opcional) incrementais: histórico/ranking/amigos

---

## 10) Decisões de produto (alinhadas ao SPECS)

- Timer fixo: **25/5/15**
- Sem auto-start do próximo ciclo
- Abandono: apenas **fechar a página** no foco
- Recuperação: **graça de 120s**
- Gamificação: pontos + tomate (1 a cada 5 min) + árvore por evolução de foco concluído
- Execução: local

---

## 11) Riscos e mitigação

### Risco: recuperar sessão em web (120s) ficar inconsistente
Mitigação:
- Persistir sessão no backend (status + timestamps)
- Front apenas exibe e “pede o estado atual” ao abrir

### Risco: escopo social (amigos/ranking) atrasar
Mitigação:
- Tratar como incremental
- Só iniciar após MVP estável e testado

### Risco: falta de testes
Mitigação:
- Priorizar testes em regras de negócio (pontos/tomate/abandono)
- “Travar” merge de features grandes sem ao menos 1 teste unitário crítico

---

## 12) Como apresentar (roteiro rápido)

1. Abrir app como visitante → mostrar timer funcionando
2. Cadastrar conta / login
3. Iniciar foco → mostrar árvore (semente)
4. Simular “fechar a página” e voltar dentro de 120s → recupera
5. Completar (ou simular conclusão) → ganha pontos/tomate → árvore evolui
6. Mostrar progresso (saldo)

---