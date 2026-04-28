# StudentsAcademy-Pomodoro
# Pomodoro com Gamificação — Árvore do Foco

Aplicação web de produtividade baseada no método **Pomodoro** com **gamificação**: enquanto você estuda, você planta uma **árvore virtual** que evolui conforme você completa sessões de foco. Se você **fechar a página** durante o foco e não retornar em até **120 segundos**, a árvore **morre**.

Projeto desenvolvido para a disciplina de **Programação Orientada a Objetos (POO)** — **FATEC**.

---

## Índice

- [Visão geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Regras de gamificação](#regras-de-gamificação)
- [Tecnologias](#tecnologias)
- [Como executar (local)](#como-executar-local)
  - [Pré-requisitos](#pré-requisitos)
  - [Banco de dados (MySQL)](#banco-de-dados-mysql)
  - [Backend (Spring Boot)](#backend-spring-boot)
  - [Frontend (React/Vue)](#frontend-reactvue)
- [Estrutura do repositório (sugestão)](#estrutura-do-repositório-sugestão)
- [Testes](#testes)
- [Acessibilidade (mínimo)](#acessibilidade-mínimo)
- [Autores](#autores)
- [Licença](#licença)

---

## Visão geral

O **Árvore do Foco** une o Pomodoro clássico com um sistema simples de recompensas:

- **Visitante (sem login)**: usa apenas o temporizador.
- **Usuário autenticado**: além do temporizador, participa da gamificação (árvore, pontos e moedas).

> Execução: **100% Web**, preparada para rodar **localmente** (apresentação).

---

## Funcionalidades

### Timer (Pomodoro clássico)
- **Foco:** 25 minutos  
- **Pausa curta:** 5 minutos  
- **Pausa longa:** 15 minutos  
- **Notificação sonora** ao término de foco/pausa
- O próximo ciclo **não inicia automaticamente** (o usuário inicia manualmente)

### Contas
- Cadastro e login com **e-mail e senha**
- Senhas armazenadas com **hash** (ex.: BCrypt)

### Gamificação (apenas logado)
- **Árvore virtual** com estágios: `semente → muda → árvore`
- **Pontos** por minuto focado + **bônus** ao concluir um foco
- **Moedas (maçãs)**: ganha 1 maçã a cada **5 minutos** de foco válido

### Ranking e Amigos (se implementado)
- Ranking **global** e/ou por **amigos**
- Filtros por **semana** e **mês**
- Métrica principal: **pontos**

---

## Regras de gamificação

- A árvore é vinculada a uma **sessão de foco** (25 min).
- Se o usuário **fechar a página** durante o foco e **não retornar em até 120 segundos**, a sessão falha e a árvore **morre**.
- Se o usuário retornar em **até 120 segundos**, o app **recupera a sessão** e o foco continua.
- Pontos e maçãs só são gerados durante **foco válido** (pausas não contam).

---

## Tecnologias

**Backend**
- Java + **Spring Boot**
- (Sugestão) Spring Security para autenticação
- MySQL (persistência)

**Frontend**
- **React** ou **Vue** (SPA)
- Comunicação com backend via API (JSON)

**Banco**
- **MySQL**

**Testes**
- Backend: JUnit / Mockito (recomendado)
- Frontend: testes de componentes (opcional, mas recomendado)

---

## Como executar (local)

> Os passos abaixo estão no formato “receita”. Ajuste os comandos conforme a escolha final de React/Vue e as pastas do repositório.

### Pré-requisitos

- **Java 17+** (ou versão usada no projeto)
- **Maven** (ou Gradle)
- **Node.js 18+** e **npm** (ou yarn/pnpm)
- **MySQL 8+**

---

### Banco de dados (MySQL)

1. Crie o banco (exemplo):
   ```sql
   CREATE DATABASE pomodoro_gamificado;
   ```

2. (Opcional) Crie um usuário específico:
   ```sql
   CREATE USER 'pomodoro'@'localhost' IDENTIFIED BY 'pomodoro';
   GRANT ALL PRIVILEGES ON pomodoro_gamificado.* TO 'pomodoro'@'localhost';
   FLUSH PRIVILEGES;
   ```

---

### Backend (Spring Boot)

1. Entre na pasta do backend:
   ```bash
   cd backend
   ```

2. Configure o arquivo `application.properties` (ou `application.yml`) com as credenciais do MySQL. Exemplo:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/pomodoro_gamificado
   spring.datasource.username=pomodoro
   spring.datasource.password=pomodoro

   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true
   ```

3. Execute:
   ```bash
   mvn spring-boot:run
   ```

4. O backend deve iniciar em algo como:
   - `http://localhost:8080`

---

### Frontend (React/Vue)

1. Entre na pasta do frontend:
   ```bash
   cd frontend
   ```

2. Instale dependências:
   ```bash
   npm install
   ```

3. Rode em modo dev:
   ```bash
   npm run dev
   ```

4. O frontend deve iniciar em algo como:
   - `http://localhost:5173` (Vite) ou porta configurada no projeto

---

## Estrutura do repositório (sugestão)

```text
/
├─ backend/                 # Spring Boot
│  ├─ src/main/java/...
│  ├─ src/test/java/...
│  └─ README.md (opcional)
├─ frontend/                # React ou Vue
│  ├─ src/...
│  └─ README.md (opcional)
└─ docs/                    # UML e documentação
   ├─ casos-de-uso/
   ├─ diagrama-classes/
   └─ diagrama-sequencia/
```

---

## Testes

### Backend
```bash
cd backend
mvn test
```

### Frontend (se houver)
```bash
cd frontend
npm test
```

---

## Acessibilidade (mínimo)

- Contraste adequado em botões e textos
- Navegação por teclado nos controles do timer (tab/enter/espaço)
- Feedback visual do estado: **Foco / Pausa curta / Pausa longa**

---

## Autores

- Guilherme
- Andressa
- Henry

---

## Licença

Este projeto é acadêmico (FATEC). Se desejarem, definam uma licença (ex.: MIT) e adicionem o arquivo `LICENSE`.
[Documentação](https://docs.google.com/document/d/1vl71Kh0Ckn0GZDa-6J_AmvpVCEMm8ZmOYz5aGTzqBCo/edit?tab=t.0)
