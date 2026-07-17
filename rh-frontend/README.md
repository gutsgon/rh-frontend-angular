# RH Frontend (Angular)

Front-end em Angular para o sistema de gestão de pessoal do RH — Prova Técnica
Prática (Zdoc — Desenvolvedor Júnior). Este projeto consome a API
[`rh-backend`](https://github.com/gutsgon/rh-backend) (.NET 9) e cobre as
quatro telas exigidas pelo enunciado:

- **Principal** — listagem de todos os funcionários cadastrados e salário médio.
- **Funcionários** — cadastro, edição, consulta detalhada (cargo, férias,
  histórico de alterações) e desligamento.
- **Férias** — listagem de todas as férias, cadastro, edição e exclusão.
- **Relatório** — geração e visualização do PDF de funcionários.

O enunciado também prevê um front-end em WebForms; ele vive em outro
repositório/projeto e não faz parte deste.

---

## Pré-Requisitos

- [Node.js](https://nodejs.org/) 20+ e npm 10+.
- [Angular CLI](https://angular.dev/tools/cli) 20 (`npm install -g @angular/cli`,
  ou use `npx ng` sem instalar globalmente).
- A API [`rh-backend`](https://github.com/gutsgon/rh-backend) rodando e
  acessível — por padrão em `http://localhost:5234` (ver `docker-compose.yml`
  daquele repositório).

---

## Instruções Para Rodar O Sistema Localmente

1. Suba a API primeiro (no repositório `rh-backend`):
   ```bash
   docker-compose up --build
   ```
   A API deve responder em `http://localhost:5234` (Swagger em
   `http://localhost:5234/swagger/index.html`).

2. Instale as dependências deste projeto:
   ```bash
   npm install
   ```

3. Confirme a URL da API em `src/environments/environment.development.ts`
   (por padrão já aponta para `http://localhost:5234`):
   ```ts
   export const environment = {
     production: false,
     hostUrl: 'http://localhost:5234',
     apiUrl: 'http://localhost:5234/api',
   };
   ```

4. Rode o servidor de desenvolvimento:
   ```bash
   npm start
   ```
   Acesse `http://localhost:4200`.

5. Para gerar um build de produção:
   ```bash
   npm run build
   ```
   Os artefatos ficam em `dist/rh-frontend/browser/` — ajuste
   `src/environments/environment.ts` para a URL real da API antes de buildar
   para produção.

---

## Considerações Sobre O Banco De Dados

Este projeto não acessa banco de dados diretamente — toda persistência
acontece através da API `rh-backend`, que é quem se conecta ao SQL Server.
Para rodar este front-end é necessário apenas que a API esteja no ar; veja o
README do `rh-backend` para instruções de banco de dados (SQL Server via
Docker Compose, script `init.sql`).

**Importante:** o banco de dados do `rh-backend` não vem com nenhum cargo
pré-cadastrado. Ao usar a tela de cadastro de funcionário pela primeira vez,
use o botão "Novo cargo" para criar pelo menos um cargo antes de salvar.

---

## Tecnologias Utilizadas

- Angular 20 (standalone components, signals, `@if`/`@for`/`@let`, zoneless
  change detection).
- Angular Material para os componentes de UI (tabelas, formulários, diálogos).
- Fontes (Roboto) e ícones (Material Icons) empacotados localmente via
  `@fontsource/roboto` e `material-icons` — sem dependência de CDN externo
  em runtime.

Este projeto foi gerado com Angular CLI 20.1.5. O suporte a
Server-Side Rendering (SSR) do scaffold inicial foi removido: é uma
aplicação puramente client-side, sem necessidade de SSR/SEO para um sistema
interno de RH.

---

## Estrutura do Projeto

```
src/app/
  core/
    models/       # interfaces TypeScript espelhando os DTOs da API
    services/      # serviços HttpClient (Funcionario, Cargo, Ferias, Historico, Relatorio)
  features/
    principal/                     # tela Principal
    funcionarios/
      funcionario-list/            # listagem + filtro por cargo + desligamento
      funcionario-form/            # cadastro e edição (rotas /novo e /:id/editar)
      funcionario-detalhes/        # consulta completa (cargo, férias, histórico)
    ferias/
      ferias-list/                 # listagem de férias
      ferias-form-dialog/          # cadastro/edição de férias (MatDialog)
    relatorio/                     # geração/visualização do PDF
  shared/
    layout/                        # toolbar de navegação + router-outlet
```

## Rodando os testes

```bash
npm test
```
