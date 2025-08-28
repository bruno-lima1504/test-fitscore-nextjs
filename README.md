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

- Execução a cada 10 minutos (`*/10 * * * *`) via Vercel Cron
- Busca candidatos com "Fit Altíssimo" (≥80 pontos)
- Gera relatório HTML e envia para avaliadores
- Logs detalhados e tratamento de erros

## 📊 Sistema de Pontuação

### Cálculo dos Scores

```typescript
perfScore = Q1 + Q2 + Q3 + Q4; // max 40 (4 questões × 10)
energyScore = Q5 + Q6 + Q7; // max 30 (3 questões × 10)
cultureScore = Q8 + Q9 + Q10; // max 30 (3 questões × 10)
totalScore = perf + energy + culture; // max 100
```

### Classificações

- **≥80 pontos (≥80%)**: Fit Altíssimo 🟢
- **60-79 pontos (60-79%)**: Fit Aprovado 🔵
- **40-59 pontos (40-59%)**: Fit Questionável 🟡
- **<40 pontos (<40%)**: Fora do Perfil 🔴

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

### 3. Subir o Banco de Dados

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

- **Agendamento**: A cada 10 minutos (`*/10 * * * *`)
- **Busca**: Candidatos com score ≥80 (Fit Altíssimo)
- **Período**: Últimas 12 horas
- **Saída**: Relatório HTML enviado por email para avaliadores

### Logs

```bash
📊 Encontrados 3 candidatos com Fit Altíssimo
📧 Enviando relatório para 2 avaliadores
✅ Relatório enviado com sucesso
```

## 🧪 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Next.js dev server

# Build e produção
npm run build            # Build da aplicação
npm run start            # Produção

# Database
npm run db:generate      # Gerar cliente Prisma
npm run db:migrate       # Executar migrations
npm run db:seed          # Popular banco com dados de teste
npm run db:reset         # Reset completo do DB

# Infraestrutura
npm run services:up      # Subir PostgreSQL (Docker)
npm run services:down    # Parar PostgreSQL
npm run services:stop    # Pausar PostgreSQL

# Code quality
npm run lint             # ESLint
npm run lint:prettier:check  # Verificar formatoção
npm run lint:prettier:fix    # Corrigir formatoção
```

## 🎨 UI/UX Features

### Formulário Interativo

- **Navegação por tabs** com indicadores de progresso
- **Sliders visuais** para respostas (0-10)
- **Preview em tempo real** dos scores
- **Validação client-side** com feedback
- **Estados de loading** e confirmação

### Dashboard Responsivo

- **Tema claro/escuro** com persistência
- **Filtros em tempo real** sem refresh
- **Paginação eficiente**
- **Estados de UI** (loading, empty, error)
- **Badges coloridos** por classificação

### Acessibilidade

- Labels semânticos
- Navegação por teclado
- Contraste adequado
- Screen reader friendly

## 🔒 Segurança

- **Autenticação obrigatória** para dashboard
- **Middleware de proteção** de rotas
- **Validação server-side** com Zod
- **Sanitização** de inputs
- **Rate limiting** via NextAuth
- **CSRF protection** automática

## 📈 Performance

- **Server-Side Rendering** inicial
- **Client-side filtering** para UX fluida
- **Parallel data fetching**
- **Database indexing** otimizado
- **Connection pooling** com Prisma
- **Lazy loading** de componentes

## 🐛 Troubleshooting

### Problemas Comuns

**Erro de conexão com banco:**

```bash
# Verificar se PostgreSQL está rodando
docker compose ps

# Recriar container se necessário
docker compose down && docker compose up -d
```

**Erro de migração Prisma:**

```bash
# Reset completo (cuidado em produção!)
npm run db:reset

# Ou gerar e migrar manualmente
npm run db:generate
npm run db:migrate
```

**Emails não chegam:**

- Verificar se RESEND_API_KEY está configurado corretamente
- Confirmar que a API key tem permissões de envio
- Verificar logs do console para erros do Resend

**Worker cron não executa:**

```bash
# Verificar logs detalhados
npm run cron

# Verificar timezone (padrão: America/Sao_Paulo)
```

## 📝 Próximos Passos

### Possíveis Melhorias

- [ ] Testes unitários (Vitest)
- [ ] API REST para integrações externas
- [ ] Dashboard analytics avançado
- [ ] Exportação de relatórios personalizados
- [ ] Notificações push em tempo real
- [ ] Multi-tenancy para diferentes empresas
- [ ] Integração com ATS (Applicant Tracking Systems)

## 👥 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**FitScore LEGAL** - Sistema de Avaliação Cultural  
Desenvolvido com ❤️ e Next.js 15
