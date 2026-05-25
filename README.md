Desafio Full Stack — “TaskFlow”

Um mini sistema de gerenciamento de tarefas estilo Trello simplificado.

Objetivo

Construir uma aplicação full stack onde usuários podem:

Criar tarefas
Listar tarefas
Atualizar status
Filtrar tarefas
Excluir tarefas
Fazer login simples
Stack
Backend
Java 21
Spring Boot
Spring Web
Spring Data JPA
Spring Security + JWT simples
PostgreSQL (ou H2 se quiser rapidez)
Lombok
Frontend
Angular 19+
Angular Material
Reactive Forms
RxJS
Signals (opcional, mas fica moderno no portfólio)
Escopo ideal para 5 horas
Funcionalidades obrigatórias
Autenticação
Login
JWT armazenado no frontend
Interceptor Angular enviando token
Tarefas

Cada tarefa possui:

id
título
descrição
status:
TODO
IN_PROGRESS
DONE
prioridade:
LOW
MEDIUM
HIGH
data de criação
Backend

Endpoints:

POST /auth/login
GET /tasks
POST /tasks
PUT /tasks/{id}
DELETE /tasks/{id}
Frontend

Telas:

Login
Dashboard de tarefas
Diferenciais que valorizam MUITO no portfólio

Esses dão “cara de pleno” sem muito esforço.

1. Filtro de tarefas

Por:

status
prioridade
2. Loading states
Spinner
Skeleton
Botão desabilitado durante request
3. Toasts

Feedback visual:

“Tarefa criada”
“Erro ao salvar”
4. Organização limpa

No Angular:

core/
shared/
features/tasks/

No Spring:

controller/
service/
repository/
dto/
security/
5. Docker Compose

Subir:

backend
postgres

Isso impressiona bastante recrutador.

Arquitetura recomendada
Backend
Entidades
User
Task
DTOs
TaskRequestDTO
TaskResponseDTO
LoginRequestDTO
Fluxo

Controller → Service → Repository

Estrutura Angular
src/app
├── core
│   ├── interceptors
│   ├── services
│   └── guards
├── shared
│   ├── components
│   └── models
├── features
│   ├── auth
│   └── tasks
Como deixar “bonito” rapidamente

Use:

Angular Material
Dark mode simples
Cards para tarefas
Chips coloridos para status

Fica visualmente profissional muito rápido.

Fluxo do usuário
Login
Visualiza tarefas
Cria tarefa
Atualiza status
Filtra tarefas
Remove tarefa
Critérios que recrutadores olham

Eles normalmente observam:

Backend
REST organizado
DTOs
Tratamento de exceção
Segurança básica
Separação de camadas
Frontend
Componentização
Estado
Boas práticas Angular
Responsividade básica
Integração limpa com API
O que NÃO fazer

Evite:

Microserviços
Kafka
Clean Architecture exagerada
Kubernetes
Testes ultra complexos
Redis
CQRS

Para vaga júnior isso pode parecer overengineering.

Como publicar
Backend

Suba no:

Render
ou
Railway
Frontend

Suba no:

Vercel
ou
Netlify
README ideal

Inclua:

stack usada
screenshots
arquitetura
instruções de execução
endpoints
melhorias futuras
Melhorias futuras (ótimo para GitHub)

Depois das 5 horas você pode evoluir:

drag and drop estilo Kanban
testes unitários
paginação
websocket
refresh token
upload de anexos
tema customizado
Nível que esse projeto demonstra

Esse desafio demonstra:

CRUD real
autenticação
integração full stack
arquitetura moderna
Angular + Spring na prática

Isso já é suficiente para um excelente projeto de portfólio júnior/intermediário.

Variante mais “diferenciada”

Se quiser fugir do clássico “to-do”:

Sistema de Tickets de Suporte

ou

Controle de Hábitos

ou

Mini ERP de Estoque

ou

Controle Financeiro Pessoal

Mas sinceramente:
um “task manager” MUITO bem feito impressiona mais do que um ERP incompleto.

Minha sugestão prática

Faça em 3 etapas:

Etapa 1 — MVP (3h)
Login
CRUD tarefas
Integração Angular + Spring
Etapa 2 — UX (1h)
Material UI
filtros
toasts
loading
Etapa 3 — Portfólio (1h)
Docker
README
Deploy
