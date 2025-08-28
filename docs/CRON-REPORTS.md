# 📊 Sistema de Relatórios Automáticos FitScore

Este documento explica como funciona o sistema de relatórios automáticos para candidatos com "Fit Altíssimo" (≥ 80 pontos de 100).

## 🎯 Funcionamento

### Trigger

- **Frequência**: A cada 10 minutos
- **Expressão Cron**: `*/10 * * * *`
- **Plataforma**: Vercel Cron Jobs

### Ação

1. **Consulta**: Busca candidatos com FitScore ≥ 80 nas últimas 12 horas
2. **Relatório**: Gera relatório HTML detalhado com estatísticas
3. **Notificação**: Envia email para usuários com `position = "avaliador"`

## 🏗️ Arquitetura

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Vercel Cron   │───▶│  API Route       │───▶│  Report Service │
│   (12h cycle)   │    │  /api/cron/...   │    │  (Database)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │  Email Template  │───▶│     Resend      │
                       │  (React Email)   │    │   (SMTP Send)   │
                       └──────────────────┘    └─────────────────┘
```

## 📁 Arquivos Principais

### 1. Configuração

- **`vercel.json`**: Configuração do cron job (`*/10 * * * *`)
- **`/src/app/(public)/api/cron/high-score-report/route.ts`**: Endpoint do cron

### 2. Serviços

- **`/src/models/report.ts`**: Lógica de busca e processamento de relatórios
- **`/src/components/emailTemplates/highScoreReportEmail.tsx`**: Template do email

### 3. Testes

- **Teste manual**: Requisições diretas à API cron
- **Logs do Vercel**: Monitoramento em produção

## 🚀 Configuração

### Variáveis de Ambiente

```env
# Obrigatórias
RESEND_API_KEY="re_your_api_key"
NEXT_PUBLIC_BASE_URL="https://your-domain.vercel.app"
DATABASE_URL="postgresql://..."

# Opcional (segurança adicional)
CRON_SECRET="your-secret-key"
```

### Banco de Dados

Certifique-se de ter usuários com `position = "avaliador"`:

```sql
INSERT INTO "User" (name, email, password, position)
VALUES ('João Silva', 'joao@legal.com', 'hash_bcrypt', 'avaliador');
```

## 🧪 Testes

### Desenvolvimento Local

```bash
# 1. Iniciar servidor
npm run dev

# 2. Testar execução (apenas GET é suportado)
curl http://localhost:3000/api/cron/high-score-report

# 3. Ver resposta formatada
curl http://localhost:3000/api/cron/high-score-report | jq .
```

### Produção (Vercel)

- O cron executa automaticamente a cada 10 minutos após deploy
- Logs disponíveis no Vercel Dashboard > Functions
- Monitoramento via Vercel Analytics

## 📧 Template do Email

### Estrutura

- **Header**: Logo e título do relatório
- **Resumo**: Estatísticas do período (12h)
- **Lista**: Candidatos com score ≥ 80
- **CTA**: Link para o dashboard
- **Footer**: Informações do sistema

### Dados Incluídos

- Nome e email do candidato
- Pontuação total e por categoria
- Classificação (Fit Altíssimo, etc.)
- Data/hora da avaliação

## 🔒 Segurança

### Autenticação

- Header `Authorization: Bearer ${CRON_SECRET}` (opcional)
- Verificação de origem Vercel
- Rate limiting automático

### Logs

- Execução completa logada no console
- Dados sensíveis mascarados
- Métricas de sucesso/falha

## 📊 Monitoramento

### Métricas Importantes

- Candidatos com Fit Altíssimo encontrados (score ≥ 80)
- Número de avaliadores notificados
- Taxa de entrega de emails (via Resend)
- Tempo de execução da função
- Erros e falhas

### Logs de Exemplo

```json
{
  "timestamp": "2024-01-15T12:00:00Z",
  "candidates": {
    "total": 3,
    "highScore90Plus": 1
  },
  "emails": {
    "evaluatorsFound": 2,
    "successful": 2,
    "failed": 0
  }
}
```

## 🔧 Troubleshooting

### Problemas Comuns

**1. Emails não enviados**

- Verificar `RESEND_API_KEY`
- Conferir domínio verificado no Resend
- Checar logs do Vercel

**2. Nenhum avaliador encontrado**

- Verificar usuários com `position = "avaliador"`
- Conferir conexão com banco de dados

**3. Cron não executa**

- Verificar `vercel.json` no root
- Conferir sintaxe do cron expression
- Checar deploy na Vercel

### Debug Local

```bash
# Testar execução e ver logs detalhados
curl http://localhost:3000/api/cron/high-score-report | jq .

# Verificar logs no terminal do Next.js
npm run dev

# Monitorar requisições em tempo real
tail -f .next/trace
```

## 🎯 Próximas Melhorias

- [ ] Dashboard para configurar frequência do cron
- [ ] Templates de email personalizáveis
- [ ] Filtros avançados (por período, score mínimo)
- [ ] Webhooks para integrações externas
- [ ] Export de relatórios em PDF/CSV
- [ ] Métricas e analytics no dashboard admin
- [ ] Notificações via Slack/Teams

## 📞 Suporte

Para dúvidas ou problemas:

1. Verificar logs no Vercel Dashboard > Functions
2. Testar localmente: `curl http://localhost:3000/api/cron/high-score-report`
3. Conferir configuração no `vercel.json` (expressão cron)
4. Validar variáveis de ambiente (RESEND_API_KEY)
5. Verificar usuários com position="avaliador" no banco
