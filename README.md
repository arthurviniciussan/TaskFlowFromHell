# TaskFlow

Mini sistema de gerenciamento de tarefas estilo **Trello simplificado**, desenvolvido como desafio full stack de estudos. Usuários autenticados podem criar, listar, filtrar, atualizar e excluir tarefas com status e prioridade.

> **Nota:** Este é um projeto de aprendizado e portfólio. A stack e a organização seguem boas práticas para CRUD + JWT, mas **não está pronto para produção** — faltam itens como migrations versionadas, reverse proxy (Nginx), cache (Redis), mensageria (Kafka), testes de integração amplos, CI/CD e hardening de segurança.

---

## Funcionalidades

- **Autenticação:** registro e login com JWT; rotas protegidas no Angular (`authGuard` / `guestGuard`)
- **Tarefas (CRUD):** criar, listar, editar, excluir e alterar status
- **Filtros no frontend:** busca por texto, status e prioridade (filtro local após carregar a lista)
- **UX:** Angular Material, loading spinner, notificações de sucesso/erro, tema claro/escuro
- **Containerização:** Docker Compose com PostgreSQL, API Spring e frontend Angular

Cada tarefa possui: `id`, `title`, `description`, `status`, `priority`, `dueDate`.

| Campo      | Valores                                      |
|-----------|-----------------------------------------------|
| **status**   | `TODO`, `IN_PROGRESS`, `DONE`              |
| **priority** | `LOW`, `MEDIUM`, `HIGH`                    |

---

## Stack

### Backend (`TaskFlow-BackEnd`)

| Tecnologia | Uso |
|------------|-----|
| **Java 21** | Linguagem (Eclipse Temurin no Docker) |
| **Spring Boot 4.0.6** | API REST |
| **Spring Web MVC** | Controllers HTTP |
| **Spring Data JPA** | Persistência |
| **Spring Security** | Autenticação stateless |
| **Auth0 java-jwt 4.4.0** | Geração e validação de tokens |
| **PostgreSQL 15** | Banco em produção local (Docker) |
| **H2** | Banco em memória para desenvolvimento sem Docker |
| **Lombok** | Redução de boilerplate em entidades/DTOs |
| **Maven 3.9** | Build (multi-stage no Dockerfile) |

### Frontend (`TaskFlow-FrontEnd`)

| Tecnologia | Uso |
|------------|-----|
| **Angular 21** | SPA standalone |
| **Angular Material + CDK** | UI (formulários, cards, chips, snackbar) |
| **Reactive Forms** | Login, registro e formulário de tarefas |
| **RxJS** | HTTP, debounce nos filtros |
| **TypeScript 5.9** | Tipagem |
| **Node 22 Alpine** | Ambiente no Dockerfile |

### Infraestrutura

| Tecnologia | Uso |
|------------|-----|
| **Docker / Docker Compose** | Orquestração de `db`, `app` e `frontend` |
| **postgres:15.3-alpine** | Banco persistente com volume `taskflow_db_data` |

---

## Princípios e arquitetura

### Backend

Fluxo em camadas: **Controller → Service → Repository**, com DTOs separando contrato da API das entidades JPA.

```
TaskFlow-BackEnd/src/main/java/com/arthur/TaskFlow/
├── controller/       # REST (Auth, Tasks)
├── service/          # Regras de negócio
├── repository/       # Spring Data JPA
├── entity/           # User, Task + enums Status/Priority
├── DTOs/             # Request/Response
└── Infra/security/   # JWT, filtros, SecurityConfig, CORS
```

- API **stateless** (sem sessão HTTP)
- Senhas com **BCrypt**
- Endpoints públicos apenas em `/auth/login` e `/auth/register`
- Schema gerenciado por `spring.jpa.hibernate.ddl-auto=update` (adequado para estudo, **não** para produção)

### Frontend

Organização por responsabilidade:

```
TaskFlow-FrontEnd/src/app/
├── core/           # services, guards, interceptors, models, constants
├── shared/         # componentes reutilizáveis (ex.: loading-spinner)
└── features/
    ├── auth/       # login, register
    └── tasks/      # dashboard, list, card, form, filters
```

- **Interceptors:** `authInterceptor` (Bearer token) e `errorInterceptor` (tratamento global)
- **Token** persistido em `localStorage` via `TokenService`
- **API base:** `http://localhost:8080` (`src/environments/environment.ts`)

---

## API

Base URL: `http://localhost:8080`

### Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/auth/login` | Login — retorna JWT |
| `POST` | `/auth/register` | Cadastro de usuário |

Headers nas rotas protegidas: `Authorization: Bearer <token>`

### Tarefas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/tasks` | Lista todas as tarefas |
| `GET` | `/tasks/{id}` | Busca por ID |
| `GET` | `/tasks/status/{status}` | Lista por status (`TODO`, `IN_PROGRESS`, `DONE`) |
| `POST` | `/tasks/new` | Cria tarefa |
| `POST` | `/tasks/{id}/update` | Atualiza tarefa |
| `POST` | `/tasks/{id}/status` | Atualiza apenas o status (body: `{ "status": "DONE" }`) |
| `DELETE` | `/tasks/{id}` | Remove tarefa |

---

## Como executar

### Com Docker Compose (recomendado)

Na raiz do repositório:

```bash
docker compose up --build
```

| Serviço   | URL |
|-----------|-----|
| Frontend  | http://localhost:4200 |
| Backend   | http://localhost:8080 |
| PostgreSQL| localhost:5432 (`taskflow_db`, usuário `arthur`) |

O backend aguarda o healthcheck do Postgres antes de subir. Variáveis de ambiente (JWT, datasource, `ddl-auto`) estão definidas em `docker-compose.yaml`.

### Desenvolvimento local (sem Docker)

**Backend** — requer Java 21 e Maven. Por padrão usa **H2 em memória** (`application.yaml`):

```bash
cd TaskFlow-BackEnd
./mvnw spring-boot:run
```

**Frontend** — requer Node.js compatível com Angular 21:

```bash
cd TaskFlow-FrontEnd
npm install
npm start
```

Acesse http://localhost:4200 e garanta que a API em `environment.ts` aponte para `http://localhost:8080`.

Para usar PostgreSQL localmente, configure `SPRING_DATASOURCE_*` (como no Compose) antes de iniciar o Spring.

---

## Estrutura do repositório

```
TaskFlowFromHell/
├── docker-compose.yaml
├── TaskFlow-BackEnd/          # Spring Boot + Dockerfile (Maven + Temurin 21)
└── TaskFlow-FrontEnd/         # Angular + Dockerfile (Node 22)
```

---

## O que falta para produção

Este projeto prioriza aprendizado e entrega de um MVP funcional. Evoluções naturais:

| Área | Melhoria |
|------|----------|
| **Banco** | Flyway/Liquibase em vez de `ddl-auto=update` |
| **Deploy** | Nginx (ou similar) como reverse proxy e servir build estático do Angular |
| **Cache / filas** | Redis, Kafka/RabbitMQ (se houver necessidade real) |
| **Segurança** | Refresh token, rotação de secrets, rate limiting, HTTPS |
| **Qualidade** | Testes de integração E2E, pipeline CI, cobertura consistente |
| **Produto** | Kanban com drag-and-drop, paginação, anexos, multi-tenant |
| **Observabilidade** | Logs estruturados, métricas, health checks expostos |

---

## Licença

Projeto de estudos — uso livre para referência e portfólio.
