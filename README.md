# FitScore - Sistema de Avaliação Cultural LEGAL

Sistema completo de avaliação de fit cultural para candidatos, desenvolvido com Next.js 15 e arquitetura MVC.

## 🏗️ Arquitetura

### Stack Tecnológica

- **Frontend**: Next.js 15 (App Router), React 18, TypeScript
- **UI**: TailwindCSS + shadcn/ui
- **Backend**: Route Handlers, Models e Services
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: JWT com middleware personalizado
- **Email**: Resend API
- **Cron**: Vercel Cron Jobs para relatórios automáticos

### Padrão MVC

- **Models**: Camada de acesso aos dados (Prisma + lógica de domínio)
- **Views**: Páginas e componentes React
- **Controllers**: Route Handlers que orquestram Models e Services

```
/src/app                # Views (páginas React)
/src/components         # Componentes UI reutilizáveis
/src/models             # Modelos de domínio e acesso aos dados
/src/services           # Serviços e regras de negócio
/src/lib                # Utilitários, tipos, configurações
/prisma                 # Database schema e migrations
```

## 🚀 Funcionalidades

### 1. Formulário FitScore Público (`/`)

- Formulário interativo com 10 perguntas em 3 categorias:
  - **Performance** (4 perguntas): experiência, qualidade, habilidades, resolução
  - **Energia** (3 perguntas): disponibilidade, prazos, pressão
  - **Cultura** (3 perguntas): valores LEGAL, colaboração, aprendizado
- Interface com Tabs, Sliders (0-10), Progress indicators
- Preview de scores antes do envio
- Cálculo automático: soma direta das respostas por categoria
- Classificação automática baseada no score total (0-100)
- Envio de email com resultado para o candidato

### 2. Autenticação (`/login`)

- Autenticação via email/senha com JWT
- Middleware personalizado para proteção de rotas
- Sessões gerenciadas via cookies seguros

### 3. Dashboard Administrativo (`/dashboard`)

- **Acesso protegido** (middleware de autenticação)
- **Estatísticas**: total de avaliações, distribuição por classificação
- **Listagem paginada** com filtros:
  - Busca por nome/email
  - Filtro por classificação
  - Ordenação por data/score/nome
- **Estados de UI**: loading, empty, error
- **Tema claro/escuro** com switch
- Carregamento inicial via RSC, filtros client-side

### 4. Worker Cron Automático

- Execução a cada 10 minutos (`0 12 * * *`) via Vercel Cron
- Busca candidatos com "Fit Altíssimo" (≥80 pontos)
- Gera relatório HTML e envia para avaliadores
- Logs detalhados e tratamento de erros

## 🛠️ Setup e Instalação

### Pré-requisitos

- Node.js 20+
- Docker e Docker Compose
- Conta Resend para envio de emails

### 1. Clonar e Instalar

```bash
git clone <repo-url>
cd legal-fitscore
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo de exemplo e configure:

```bash
cp env.example .env
```

Configure as seguintes variáveis no `.env`:

```bash
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=fitscore
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fitscore?schema=public

# JWT Authentication
JWT_SECRET=sua-chave-secreta-hex-aqui
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Resend API
RESEND_API_KEY=re_sua-api-key-aqui
NEXT_PUBLIC_RESEND_DOMAIN="seudominio.com.br"

```

### 3. Para executar todos os serviços do ambiente de desenvolvimento:

```bash
npm run services:up
```

### 4. Configurar Prisma

```bash
# Gerar cliente Prisma
npm run db:generate

# Executar migrations
npm run db:migrate
```

### 5. Executar a Aplicação

#### Desenvolvimento

```bash
npm run dev
```

#### Login

email: avaliador@fitscore.com
password: senha123

**Nota**: O cron worker executa automaticamente na Vercel em produção. Para desenvolvimento, os relatórios podem ser testados via requisições diretas à API.

### 6. Acessar a Aplicação

- **Formulário público**: http://localhost:3000
- **Login dashboard**: http://localhost:3000/login
- **Dashboard**: http://localhost:3000/dashboard (após login)
- **API Cron (teste)**: http://localhost:3000/api/cron/high-score-report

## 🗂️ Estrutura do Projeto

```
legal-fitscore/
├── src/
│   ├── app/
│   │   ├── (panel)/                  # Área protegida
│   │   │   ├── api/user/route.ts        # API de usuário
│   │   │   └── dashboard/               # Dashboard admin
│   │   ├── (public)/                 # Área pública
│   │   │   ├── api/cron/                # Endpoints de cron
│   │   │   ├── api/submit-form/         # Envio de formulário
│   │   │   └── page.tsx                 # Formulário FitScore
│   │   ├── layout.tsx               # Layout raiz
│   │   └── globals.css              # Estilos globais
│   ├── components/
│   │   ├── ui/                      # Componentes shadcn/ui
│   │   ├── emailTemplates/          # Templates de email
│   │   └── ScoreBadge.tsx          # Badge de classificação
│   ├── models/
│   │   ├── user.ts                  # Modelo de usuário
│   │   ├── submission.ts            # Modelo de submissão
│   │   └── report.ts                # Modelo de relatório
│   ├── services/
│   │   ├── scoring.ts               # Lógica de pontuação
│   │   ├── listService.ts           # Serviços de listagem
│   │   └── emailService.ts          # Envio de emails
│   ├── lib/
│   │   ├── types.ts                 # Tipos TypeScript
│   │   ├── zod.ts                   # Schemas de validação
│   │   └── utils.ts                 # Utilitários
│   └── middleware.ts            # Middleware de autenticação
├── prisma/
│   └── schema.prisma            # Schema do banco
├── infra/
│   └── compose.yml              # PostgreSQL container
├── docs/
│   └── CRON-REPORTS.md          # Documentação do cron
├── vercel.json                  # Configuração do cron
├── package.json                 # Scripts e dependências
└── README.md                    # Esta documentação
```

## 📧 Configuração de Email

### Resend API

1. Criar conta em [resend.com](https://resend.com)
2. Gerar uma API key no dashboard
3. Configurar no `.env`:

```bash
RESEND_API_KEY=re_sua-api-key-aqui
```

**Importante**: O Resend é usado tanto para desenvolvimento quanto produção, simplificando a configuração e garantindo consistência.

## 🔄 Worker Cron

O sistema inclui um worker que executa automaticamente na Vercel:

### Funcionamento

- **Agendamento**: 1 vez por dia (`0 12 * * *`)
- **Busca**: Candidatos com score ≥80 (Fit Altíssimo)
- **Período**: Últimas 12 horas
- **Saída**: Relatório HTML enviado por email para avaliadores

para mais informações veja em ./docs/CRON_REPORTS.md.

### Logs

```bash
📊 Encontrados 3 candidatos com Fit Altíssimo
📧 Enviando relatório para 2 avaliadores
✅ Relatório enviado com sucesso
```
